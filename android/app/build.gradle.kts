import org.gradle.api.tasks.Copy

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val webUiSource = rootProject.projectDir.parentFile.resolve("webui")
val generatedWebAssets = layout.buildDirectory.dir("generated/aairaAssets")
val apiBaseUrl = providers.gradleProperty("AIRA_API_BASE_URL").orElse("").get()

android {
    namespace = "com.aairagalaxy.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.aairagalaxy.app"
        minSdk = 23
        targetSdk = 35
        versionCode = 5
        versionName = "0.5.0"
        buildConfigField("String", "AIRA_API_BASE_URL", "\"$apiBaseUrl\"")
    }

    buildFeatures {
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    sourceSets["main"].assets.srcDir(generatedWebAssets)
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-ktx:1.10.0")
    implementation("androidx.webkit:webkit:1.12.1")
}

val bundleWebUi by tasks.registering(Copy::class) {
    from(webUiSource)
    into(generatedWebAssets.map { it.dir("webui") })
}

tasks.named("preBuild").configure {
    dependsOn(bundleWebUi)
}
