# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Atlantis To-Do App: A visually stunning underwater-themed task management application featuring photorealistic 3D black pearls, custom GLSL shaders, real-time physics, and mouse-reactive animations. Built with Next.js 16, React Three Fiber, and Framer Motion.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm lint
```

## Architecture & Key Systems

### 3D Scene Architecture (`components/UnderwaterScene.tsx`)

The entire 3D scene follows a **hierarchical composition pattern** with specialized subsystems:

**Scene Hierarchy:**
```
<Canvas> (R3F root)
  └─ <Scene> (coordinator component)
       ├─ <CausticBackground> (shader plane at z:-8)
       ├─ <GodRays> (shader plane at z:5)
       ├─ <PearlLighting> (multi-point lighting rig)
       ├─ <Environment> (IBL for reflections, lazy loaded)
       ├─ <PearlFormation> (stratified grid formation)
       │    └─ <InteractivePearl>[] (35 pearls with physics)
       ├─ <Bubbles> (80 rising particles)
       └─ <BioluminescentParticles> (300 reactive particles)
```

**Critical Design Patterns:**

1. **Mouse-Reactive Physics System**: Each pearl runs autonomous physics in `useFrame()`:
   - Attraction force (medium distance from mouse)
   - Repulsion force (close proximity to mouse)
   - Pearl-to-pearl repulsion (flocking behavior)
   - Return-to-formation force (elastic orbits)
   - Velocity damping (0.92 multiplier per frame)

2. **Stratified Grid Formation**: Pearls arranged using stratified sampling for optimal viewport coverage:
   - 35 pearls total (7×5 grid)
   - Each cell gets one pearl with random offset for natural appearance
   - Z-depth uses golden ratio spiral (137.5°) for aesthetic distribution
   - Viewport bounds: X[-7.5, 7.5], Y[-4.2, 4.2], Z[-4, 4]
   - Each pearl orbits its formation position with phase offsets and flow field influence

3. **Shader Communication**: Custom shaders receive time uniforms via `useFrame()`:
   ```typescript
   materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
   ```

### Custom Shader System (`components/shaders/CausticShader.ts`)

Two procedural GLSL shaders exported as material configurations:

**CausticShaderMaterial:**
- Multi-octave Simplex noise for underwater caustics
- 3-layer noise combination (large, medium, fine detail)
- Time-animated distortion field
- Color mixing between 3 ocean hues
- Applied to background plane for animated underwater light patterns

**GodRaysShaderMaterial:**
- Volumetric light shaft effect
- Radial sampling from configurable ray origin
- Distance-based fadeout with smoothstep
- Additive blending for luminous appearance
- Pulsing intensity synchronized with time

**Shader Usage Pattern:**
```typescript
<shaderMaterial
  ref={materialRef}
  {...ShaderMaterialConfig}
  transparent
  side={THREE.DoubleSide}
/>
```

### Mouse Position System (`hooks/useMousePosition.ts`)

Converts screen-space mouse coordinates to 3D world coordinates:
- Normalizes to NDC (-1 to +1 range)
- Projects to world space based on camera distance
- Returns both NDC and world position Vector3
- Used by all interactive pearls for physics calculations

### To-Do State Management (`hooks/useTodos.ts`)

Centralized todo logic with localStorage persistence:
- CRUD operations (add, toggle, delete, edit)
- Filter system (all/active/completed)
- Stats computation (total, active, completed counts)
- Automatic localStorage sync on every state change
- SSR-safe with `mounted` flag to prevent hydration errors

### Styling System (Tailwind CSS v4)

**Important:** Uses new `@import "tailwindcss"` syntax with `@theme` blocks instead of config files.

Custom theme variables defined in `app/globals.css`:
```css
@theme {
  --color-atlantis-dark: #0a1628;
  --color-atlantis-aqua: #3fb4c7;
  /* etc... */
}
```

**Font System:**
Custom fonts for typography hierarchy:
- `--font-heading`: 'Cinzel' (serif) - Main headings with 0.02em letter-spacing
- `--font-subtitle`: 'Playfair Display' (serif) - Subtitles with 0.01em letter-spacing
- `--font-body`: 'Lora' (serif) - Body text with 0.015em letter-spacing
- `--font-ui`: 'Inter' (sans-serif) - UI elements and interactive components

Custom utility classes:
- `.glass-pearl` - Frosted glass effect with backdrop blur
- `.glass-pearl-dark` - Dark variant for components
- `.text-glow` - Cyan text-shadow effect
- `.font-heading`, `.font-subtitle`, `.font-body` - Typography presets with letter-spacing

**PostCSS Configuration:**
Must use `@tailwindcss/postcss` plugin (not `tailwindcss` directly) in `postcss.config.js`.

### Responsive Design System

**Mobile-First Approach:**
The UI is fully responsive with breakpoints following Tailwind's default system:
- `sm:` - 640px and up (tablet/small desktop)
- Default (no prefix) - Mobile screens (< 640px)

**Key Responsive Patterns:**

1. **TodoInput Component** (`components/TodoInput.tsx:27-42`):
   - Layout: `flex-col sm:flex-row` - Vertical stacking on mobile, horizontal on desktop
   - Padding: `p-4 sm:p-6` - Reduced padding on mobile
   - Input: `px-4 sm:px-6 py-3 sm:py-4` - Smaller touch targets on mobile
   - Button: `w-full sm:w-auto` - Full-width on mobile for better touch interaction
   - Text sizes: `text-base sm:text-lg` - Optimized for mobile readability

2. **Stats Bar** (`app/page.tsx:83-103`):
   - Layout: `flex-col sm:flex-row` - Vertical stacking on mobile
   - Stats: `flex-wrap` with responsive gaps (`gap-3 sm:gap-6`)
   - Clear button: Centered on mobile with `self-center sm:self-auto`

3. **Filter Buttons** (`components/FilterButtons.tsx:36-66`):
   - Layout: Maintains horizontal layout (better UX than vertical on mobile)
   - Padding: `p-3 sm:p-4`, `px-3 sm:px-6 py-2.5 sm:py-3`
   - Text: `text-sm sm:text-base` - Optimized readability
   - Badges: `text-xs sm:text-sm` with `px-1.5 sm:px-2`
   - Gaps: `gap-1.5 sm:gap-2` - Tighter spacing on mobile

**Design Principles:**
- All touch targets are minimum 44px on mobile (iOS guidelines)
- Full-width buttons on mobile prevent accidental misses
- Vertical stacking prevents horizontal overflow on small screens
- Responsive padding prevents cramped layouts on mobile
- Text sizes scale appropriately for mobile readability

### Pearl Material Properties

Photorealistic black pearls use `meshPhysicalMaterial` with:
- **Iridescence** (0.4-0.5): Peacock color shifts
- **Clearcoat** (1.0): Glossy wet surface
- **IOR** (1.67): Pearl's actual index of refraction
- **Emissive glow**: Pulsing cyan undertone
- **Low roughness** (0.08): Mirror-like highlights
- Color variations: Deep black with blue/green/purple undertones

### Performance Optimizations

- **useMemo** for all static particle positions and pearl data
- **Instance management**: pearlRefs array prevents redundant lookups
- **Selective updates**: Only update geometry attributes when needed
- **Frame skipping**: Bioluminescent particles update physics every 3rd frame (reduces calculations from 10,500 to 3,500/frame)
- **Early exit optimization**: Pearl-to-pearl collision uses Manhattan distance check before expensive sqrt (~60% reduction in calculations)
- **Shader optimization**: Caustic shader reduced from 6-7 noise calls to 3 (50% complexity reduction)
- **Additive blending** on particles to reduce overdraw cost
- **High-performance GL context**: `powerPreference: 'high-performance'`
- **Lazy loading**: Environment map loads after critical scene elements via Suspense

## Common Gotchas

1. **Shader Time Updates**: Always update `uTime` uniform in `useFrame()`, not in component body
2. **Pearl Physics**: Damping multiplier (0.92) is critical - too high causes instability, too low causes sluggishness
3. **Trail Component**: Requires mesh as direct child, wrapping in groups breaks it
4. **Mouse Coordinates**: Screen Y is inverted - must negate for correct 3D space mapping
5. **SSR Hydration**: Use `mounted` state flag before accessing `localStorage` to prevent mismatches

## File Organization

```
components/
├── UnderwaterScene.tsx      # Main 3D scene orchestrator
├── shaders/
│   └── CausticShader.ts     # GLSL shader configurations
├── Header.tsx               # Animated title with floating motion
├── TodoInput.tsx            # Pearl-styled input with Framer Motion
├── TodoItem.tsx             # Individual todo with edit/delete
└── FilterButtons.tsx        # Segmented control with layout animation

hooks/
├── useTodos.ts              # Todo state + localStorage
└── useMousePosition.ts      # Screen to 3D world space converter

app/
├── page.tsx                 # Main app layout with AnimatePresence
├── layout.tsx               # Root with font loading
└── globals.css              # Tailwind v4 with @theme blocks
```

## Dependencies of Note

- **@react-three/drei**: Provides `Trail`, `Environment`, `Points` helpers
- **Tailwind CSS v4**: Breaking changes - requires `@tailwindcss/postcss` and `@import` syntax
- **Next.js 16**: Uses Turbopack by default, requires `turbopack: {}` config
- **Framer Motion 12**: `AnimatePresence` with `mode="popLayout"` for smooth list transitions

## Next.js Configuration (`next.config.ts`)

**Important webpack optimizations:**
- **Canvas externalization**: Prevents build errors with Three.js canvas usage
- **Three.js tree-shaking**: Aliases 'three' to modular build for smaller bundle size
- **Console removal**: Automatically strips console.logs in production builds
- **Turbopack**: Enabled by default with `turbopack: {}`

## Visual Design System

**Color Palette:**
- Deep ocean: `#0a1628` → `#0d2847` → `#1a4d6f`
- Highlights: `#3fb4c7` (aqua), `#6dd5ed` (light)
- Pearls: Black (#0a0f1a) with iridescent overtones

**Animation Timing:**
- Pearl orbits: 0.3-0.8s periods with phase offsets
- Particle drift: 0.02 velocity with boundary wrapping
- UI transitions: 300ms with spring physics (stiffness: 300, damping: 25)

## Extending the Scene

To add new 3D elements:
1. Create component with `useFrame()` for animation
2. Use `useMemo()` for static geometry/material data
3. Access mouse position via `useMousePosition()` hook
4. Add to `<Scene>` component in render order (back to front)
5. Update lighting if element requires highlights

To add new shaders:
1. Export material config from `CausticShader.ts`
2. Include uniforms object with initial values
3. Update uniform values in `useFrame()` callback
4. Apply with `<shaderMaterial {...config} />`
