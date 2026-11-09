"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "webui");
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const MAX_BODY = 20 * 1024;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;
const clients = new Map();

function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !Object.prototype.hasOwnProperty.call(process.env, match[1])) {
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  }
}
loadEnv();

function send(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
}

function allowedByRateLimit(ip) {
  const now = Date.now();
  const entry = clients.get(ip);
  if (!entry || now - entry.start >= RATE_WINDOW_MS) {
    clients.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count += 1;
  return entry.count <= RATE_LIMIT;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try { resolve(JSON.parse(body || "{}")); }
      catch { reject(new Error("Request must contain valid JSON.")); }
    });
    req.on("error", reject);
  });
}

function extractReply(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  for (const item of data.output || []) {
    for (const part of item.content || []) {
      if (part.type === "output_text" && part.text) return part.text.trim();
    }
  }
  return "";
}

async function handleChat(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST for chat." }, { Allow: "POST" });
  if (!allowedByRateLimit(req.socket.remoteAddress || "unknown")) {
    return send(res, 429, { error: "Rate limit reached. Wait one minute and try again." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return send(res, 503, { error: "AI is not configured. Add OPENAI_API_KEY to your server .env file." });
  }

  let body;
  try { body = await readJson(req); }
  catch (error) { return send(res, 400, { error: error.message }); }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 4000) {
    return send(res, 400, { error: "Message is required and must be 4,000 characters or fewer." });
  }

  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
  const safeHistory = history
    .filter(item => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
    .map(item => ({ role: item.role, content: item.content.slice(0, 4000) }));

  const input = [
    {
      role: "system",
      content: "You are AairaGalaxy, a concise, helpful personal AI assistant. Reply in the selected language when possible: " + ({ en: "Indian English", hi: "Hindi", pa: "Punjabi" }[body.language] || "the language used by the user") + ". Follow the language of the user if they switch languages. Be accurate. Do not claim to control devices, access private data, or execute commands unless a connected tool explicitly confirms it. Local device commands are handled separately by the browser."
    },
    ...safeHistory,
    { role: "user", content: message }
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input,
        max_output_tokens: 700
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const detail = data.error && data.error.message ? data.error.message : "OpenAI request failed.";
      return send(res, upstream.status >= 500 ? 502 : 400, { error: detail });
    }
    const reply = extractReply(data);
    if (!reply) return send(res, 502, { error: "AI returned no text. Please try again." });
    return send(res, 200, { reply });
  } catch (error) {
    const detail = error.name === "AbortError" ? "AI request timed out." : "Could not reach the AI service.";
    return send(res, 502, { error: detail });
  } finally {
    clearTimeout(timeout);
  }
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function serveStatic(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    return res.end("Method not allowed");
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch { res.writeHead(400); return res.end("Bad request"); }
  if (pathname === "/") pathname = "/index.html";
  const target = path.resolve(ROOT, "." + pathname);
  if (!target.startsWith(ROOT + path.sep) && target !== path.join(ROOT, "index.html")) {
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.stat(target, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404); return res.end("Not found"); }
    const headers = {
      "Content-Type": MIME[path.extname(target).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "X-Frame-Options": "DENY",
      "Cache-Control": "no-cache"
    };
    res.writeHead(200, headers);
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(target).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.url && req.url.split("?")[0] === "/api/chat") {
    const origin = req.headers.origin;
    const host = req.headers.host || "";
    const sameOrigin = origin === "http://" + host || origin === "https://" + host;
    const androidAssetOrigin = origin === "https://appassets.androidplatform.net";

    if (origin && !sameOrigin && !androidAssetOrigin && HOST !== "0.0.0.0") {
      return send(res, 403, { error: "Cross-origin requests are not allowed." });
    }
    if (androidAssetOrigin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
    if (req.method === "OPTIONS") {
      res.writeHead(204, { "Cache-Control": "no-store" });
      return res.end();
    }
    return handleChat(req, res);
  }
  return serveStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log("AairaGalaxy running at http://" + HOST + ":" + PORT);
});
