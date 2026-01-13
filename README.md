# Golang Interview Prep Editor

A Google Docs-style code editor with syntax highlighting specifically designed for practicing Golang during interview preparation.

## ✨ Features

- **Monaco Editor Integration**: Powered by the same editor as VS Code
- **Golang Syntax Highlighting**: Full syntax highlighting and auto-completion for Go
- **IntelliSense**: Comprehensive autocomplete for Go standard library
- **Code Execution**: Run Go code directly in the browser via Go Playground API
- **Minimalist UI**: Maximum screen space for coding
- **Hover Documentation**: Detailed function signatures and descriptions
- **Ctrl+Scroll Font Size**: Adjust font size like VS Code
- **Floating Controls**: Settings gear and Run button for distraction-free coding

## 🚀 Quick Start (One Command!)

```bash
npm install
npm start
```

That's it! The app will build and start automatically at **http://localhost:3000**

## 📦 For Sharing

To package and share with others:

1. **Clone/Download** this entire folder
2. Make sure the recipient has **Node.js** installed ([nodejs.org](https://nodejs.org))
3. Share the folder and tell them to run:
   ```bash
   npm install
   npm start
   ```

## 🛠️ Development Mode

If you want to develop/modify the app:

```bash
npm install
npm run dev    # Terminal 1 - Frontend (Vite)
npm run server # Terminal 2 - Backend (Proxy)
```

## 📖 Usage

1. **Write Code**: The editor supports full Go syntax
2. **IntelliSense**: Type package names (e.g., `fmt.`, `strings.`, `slices.`) to see suggestions
3. **Hover Help**: Hover over functions to see documentation
4. **Run Code**: Click the floating ▶ button (bottom-right) or press Ctrl+Enter
5. **Settings**: Click the ⚙ button (top-right) to adjust font size or toggle IntelliSense
6. **Font Size**: Hold Ctrl and scroll to zoom in/out

## 🎯 Keyboard Shortcuts

- **Ctrl + Scroll**: Change font size
- **Ctrl + Space**: Trigger IntelliSense suggestions
- **Ctrl + K Ctrl + I**: Show hover information

## 📚 Supported Go Packages

The IntelliSense includes autocomplete and hover documentation for:
- `fmt`, `strings`, `slices`, `sort`, `strconv`
- `math`, `time`, `errors`, `io`, `os`
- `bytes`, `bufio`, `regexp`, `encoding/json`
- `net/http`, `context`, `sync`, `log`, `maps`
- All built-in functions and keywords

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Editor**: Monaco Editor (@monaco-editor/react)
- **Backend**: Node.js + Express
- **Code Execution**: Go Playground API

## 📝 License

MIT - Feel free to use for interview prep!

---

Perfect for practicing coding challenges and interview problems in Go! 🎯
