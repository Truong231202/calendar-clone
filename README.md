# Notion Calendar Clone

A high-fidelity, pixel-perfect clone of the **Notion Calendar** web application. Built with Next.js and Tailwind CSS, this project aims to replicate the core UI/UX of the original app, featuring dynamic calendars, responsive sidebars, smooth animations, and functional navigation.

## 🚀 Features

- **Pixel-Perfect UI:** Exact matching of Notion Calendar's layout, spacing, typography, colors, and shadows.
- **Dynamic Main Calendar:** 
  - Real-time "current time" red line indicator.
  - Interactive grid with day and time slots.
  - Functional navigation (Previous Week, Next Week, Today).
- **Interactive Mini Calendar:**
  - 6-week dynamic grid that syncs perfectly with the Main Calendar.
  - Highlights the current day and the active selected week.
- **Responsive Sidebars:**
  - Collapsible Left and Right sidebars with smooth CSS transitions.
  - Animated toggle buttons that move seamlessly between the header and sidebar.
- **Modals & Popovers:**
  - **"Add Tasks Database" Modal:** Intricate UI featuring a floating inset preview image over a blue background container with dark mode/light mode design principles.
  - **Timezone Picker:** Fully styled dark-mode dropdown for selecting timezones.
- **Component-Driven Architecture:** Clean, modular React code using modern Next.js patterns.

## 🛠 Tech Stack

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS (Utility-first CSS framework)
- **Icons:** Lucide React
- **Language:** TypeScript

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gemini01-wq/calendar-clone.git
   ```

2. Navigate into the project directory:
   ```bash
   cd Calendar
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to see the application running.

## 🎨 Design Philosophy

This project strictly adheres to the "Component-First" and "Inspect-before-coding" architecture. Every component (Navbar, Grid, Sidebars) is meticulously inspected from the original Notion Calendar to ensure 100% parity in interactions, hover states, and responsive stacking. Tailwind CSS utility classes are used to map exact pixel values into the layout without sacrificing maintainability.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---
*Disclaimer: This is a UI clone created for educational and portfolio purposes. It is not affiliated with, endorsed by, or sponsored by Notion.*
