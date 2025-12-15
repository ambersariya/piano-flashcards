# 🎹 Piano Note Flashcards

A small but focused **piano note training web app** built with **React, TypeScript, Tailwind CSS, Vite, VexFlow, and Tone.js**.

The goal is simple: **get faster at recognising notes on the stave** — visually and aurally — without unnecessary clutter.

---

## ✨ Features

- 🎼 **Treble clef note flashcards** rendered with VexFlow
- 🔊 **Audio playback** of notes using Tone.js
- 🧠 Instant feedback with **score + streak tracking**
- 🎯 Configurable **note ranges** (C4–B4, C4–C5, C4–C6)
- ⚡ Fast dev experience via **Vite**
- 🎨 Clean, modern UI using **Tailwind CSS**

---

## 🧩 Tech Stack

- **React + TypeScript** — UI and state management
- **Vite** — fast dev server & build tooling
- **Tailwind CSS** — styling
- **VexFlow** — music notation rendering
- **Tone.js** — Web Audio (note playback)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn)

### Install & Run

```bash
npm install
npm run dev
```

Then open the local dev URL shown in your terminal.

> ⚠️ Audio will only play **after your first interaction** (browser security restriction).

---

## 🧠 How It Works

1. A random note is generated within the selected range
2. The note is rendered on a treble stave
3. You identify the note by clicking its name
4. The correct note is played back for ear training
5. Score and streak update automatically

This is intentionally **measure-free** notation — accuracy matters, not rhythm.

---

## 🔮 Suggested Future Features

### User Experience
- 🎓 **First-time user guidance** - Brief tutorial or tooltip overlay explaining how to use the app
- ⌨️ **Keyboard shortcuts** - Space bar for "Next", Enter to replay note, number keys 1-7 for white keys
- 📱 **Better mobile controls** - Larger touch targets, swipe gestures for next/previous
- 🎯 **Settings presets** - Quick buttons like "Learn Treble Clef" or "Practice Sharps/Flats"
- 💡 **Note name display** - Option to temporarily show the answer before moving to next

### Visual Feedback
- ✨ **Visual feedback on staff** - Highlight or animate the note on the staff when you click/play it
- 🎊 **Streak celebrations** - Confetti or animation at milestone streaks (5, 10, 25, etc.)
- 🔊 **Sound effects** - Different audio cues (chime for correct, buzz for wrong)

### Practice Features
- 📊 **Progress tracking** - Show accuracy percentage, weak notes list, or a progress bar
- 🎮 **Practice modes** - Time challenge mode, or focus on specific weak notes
- 🎯 **Focused practice** - Practice mode that targets only your weakest notes

---

## 📜 License

MIT — use it, break it, improve it.

---

Built for practice, not perfection 🎶