# Java 17 LTS Installation Guide

## Quick Download Links

### Option 1: Direct Download (Recommended)
**Latest Java 17 LTS for Windows x64:**
- Visit: https://adoptium.net/temurin/releases/?version=17
- Look for: **Windows x64 MSI** installer
- File name will be similar to: `OpenJDK17U-jdk_x64_windows_hotspot_17.0.14_7.msi`

### Option 2: Direct Link (May need to be updated)
Try this direct link for the latest Java 17:
https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.14%2B7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.14_7.msi

## Installation Steps

### 1. Download the MSI Installer
- Click the download link above
- Save the file to your Downloads folder
- File size: ~180-200 MB

### 2. Run the Installer
1. Double-click the downloaded `.msi` file
2. Click "Next" on the welcome screen
3. **IMPORTANT**: On the "Custom Setup" screen, make sure these options are selected:
   - ✅ **Set JAVA_HOME variable** - ADD THIS FEATURE
   - ✅ **JavaSoft (Oracle) registry keys** - ADD THIS FEATURE
   - ✅ **Add to PATH** - ADD THIS FEATURE (if available)
4. Choose installation directory (default is fine: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot\`)
5. Click "Install"
6. Wait for installation to complete (~2-3 minutes)
7. Click "Finish"

### 3. Verify Installation
Open a NEW PowerShell window (important - must be new) and run:
```powershell
java -version
```

Expected output:
```
openjdk version "17.0.14" 2025-01-21 LTS
OpenJDK Runtime Environment Temurin-17.0.14+7 (build 17.0.14+7-LTS)
OpenJDK 64-Bit Server VM Temurin-17.0.14+7 (build 17.0.14+7-LTS, mixed mode, sharing)
```

### 4. Check JAVA_HOME
```powershell
echo $env:JAVA_HOME
```

Expected output:
```
C:\Program Files\Eclipse Adoptium\jdk-17.0.14.7-hotspot
```

## After Installation

### Start the Backend Server
Once Java 17 is installed, run these commands:

```powershell
# Navigate to backend directory
cd "c:/Event Managemnt system/smart-intercollege-event-hackathon-manager/smart-intercollege-event-hackathon-manager/backend"

# Clean previous build artifacts
mvn clean

# Compile and run
mvn spring-boot:run
```

### Expected Success Output
```
[INFO] BUILD SUCCESS
...
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.x.x)

...
Started EventManagerApplication in X.XXX seconds (JVM running for X.XXX)
```

## Troubleshooting

### If java -version still shows Java 25:
1. Close ALL PowerShell/Command Prompt windows
2. Open a NEW PowerShell window
3. Try again

### If JAVA_HOME is not set:
Manually set it:
```powershell
# For current session
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.14.7-hotspot"

# Permanently (run as Administrator)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.14.7-hotspot", "Machine")
```

### If Maven still uses wrong Java:
```powershell
# Force Maven to use Java 17
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.14.7-hotspot"
mvn -version
```

## What Happens After Installation

1. ✅ Backend will compile successfully
2. ✅ All Lombok annotations will work
3. ✅ Spring Boot application will start
4. ✅ API endpoints will be accessible at http://localhost:8080
5. ✅ Frontend can connect to backend
6. ✅ Full application functionality restored

## Timeline
- Download: 2-5 minutes (depending on internet speed)
- Installation: 2-3 minutes
- Verification: 1 minute
- Backend compilation & startup: 2-3 minutes
- **Total: ~10 minutes**

---
**Next Step**: Download and install Java 17, then let me know when it's complete!
