# 🌊 Atlantis To-Do App

A breathtaking underwater-themed to-do application featuring stunning 3D effects, smooth animations, and a magical Atlantis aesthetic.

## ✨ Features

- **3D Underwater Scene** - Immersive background with floating bubbles and particles using React Three Fiber
- **Pearl Glass Morphism UI** - Beautiful glassmorphic components with pearl-like effects
- **Smooth Animations** - Fluid transitions and interactions powered by Framer Motion
- **Full CRUD Operations** - Add, edit, complete, and delete tasks
- **Filter System** - View all, active, or completed tasks
- **Local Storage** - Persistent task storage across sessions
- **Responsive Design** - Works beautifully on all screen sizes

## 🎨 Design Theme

- **Color Palette**: Blue-greenish underwater tones with dark gradients
- **Visual Style**: Atlantis-inspired with pearl-like components
- **Effects**: Glass morphism, glowing shadows, shimmer effects
- **3D Elements**: Dynamic bubbles, floating particles, ambient lighting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🛠️ Built With

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Three Fiber** - 3D graphics
- **@react-three/drei** - R3F helpers
- **Framer Motion** - Animations
- **Three.js** - 3D rendering

## 📦 Project Structure

```
├── app/
│   ├── page.tsx          # Main page component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── UnderwaterScene.tsx   # 3D background scene
│   ├── Header.tsx            # App header
│   ├── TodoInput.tsx         # Todo input field
│   ├── TodoItem.tsx          # Individual todo item
│   └── FilterButtons.tsx     # Filter controls
├── hooks/
│   └── useTodos.ts       # Todo management hook
└── types/
    └── index.ts          # TypeScript types
```

## 🎮 Usage

- **Add Task**: Type in the input field and click "Add" or press Enter
- **Complete Task**: Click the circular checkbox
- **Edit Task**: Click on the task text or the edit button
- **Delete Task**: Click the trash icon (visible on hover)
- **Filter Tasks**: Use the filter buttons to view all, active, or completed tasks
- **Clear Completed**: Remove all completed tasks at once

## 🌟 Key Features Explained

### 3D Underwater Scene
- Animated bubbles rising through water
- Floating particles for depth
- Dynamic lighting effects
- Fog for atmospheric depth

### Pearl Components
- Glassmorphic design with backdrop blur
- Gradient borders and shadows
- Glowing effects on interaction
- Smooth hover animations

### Framer Motion Animations
- Layout animations on list changes
- Spring-based transitions
- Stagger effects for list items
- Smooth enter/exit animations

## 📝 License

MIT

## 🎉 Acknowledgments

Inspired by the mythical city of Atlantis and the beauty of underwater environments.
