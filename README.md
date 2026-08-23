# BlackPearl

BlackPearl is a local-first white-hat Android security workstation.

## Final UI
The final UI is locked to the modern dark command-center design:

- BLACKPEARL branded header with SAFE status
- LEARN. TEST. DEFEND. hero panel
- Operations: RECON, NETWORK, WEB SECURITY
- Analysis: ANDROID SECURITY, CRYPTO / HASH
- Labs & Evidence: CTF LABS, FINDINGS, REPORTS
- Settings & safety controls
- Full-screen module pages with back navigation
- Persistent local findings and report generation
- Consistent dark/cyan/green visual language

## Final functionality
- Recon: localhost-only DNS resolution
- Network: read-only device connectivity and localhost reachability
- Web security: localhost-only HTTP HEAD/header inspection
- Android security posture checks
- Crypto/hash: SHA-256, SHA-512, Base64, URL encode/decode, local AES
- Controlled CTF lab screens
- Findings tracker with severity, evidence, resolve and delete
- Local security report generator
- Safety settings
- Android Back navigation between screens

## Safety boundary
Active testing is restricted to the local device and localhost. No remote scanning, credential theft, persistence, privilege escalation, exploitation, evasion, or unauthorized access features are included.

## Build baseline
- Android Gradle Plugin 7.2.2
- Gradle 7.3.3
- Kotlin 1.7.10
- JDK 11
- compileSdk 33
- targetSdk 33
- minSdk 23

## CI
The GitHub Actions Android Build workflow builds, verifies and uploads the debug APK. Emulator smoke testing is intentionally not part of the release build gate.

## AndroidIDE
Open the project in AndroidIDE and run the debug build. If using the terminal, AndroidIDE's AAPT2 override may be required:

`./gradlew -Pandroid.aapt2FromMavenOverride=$HOME/.androidide/aapt2 assembleDebug`
