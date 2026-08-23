# BlackPearl

BlackPearl is a local-first white-hat Android security workstation.

## Phase 1
- Modern dark dashboard
- Recon: localhost-only DNS resolution
- Network: read-only device connectivity and localhost reachability
- Web security: localhost-only HTTP HEAD/header inspection
- Android security posture checks
- Crypto/hash: SHA-256, SHA-512, Base64, URL encode/decode, local AES
- Controlled CTF lab screens
- Findings tracker
- Local report generator
- Safety settings
- Android Back navigation between screens

## Safety boundary
Active testing is restricted to the local device and localhost. No remote scanning, credential theft, persistence, privilege escalation, exploitation, evasion, or unauthorized access features are included.

## AndroidIDE
The project uses Android Gradle Plugin 7.2.2, Gradle 7.3.3, Kotlin 1.7.10, JDK 11, and compile/target SDK 33 to stay within the documented AndroidIDE compatibility floor.

## Build
Open the project in AndroidIDE and run the debug build. If using the terminal, AndroidIDE's AAPT2 override may be required:

`./gradlew -Pandroid.aapt2FromMavenOverride=$HOME/.androidide/aapt2 assembleDebug`
