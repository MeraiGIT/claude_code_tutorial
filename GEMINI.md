# GEMINI.md: Project Context

This document provides a comprehensive overview of the "Atlantis To-Do App" to guide future development and AI-assisted tasks.

## 1. Project Overview

This is a modern, visually-rich **To-Do List application** with an underwater "Atlantis" theme. It is a full-stack web application built with **Next.js 16** and **React 19**, using **TypeScript** for type safety.

The frontend is styled with **Tailwind CSS** and features a sophisticated and immersive user experience, including:
- A **3D underwater background scene** rendered with **React Three Fiber** and **Three.js**.
- Fluid animations and transitions powered by **Framer Motion**.
- A "glass morphism" UI style for components.

The application provides full CRUD (Create, Read, Update, Delete) functionality for to-do items, along with filtering capabilities. State is managed within React using custom hooks and is persisted in the browser's **Local Storage**.

A key characteristic of this project is its strong focus on **performance optimization**. Techniques such as code splitting, lazy loading of heavy components, font optimization, and advanced Three.js optimizations are actively used, as documented in `Speed_Optimization.md`.

## 2. Building and Running

The project uses `npm` as its package manager. Key commands are defined in `package.json`:

*   **To run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

*   **To create a production-ready build:**
    ```bash
    npm run build
    ```

*   **To start the production server:**
    ```bash
    npm run start
    ```

*   **To run the code linter:**
    ```bash
    npm run lint
    ```

## 3. Development Conventions

*   **Project Structure:** The codebase is organized logically:
    *   `app/`: Contains the main application pages and layouts (following Next.js App Router conventions).
    *   `components/`: Holds all reusable React components.
    *   `hooks/`: Contains custom React hooks for managing state and side effects (e.g., `useTodos.ts`).
    *   `types/`: Defines shared TypeScript types and interfaces (e.g., `index.ts`).

*   **State Management:** Application state is managed via React's built-in hooks (`useState`, `useEffect`). Business logic is encapsulated in custom hooks (`useTodos.ts`) to promote reusability and separation of concerns. There is no external state management library like Redux or Zustand.

*   **Styling:** Styling is done using **Tailwind CSS**. Global styles and font definitions are located in `app/globals.css`.

*   **Type Safety:** The project is written in **TypeScript**. Centralized type definitions are stored in `types/index.ts`.

*   **Performance:** Performance is a primary consideration.
    *   Heavy components, like the `UnderwaterScene`, are loaded asynchronously using `next/dynamic` to avoid blocking the initial UI render.
    *   Fonts are optimized using `next/font`.
    *   The `next.config.ts` file includes a custom Webpack configuration to specifically **tree-shake the `three` library**, reducing the production bundle size.
    *   The `Speed_Optimization.md` file serves as a reference for performance-related best practices.

*   **3D Graphics:** The immersive background is built with **React Three Fiber**. Shaders and other 3D-related code can be found in `components/shaders/` and `components/UnderwaterScene.tsx`.
