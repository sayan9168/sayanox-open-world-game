# 🤖 Sayanox AI Agent — Android App

**Local AI Phone Controller** — Ollama দিয়ে চলে, fully offline, privacy-first।

---

## 📱 Features

| Feature | Details |
|---|---|
| 🧠 AI Chat | Ollama (Gemma, Phi, Llama) দিয়ে local AI |
| 📞 Phone Control | Call করা, SMS পাঠানো |
| 👆 Screen Control | Tap, swipe, scroll, text type |
| 🗣️ Voice Input | Bengali + English speech recognition |
| 🔊 Voice Output | TTS response |
| 📨 Auto SMS Reply | SMS আসলে AI দিয়ে reply |
| ⚙️ App Automation | WhatsApp, Settings, যেকোনো app control |
| 🔒 Privacy | সব processing local/on-device |

---

## 🛠️ VS Code Setup

### Step 1: Prerequisites Install

```bash
# Java 17 install (if not done)
# Download from: https://adoptium.net/

# Android SDK
# Download Android Studio just for SDK:
# https://developer.android.com/studio

# VS Code Extensions install করো:
# - "Extension Pack for Java" by Microsoft
# - "Kotlin" by fwcd  
# - "Android" by Google (optional)
```

### Step 2: Android SDK Path Set করো

**Windows:**
```
C:\Users\YOUR_NAME\AppData\Local\Android\Sdk
```

**Mac/Linux:**
```
~/Library/Android/sdk
```

`local.properties` file তৈরি করো (project root-এ):
```
sdk.dir=C:\\Users\\YOUR_NAME\\AppData\\Local\\Android\\Sdk
```

### Step 3: Project Open ও Build

```bash
# VS Code-এ terminal খোলো (Ctrl+`)
cd SayanoxAI

# Windows:
.\gradlew.bat assembleDebug

# Mac/Linux:
chmod +x gradlew
./gradlew assembleDebug
```

APK পাবে: `app/build/outputs/apk/debug/app-debug.apk`

### Step 4: Phone-এ Install

```bash
# USB debugging on করো, তারপর:
adb install app/build/outputs/apk/debug/app-debug.apk

# অথবা APK file phone-এ copy করে install করো
```

---

## 🖥️ Ollama Setup (PC)

```bash
# 1. Ollama install: https://ollama.com

# 2. Model download (choose one):
ollama pull gemma2:2b      # Best for Bengali, 2GB
ollama pull phi3:mini       # Fast, 2GB  
ollama pull llama3.2:3b    # Good quality, 2GB
ollama pull qwen2.5:3b     # Multilingual, 2GB

# 3. Network-এ accessible করো:
OLLAMA_HOST=0.0.0.0 ollama serve

# Windows CMD:
set OLLAMA_HOST=0.0.0.0
ollama serve
```

### Phone App-এ URL দাও:
- **Same WiFi:** `http://YOUR_PC_IP:11434`
- **Emulator:** `http://10.0.2.2:11434`
- **USB tethering:** `http://192.168.42.129:11434`

PC-র IP বের করো:
- Windows: `ipconfig` → IPv4 Address
- Mac/Linux: `ifconfig` বা `ip addr`

---

## 📱 App Use করা

### Permissions Enable করো

1. **Accessibility Service** (সবচেয়ে important!)
   - Settings → Accessibility → Installed Services → Sayanox AI Agent → ON

2. **Notification Access** (SMS auto-reply এর জন্য)
   - Settings → Apps → Special app access → Notification access → Sayanox

### Example Commands

```
বাংলা:
"Baba-ke call koro"
"Mama-ke message pathao: 'Ki khobor acho?'"
"WhatsApp kholo ar Rina-ke hello pathao"
"Alarm set koro sokale 7:30 te"
"Battery koto percent ache?"

English:
"Open WhatsApp and message John: Hey!"
"Set an alarm for 6 AM tomorrow"
"Take a screenshot"
"Open Settings and turn on WiFi"
"Call 01711000000"
```

---

## 🏗️ Project Structure

```
SayanoxAI/
├── app/src/main/
│   ├── AndroidManifest.xml          # All permissions
│   ├── java/com/sayanox/aiagent/
│   │   ├── MainActivity.kt          # Entry point + Navigation
│   │   ├── SayanoxApp.kt           # Application class
│   │   ├── agent/
│   │   │   └── AgentBrain.kt       # AI command parser + executor
│   │   ├── data/
│   │   │   ├── local/Database.kt   # Room DB
│   │   │   ├── model/Models.kt     # Data models
│   │   │   └── repository/         # Settings DataStore
│   │   ├── ollama/
│   │   │   └── OllamaClient.kt     # Ollama API client
│   │   ├── service/
│   │   │   ├── SayanoxAccessibilityService.kt  # Screen control
│   │   │   └── Services.kt         # SMS, Notification, Boot
│   │   ├── ui/
│   │   │   ├── screens/            # Chat, Settings, Permissions UI
│   │   │   └── theme/Theme.kt      # Dark purple theme
│   │   ├── utils/
│   │   │   └── VoiceManager.kt     # STT + TTS
│   │   └── viewmodel/
│   │       └── MainViewModel.kt    # App state management
│   └── res/
│       ├── xml/accessibility_service_config.xml
│       └── values/
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties
```

---

## 🔧 Troubleshooting

**Build error: SDK not found**
→ `local.properties`-এ SDK path দাও

**Ollama connection failed**
→ `OLLAMA_HOST=0.0.0.0 ollama serve` দিয়ে run করো
→ Firewall-এ 11434 port open করো

**Accessibility not working**
→ Settings → Accessibility → Sayanox → Enable করো
→ App force stop করে reopen করো

**Voice not working**
→ Google app install করো (Speech Recognition engine)
→ Bengali language pack download করো

---

## 🚀 Sayanox Brand

এই app **Sayanox** brand-এর প্রথম product।
- Privacy-first AI
- Local processing
- Bengali language support
- Full phone automation

---

**Made with ❤️ for Sayanox**
