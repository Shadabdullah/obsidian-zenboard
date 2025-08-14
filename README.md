# Habit Tracker – Zenboard

Habit Tracker – Zenboard is an Obsidian plugin that helps you build and maintain consistent daily habits directly inside your vault.  
Track your progress, visualize streaks, and stay motivated – all without leaving Obsidian.

## Features

- 📅 **Flexible habit types** – daily, weekly, or custom intervals
- 📊 **Progress tracking** – streak counters and visual charts
- ⚡ **Quick logging** – via ribbon icon, dashboard, or command palette
- 🎯 **Customizable goals** – set and edit targets anytime
- 🗂 **Vault-first storage** – all data is saved locally in your vault
- 🌗 **Obsidian theme support**

## How to Use

1. Install and enable **Habit Tracker – Zenboard** from  
   **Settings → Community plugins → Browse**.
2. Open the dashboard via the ribbon icon or:
   - Command Palette → `Open Habit Dashboard`
3. Add your first habit with **+ Add Habit**.
4. Log progress daily and watch your streak grow.

> **Tip:** You can pin the dashboard as a side pane for quick access.

## Screenshots

*(Optional: Add image links here after uploading to your repo’s `/docs` folder or GitHub Issues for hosting.)*

## Settings

- **Default project** – choose where new habits are stored
- **Theme & icons** – customize habit appearance
- **Notification reminders** *(desktop only)*

## For Developers

If you want to contribute or customize:

```bash
# Clone into your vault’s plugins folder
git clone https://github.com/shadabdullah/obsidian-zenboard .obsidian/plugins/zenboard

cd .obsidian/plugins/zenboard
npm install

# Build in watch mode
npm run dev
