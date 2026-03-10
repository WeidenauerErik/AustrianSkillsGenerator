# AustrianSkills Task Generator v2

Professional Vue.js mobile application for generating AustrianSkills Web Development competition tasks.

## Tech Stack

| Package | Purpose |
|---------|---------|
| Vue 3 | UI framework (Composition API) |
| Vue Router 4 | Navigation (Setup → Generator → Result) |
| Pinia | State management |
| Capacitor 6 | iOS / Android native wrapper |
| docx | Word document export |
| file-saver | File download trigger |
| Vite | Build tool |

## Project Structure

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
│   ├── BaseButton.vue    # Reusable button (primary/secondary/ghost)
│   ├── BaseInput.vue     # Reusable input with label/hint/error
│   ├── ModuleCard.vue    # Collapsible module display card
│   └── ExportPanel.vue   # Export actions (Word, JSON, future)
├── views/
│   ├── SetupView.vue     # API key onboarding (first launch)
│   ├── GeneratorView.vue # Theme + module count form
│   └── ResultView.vue    # Full result + exports
├── App.vue               # Root with RouterView + page transition
├── main.js               # App bootstrap
└── style.css             # Design tokens + global reset
```

## Getting Started

### Web (browser)

```bash
npm install
npm run dev
# open http://localhost:5173
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

## App Flow

```
App start
  └─ Has API key in localStorage?
       ├─ YES → GeneratorView
       └─ NO  → SetupView (validate key against /v1/models)
                    └─ GeneratorView
                         └─ Generate → ResultView
                              ├─ Export Word (.docx)
                              ├─ Export JSON
                              ├─ Auswertungsfile-Generator (coming soon)
                              └─ New task → GeneratorView
```

## Design

- Color: `#C03B3B` (neutral muted red) + white
- Font: Inter
- Max width: 480px (mobile-first)
- Dark footer on result, light backgrounds throughout
- iOS-style safe area inset support for notch/home indicator
