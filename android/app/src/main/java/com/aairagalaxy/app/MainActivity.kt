package com.aairagalaxy.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private var pendingWebPermission: PermissionRequest? = null

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { results ->
        val request = pendingWebPermission ?: return@registerForActivityResult
        if (results.isNotEmpty() && results.values.all { it }) {
            request.grant(request.resources)
        } else {
            request.deny()
        }
        pendingWebPermission = null
    }

    private val assetLoader by lazy {
        WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            javaScriptCanOpenWindowsAutomatically = false
            setSupportMultipleWindows(false)
            mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW
        }
        webView.addJavascriptInterface(NativeBridge(), "AairaNative")
        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView, request: WebResourceRequest
            ): android.webkit.WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun shouldOverrideUrlLoading(
                view: WebView, request: WebResourceRequest
            ): Boolean {
                return request.url.host != "appassets.androidplatform.net"
            }
        }
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                runOnUiThread {
                    val requested = request.resources.toSet()
                    val needed = mutableListOf<String>()
                    if (PermissionRequest.RESOURCE_AUDIO_CAPTURE in requested) {
                        needed += Manifest.permission.RECORD_AUDIO
                    }
                    if (PermissionRequest.RESOURCE_VIDEO_CAPTURE in requested) {
                        needed += Manifest.permission.CAMERA
                    }
                    if (needed.isEmpty()) {
                        request.deny()
                        return@runOnUiThread
                    }
                    val missing = needed.filter {
                        ContextCompat.checkSelfPermission(
                            this@MainActivity, it
                        ) != PackageManager.PERMISSION_GRANTED
                    }
                    if (missing.isEmpty()) {
                        request.grant(request.resources)
                    } else {
                        pendingWebPermission?.deny()
                        pendingWebPermission = request
                        permissionLauncher.launch(missing.toTypedArray())
                    }
                }
            }

            override fun onPermissionRequestCanceled(request: PermissionRequest) {
                if (pendingWebPermission == request) pendingWebPermission = null
            }
        }
        setContentView(webView)
        if (savedInstanceState == null) {
            webView.loadUrl("https://appassets.androidplatform.net/assets/webui/index.html")
        } else {
            webView.restoreState(savedInstanceState)
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else finish()
            }
        })
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        pendingWebPermission?.deny()
        pendingWebPermission = null
        webView.stopLoading()
        webView.destroy()
        super.onDestroy()
    }

    inner class NativeBridge {
        @JavascriptInterface
        fun getApiBaseUrl(): String = BuildConfig.AIRA_API_BASE_URL.trimEnd('/')
    }
}
