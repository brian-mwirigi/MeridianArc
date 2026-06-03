# MERIDIAN POMODORO ENGINE

![Meridian Interface](public/Screenshot%202026-06-03%20140104.png)

Meridian is a high-performance, brutalist Pomodoro timer built for engineers, hackers, and deep-work practitioners. Designed with an uncompromising aesthetic, Meridian eliminates distractions, strips away unnecessary UI chrome, and provides a raw, unapologetic focus environment.

## OVERVIEW

Built on the Tauri framework and React, Meridian leverages native system performance while maintaining a lightweight footprint. It features an aggressive "void" aesthetic, incorporating hardware-accelerated scanline rendering, zero-radius borders, and monospace typography reminiscent of vintage terminal interfaces. 

Unlike conventional productivity tools that rely on gamification and cluttered dashboards, Meridian provides strict time management protocols.

## CORE CAPABILITIES

*   **Focus Protocol Enforcement**: Strict 25-minute focus blocks, mathematically interleaved with 5-minute and 15-minute rest intervals.
*   **Infinite Stopwatch Mode**: Unrestricted count-up timer for infinite deep-work sessions where traditional constraints do not apply.
*   **Hardware-Accelerated Analytics**: A 13-week contribution matrix tracking your session output, modeled after the GitHub commit graph.
*   **Command-Line Task Execution**: Integrated task management system operating on simple text inputs and array-based completion tracking.
*   **Absolute Focus Mode**: A toggle that purges all UI elements, leaving only a full-bleed countdown timer to eliminate visual latency.
*   **Acoustic Feedback System**: Synthesized mechanical ticking and multi-frequency completion chimes powered by the native Web Audio API.

## TECHNICAL ARCHITECTURE

*   **Framework**: React 18, TypeScript, Vite
*   **Runtime**: Tauri (Rust native binary compilation)
*   **Persistence**: Local SQLite Database via `tauri-plugin-sql`
*   **State Management**: Zustand
*   **Styling**: Tailwind CSS (Custom Brutalist Theme Engine)

## INSTALLATION & DEPLOYMENT

### Prerequisites
Node.js 18+ and Rust are required to compile the native Tauri binary.

### Build Instructions

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```
2.  Initialize the development server:
    ```bash
    npm run dev
    ```
3.  Compile the native desktop binary:
    ```bash
    npm run tauri build
    ```

## DESIGN SYSTEM

Meridian operates on a custom Tailwind configuration designed for high-contrast, low-fatigue viewing:

*   **Background**: `#0a0a0a` (Void)
*   **Surface**: `#111111`
*   **Edge**: `#222222`
*   **Primary Phosphor**: `#00ff9f` (Neon Green)
*   **Alert Phosphor**: `#ff3e3e` (Hot Red)
*   **Typography**: JetBrains Mono / Fira Code

## DATA PERSISTENCE

All session metrics and task states are written directly to a local SQLite database (`meridian.db`). Meridian does not require cloud synchronization, internet connectivity, or remote accounts. Your data remains strictly local.

## KEYBOARD BINDINGS

Meridian is designed to be operated without a pointing device:

*   `[SPACE]` - Toggle Timer (Play/Pause)
*   `[R]` - Reset Current Session
*   `[S]` - Skip to Next Session
*   `[?]` - Open Keybindings Reference
*   `[ESC]` - Close Panels

---
*Meridian Pomodoro Engine v0.1.0*
