# BlackPearl build toolchain

Phase 1 is pinned to Android Gradle Plugin 7.2.2, Gradle 7.3.3, Kotlin 1.7.10, JDK 11 and compile/target SDK 33.

AndroidIDE documentation states that projects must use AGP 7.2.0 or newer and that JDK 11/17 are available. This project therefore stays at the conservative AGP 7.2.2 / JDK 11 combination for AndroidIDE compatibility.

Open the repository as a project in AndroidIDE. Use AndroidIDE's configured Gradle distribution for sync/build rather than relying on a missing wrapper JAR.
