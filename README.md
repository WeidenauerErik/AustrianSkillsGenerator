# 🇦🇹 AustrianSkills Task Generator

> A professional mobile-first Vue.js application for generating **Web Development competition tasks** for [AustrianSkills](https://www.skillsaustria.at/) competitors and coaches.

---

## ✨ Features

- 🤖 **AI-powered task generation** via OpenAI API
- 📄 **Word (.docx) & JSON export** of generated tasks
- 📱 **Native mobile support** via Capacitor (iOS & Android)
- 🔐 **Secure API key onboarding** with live validation
- 🧩 **Modular task structure** with configurable module count
- 🎨 **Mobile-first design** with AustrianSkills branding

---

## 🛠 Tech Stack

| Package | Purpose |
|---|---|
| [Vue 3](https://vuejs.org/) | UI framework (Composition API) |
| [Vue Router 4](https://router.vuejs.org/) | Navigation (Setup → Generator → Result) |
| [Pinia](https://pinia.vuejs.org/) | State management |
| [Capacitor 6](https://capacitorjs.com/) | iOS / Android native wrapper |
| [docx](https://docx.js.org/) | Word document export |
| [file-saver](https://github.com/eligrey/FileSaver.js/) | File download trigger |
| [Vite](https://vitejs.dev/) | Build tool |

---

## 📁 Project Structure

```
src/
├── router/
│   └── index.js          # Route definitions + guards
├── stores/
│   └── app.js            # Pinia store (apiKey, taskData, loading)
├── services/
│   ├── openai.js         # OpenAI Responses API call
│   └── export.js         # Word + JSON export
├── components/
│   ├── AppHeader.vue     # Sticky navigation header
│   ├── BaseButton.vue    # Reusable button (primary / secondary / ghost)
│   ├── BaseInput.vue     # Reusable input with label / hint / error
│   ├── ModuleCard.vue    # Collapsible module display card
│   └── ExportPanel.vue   # Export actions (Word, JSON, …)
├── views/
│   ├── SetupView.vue     # API key onboarding (first launch)
│   ├── GeneratorView.vue # Theme + module count form
│   └── ResultView.vue    # Full result + exports
├── App.vue               # Root with RouterView + page transition
├── main.js               # App bootstrap
└── style.css             # Design tokens + global reset
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Web (Browser)

```bash
npm install
npm run dev
# → open http://localhost:5173
```

### Android (Capacitor)

```bash
npm run build
npx cap add android
npx cap sync
npx cap open android
# Build & run in Android Studio
```

### iOS (macOS only)

```bash
npm run build
npx cap add ios
npx cap sync
npx cap open ios
# Build & run in Xcode
```

---

## 🔄 App Flow

```
App start
  └─ API key in localStorage?
       ├─ YES → GeneratorView
       └─ NO  → SetupView (validates key against /v1/models)
                    └─ GeneratorView
                         └─ Generate → ResultView
                              ├─ Export Word (.docx)
                              ├─ Export JSON
                              ├─ Auswertungsfile-Generator (coming soon)
                              └─ New task → GeneratorView
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary color | `#C03B3B` (AustrianSkills red) |
| Font | Inter |
| Max width | 480px (mobile-first) |
| Safe area | iOS notch / home indicator support |

---

## 📦 Roadmap

- [x] Task generation via OpenAI
- [x] Word (.docx) export
- [x] JSON export
- [x] Capacitor mobile wrapper
- [ ] Auswertungsfile-Generator
- [ ] Offline support
- [ ] Multi-language support (DE / EN)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is not yet licensed. All rights reserved by [WeidenauerErik](https://github.com/WeidenauerErik).

---

<p align="center">
  Made with ❤️ for the AustrianSkills community &nbsp;|&nbsp;
  <a href="https://www.skillsaustria.at/">skillsaustria.at</a>
</p>
