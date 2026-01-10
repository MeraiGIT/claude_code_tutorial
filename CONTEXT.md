# CONTEXT.md

**Last Updated:** 2026-01-10
**Status:** ✅ WORKING - Mobile UI optimized for iPhone screens

## 1. What We're Building

**Atlantis To-Do App** - A visually stunning underwater-themed task management application featuring:
- Photorealistic 3D black pearls with mouse-reactive physics
- Custom GLSL shaders (caustics, god rays)
- Real-time flow field physics simulation
- Framer Motion animations for UI
- Beautiful loading screen with pearl animations

**Tech Stack:**
- Next.js 16 (with Turbopack)
- React 19.2.3
- React Three Fiber (3D rendering)
- Tailwind CSS v4 (new @import syntax)
- Framer Motion 12
- TypeScript

**Deployment:**
- GitHub: https://github.com/MeraiGIT/claude_code_tutorial
- Vercel: https://claudecodetutorial.vercel.app
- Auto-deployment: ✅ Configured (deploys on push to main)

---

## 2. Current Architecture

### 2.1 3D Scene Architecture

**Hierarchical Component Structure:**
```
<Canvas> (R3F root)
  └─ <Scene>
       ├─ <CausticBackground> (animated water caustics shader)
       ├─ <GodRays> (volumetric light shafts shader)
       ├─ <PearlLighting> (multi-point dynamic lighting)
       ├─ <Environment> (IBL reflections, lazy loaded)
       ├─ <PearlFormation> (35 pearls in stratified grid)
       ├─ <Bubbles> (80 rising particles)
       └─ <BioluminescentParticles> (300 reactive particles)
```

**Pearl Physics System:**
- Flow field influence (3D Perlin-like noise)
- Mouse swirl interaction (gentle circular force)
- Pearl-to-pearl avoidance (flocking)
- Return-to-formation force (elastic orbits)
- Velocity damping (0.96 multiplier)
- Manhattan distance optimization (~60% fewer collision checks)

**Performance Optimizations:**
- Frame skipping: Bioluminescent particles update every 3rd frame
- Early exit: Manhattan distance check before expensive sqrt
- Shader optimization: Reduced caustic shader from 6-7 noise calls to 3
- Lazy loading: Environment map loads after critical scene via Suspense
- useMemo: All static geometry/material data

### 2.2 Loading State System (✅ FIXED)

**Components:**
- `LoadingProvider` - Context that tracks component loading
- `useLoadingState` - Hook to access loading state
- `Loading` - Visual loading component with pearl animations
- `AppContent` - Wrapper that shows/hides loading screen

**How It Works:**
1. App starts with `isLoading: true`
2. Two components signal when loaded:
   - `'ui'` - UI components rendered (300ms delay)
   - `'fonts'` - Custom fonts loaded (document.fonts.ready)
3. Minimum loading time: 2 seconds (allows 3D scene to start loading in background)
4. Once both loaded, wait 500ms then hide loading screen
5. Total typical load time: ~2.5 seconds

**Fix Applied (2026-01-10):**
Removed `'scene'` tracking from LoadingProvider. The dynamically imported UnderwaterScene was unreliable for signaling load completion. Now the 3D scene loads in background while loading screen shows for a fixed duration based on UI/font readiness.

### 2.3 State Management

**Todo State (`hooks/useTodos.ts`):**
- localStorage persistence
- Filter system (all/active/completed)
- CRUD operations
- Stats computation
- SSR-safe with mounted flag

**Loading State (`hooks/useLoadingState.tsx`):**
- Context-based
- Tracks Set of loaded component names
- Fixed: No longer tracks unreliable dynamic imports (removed 'scene' tracking)

### 2.4 Styling System

**Tailwind CSS v4:**
- Uses new `@import "tailwindcss"` syntax
- `@theme` blocks instead of config files
- PostCSS with `@tailwindcss/postcss` plugin

**Custom Theme Variables:**
```css
--color-atlantis-dark: #0a1628
--color-atlantis-aqua: #3fb4c7
--color-atlantis-light: #6dd5ed
--font-heading: 'Cinzel' (serif)
--font-ui: 'Inter' (sans-serif)
```

**Custom Classes:**
- `.glass-pearl` - Frosted glass with backdrop blur
- `.glass-pearl-dark` - Dark variant
- `.text-glow` - Cyan text shadow
- `.font-heading`, `.font-subtitle`, `.font-body` - Typography presets

---

## 3. File Structure & Purpose

### Core Application Files

```
app/
├── layout.tsx
│   - Root layout with font loading
│   - Wraps children with LoadingProvider and AppContent
│   - Loads 4 custom fonts: Cinzel, Playfair Display, Lora, Inter
│
├── page.tsx
│   - Main app component
│   - Dynamic import of UnderwaterScene (ssr: false)
│   - Calls setComponentLoaded('ui') and setComponentLoaded('fonts')
│   - Renders Header, TodoInput, FilterButtons, TodoItem list
│
└── globals.css
    - Tailwind v4 imports and @theme blocks
    - Custom utility classes
    - Scrollbar styling
```

### Components

```
components/
├── UnderwaterScene.tsx (CRITICAL - Not loading properly)
│   - Exports default UnderwaterScene component
│   - Contains internal Scene component that calls setComponentLoaded('scene')
│   - Scene never mounts due to dynamic import issue
│   - Has all 3D scene logic (pearls, bubbles, shaders, lighting)
│
├── Loading.tsx
│   - Beautiful loading screen with:
│     * 30 small rising bubbles (8-28px)
│     * 8 orbiting pearls + 1 center pearl
│     * Animated progress bar
│     * "ATLANTIS" title with cyan glow
│     * 15 floating particles
│
├── AppContent.tsx
│   - Wrapper that conditionally shows Loading component
│   - Uses AnimatePresence for transitions
│   - Only shows children when isLoading is false
│
├── Header.tsx - App title with floating animation
├── TodoInput.tsx - Input field with pearl styling
├── TodoItem.tsx - Individual todo with edit/delete
├── FilterButtons.tsx - Segmented control for filters
│
└── shaders/
    └── CausticShader.ts
        - CausticShaderMaterial (underwater caustics)
        - GodRaysShaderMaterial (volumetric light)
```

### Hooks

```
hooks/
├── useLoadingState.tsx (⚠️ BROKEN LOGIC)
│   - LoadingProvider component
│   - useLoadingState hook
│   - Expects components: ['scene', 'ui', 'fonts']
│   - BUG: 'scene' never gets signaled
│
├── useTodos.ts
│   - Todo CRUD operations
│   - localStorage persistence
│   - Filter logic
│
└── useMousePosition.ts
    - Converts screen coordinates to 3D world space
    - Used by pearl physics
```

### Configuration Files

```
next.config.ts
├── Tree-shaking for Three.js
├── Canvas externalization
├── Console.log removal in production
└── Turbopack enabled

vercel.json
└── Git deployment config for auto-deploy

postcss.config.js
└── @tailwindcss/postcss plugin

package.json
└── All dependencies and scripts
```

---

## 4. What We Were Just Working On

### Session Timeline:

1. **Initial Setup** ✅
   - Created CLAUDE.md documentation
   - Updated with accurate pearl formation details (35 pearls, stratified grid)
   - Added font system and performance optimization docs
   - Committed and pushed to GitHub

2. **GitHub & Vercel Integration** ✅
   - Created GitHub repo: MeraiGIT/claude_code_tutorial
   - Connected Vercel auto-deployment
   - Added vercel.json for git deployment config
   - Verified auto-deploy works (triggers on push)

3. **Loading State Implementation** ✅ FIXED
   - Created Loading.tsx component with pearl animations
   - Created LoadingProvider and useLoadingState hook
   - Integrated into app/layout.tsx
   - Initially tracked 'scene', 'ui', 'fonts' components

4. **Playwright Testing & UI Improvements** ✅
   - Used Playwright to capture loading state screenshots
   - Identified issues:
     * Bubbles too large (60-80px → reduced to 8-28px)
     * Missing title glow → added cyan text-shadow
     * Progress bar too narrow → widened to 320px
     * Pearl formation too small → increased to 40px
   - Committed improvements

5. **CRITICAL BUG FIX** ✅ RESOLVED
   - Issue: Loading state ran forever, app never became visible
   - Root cause: `Scene` component inside dynamically imported `UnderwaterScene` never reliably signaled load completion
   - Solution: Removed 'scene' from component tracking in LoadingProvider
   - Changes:
     * LoadingProvider now only tracks ['ui', 'fonts']
     * Removed setComponentLoaded('scene') call from UnderwaterScene
     * Increased minimum loading time to 2 seconds
     * 3D scene now loads in background during loading screen
   - Status: ✅ FIXED and deployed (commit: 032824b)

6. **Mobile UI Responsiveness** ✅ COMPLETED
   - Issue: UI elements overlapped inorganically on iPhone screens
   - Problems identified:
     * "Add" button overlaying text input box
     * "Clear Completed" button placed awkwardly
     * Filter buttons cramped with small text
   - Solution: Implemented mobile-first responsive design
   - Changes:
     * TodoInput: Vertical stacking on mobile (`flex-col sm:flex-row`)
     * Stats Bar: Vertical layout with centered "Clear Completed" button
     * Filter Buttons: Optimized spacing and text sizes for mobile
     * All components use responsive padding (`p-4 sm:p-6`)
     * Text sizes scale appropriately (`text-base sm:text-lg`)
     * Full-width buttons on mobile for better touch targets
   - Status: ✅ COMPLETED and deployed (commit: 5f278ee)

### Current State of Loading Logic:

**How it works (FIXED):**
```
1. App mounts with isLoading: true
2. Page component mounts → setComponentLoaded('ui') after 300ms
3. Fonts load → setComponentLoaded('fonts') via document.fonts.ready
4. LoadingProvider has 2-second minimum display timer
5. Once both 'ui' and 'fonts' loaded + minimum time passed → wait 500ms → setIsLoading(false)
6. Loading screen fades out, app becomes visible
7. 3D UnderwaterScene loads in background during and after loading screen
```

**Typical timeline:**
- T+0ms: App starts, loading screen visible
- T+300ms: UI signals loaded
- T+~500ms: Fonts signal loaded
- T+2000ms: Minimum loading time reached
- T+2500ms: Loading screen fades out (after 500ms delay)
- T+2500ms+: App fully interactive with 3D scene rendering

---

## 5. Future Enhancements

Now that the critical loading bug is fixed, here are potential improvements:

### Performance Optimizations:
1. Add performance mode toggle for low-end devices
2. Implement progressive enhancement for 3D scene
3. Add reduced motion support for accessibility
4. Optimize bundle size further

### Feature Additions:
1. Add favicon.ico to eliminate 404 error
2. Implement todo categories or tags
3. Add drag-and-drop reordering
4. Export/import todos functionality
5. Add keyboard shortcuts

### UX Improvements:
1. Add onboarding tutorial for first-time users
2. Implement undo/redo functionality
3. Add todo search/filter by text
4. Add due dates and reminders

---

## 6. Known Issues

### Critical (Blocking):
None! All critical issues resolved.

### Minor:
1. **Favicon 404** - No favicon.ico file
   - Impact: Console error, doesn't affect functionality
   - Priority: P2 - Nice to have

### Performance Notes:
- 3D scene can be heavy on low-end devices
- Consider adding performance mode toggle in future
- Current optimizations sufficient for most devices

---

## 7. Development Workflow

### Running Locally:
```bash
npm run dev          # Development server on :3000 (or :3001)
npm run build        # Production build
npm start            # Run production build
npm run lint         # Run ESLint
```

### Git Workflow:
```bash
git add <files>
git commit -m "message"
git push origin main  # Auto-deploys to Vercel
```

### Deployment:
- Pushes to `main` branch automatically deploy to Vercel
- Deployment takes ~20-25 seconds
- Check status: `npx vercel ls`

---

## 8. Important Technical Notes

### Tailwind CSS v4 Breaking Changes:
- Must use `@import "tailwindcss"` (not old tailwind.config.js)
- Theme defined in CSS with `@theme` blocks
- PostCSS must use `@tailwindcss/postcss` plugin

### Next.js 16 Notes:
- Turbopack enabled by default
- React 19 requires careful handling of Server/Client components
- Dynamic imports with `ssr: false` for 3D components

### Three.js / R3F:
- Use `useFrame()` for animations (runs every frame)
- Update shader uniforms inside `useFrame()`
- Canvas requires `gl={{ antialias: true }}` for quality
- `<Suspense>` for lazy-loaded assets

### SSR Considerations:
- No `window` references in components (breaks build)
- Use `mounted` state flag before accessing localStorage
- Dynamic imports for browser-only code (Three.js, Playwright)

---

## 9. Cost & Performance Stats

**Latest Session:**
- Total cost: $3.59
- Duration: 1h 1m (wall time)
- Code changes: 419 lines added, 62 removed
- Models used: Claude Sonnet 4.5 (primary), Haiku (tasks)

**Build Stats:**
- Build time: ~22-25 seconds
- Bundle size: TBD (check after fixing loading bug)
- Deployment: ~24 seconds on Vercel

---

## 10. Contact & Resources

**Documentation:**
- CLAUDE.md - Comprehensive codebase guide for AI agents
- README.md - User-facing project description
- This file (CONTEXT.md) - Session continuity document

**Repositories:**
- GitHub: https://github.com/MeraiGIT/claude_code_tutorial
- Vercel Dashboard: https://vercel.com/iosif-mermans-projects/claude_code_tutorial

**Key Commands:**
```bash
# Playwright testing (requires browser)
npx playwright test

# Vercel CLI
npx vercel          # Deploy
npx vercel ls       # List deployments
npx vercel inspect  # Check deployment details
```

---

## 11. Emergency Recovery Steps

If everything breaks:

1. **Revert to last working commit:**
   ```bash
   git log --oneline
   git reset --hard <commit-hash>
   git push --force origin main
   ```

2. **Remove loading state completely:**
   ```bash
   git revert <loading-state-commit-hash>
   ```

3. **Fresh build:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

---

**END OF CONTEXT DOCUMENT**

*All critical issues resolved. App is production-ready with mobile-responsive UI.*
