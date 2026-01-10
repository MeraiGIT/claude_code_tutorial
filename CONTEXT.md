# CONTEXT.md

**Last Updated:** 2026-01-10
**Status:** 🔴 CRITICAL BUG - Loading state stuck infinitely

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

### 2.2 Loading State System (⚠️ BROKEN)

**Components:**
- `LoadingProvider` - Context that tracks component loading
- `useLoadingState` - Hook to access loading state
- `Loading` - Visual loading component with pearl animations
- `AppContent` - Wrapper that shows/hides loading screen

**How It Should Work:**
1. App starts with `isLoading: true`
2. Three components signal when loaded:
   - `'scene'` - 3D scene mounted (100ms delay)
   - `'ui'` - UI components rendered (300ms delay)
   - `'fonts'` - Custom fonts loaded (document.fonts.ready)
3. Once all 3 loaded, wait 500ms then hide loading screen
4. Minimum display time: 1 second

**Current Problem (CRITICAL BUG):**
Loading state runs forever - app never becomes visible. The `Scene` component inside `UnderwaterScene` likely never mounts because it's dynamically imported, so `setComponentLoaded('scene')` never fires.

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
- Issues: Not detecting dynamic imports properly

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

3. **Loading State Implementation** ⚠️ BROKEN
   - Created Loading.tsx component with pearl animations
   - Created LoadingProvider and useLoadingState hook
   - Integrated into app/layout.tsx
   - Updated UnderwaterScene.tsx to call setComponentLoaded('scene')
   - Updated app/page.tsx to call setComponentLoaded('ui' and 'fonts')

4. **Playwright Testing & UI Improvements** ✅
   - Used Playwright to capture loading state screenshots
   - Identified issues:
     * Bubbles too large (60-80px → reduced to 8-28px)
     * Missing title glow → added cyan text-shadow
     * Progress bar too narrow → widened to 320px
     * Pearl formation too small → increased to 40px
   - Committed improvements

5. **CRITICAL BUG DISCOVERED** 🔴
   - User reported: "loading state runs forever, app never loads"
   - Cause: `Scene` component inside dynamically imported `UnderwaterScene` never mounts
   - The `setComponentLoaded('scene')` call never happens
   - App stuck on loading screen indefinitely

### Current State of Loading Logic:

**Expected behavior:**
```
1. App mounts with isLoading: true
2. Scene component mounts → setComponentLoaded('scene') after 100ms
3. Page component mounts → setComponentLoaded('ui') after 300ms
4. Fonts load → setComponentLoaded('fonts') via document.fonts.ready
5. All 3 loaded → wait 500ms → setIsLoading(false)
6. Loading screen fades out, app becomes visible
```

**Actual behavior:**
```
1. App mounts with isLoading: true
2. UnderwaterScene is dynamically imported (ssr: false)
3. Scene component never mounts or mount is delayed
4. setComponentLoaded('scene') NEVER fires
5. Loading screen stays forever ❌
```

---

## 5. Next Steps - FIXING THE LOADING STATE

### Immediate Action Required:

**Problem:** Dynamic import of `UnderwaterScene` prevents `Scene` component from mounting quickly enough, so `setComponentLoaded('scene')` never fires.

**Solution Options:**

#### Option A: Simplify - Remove Scene Tracking (RECOMMENDED)
The easiest fix:
1. Remove `'scene'` from the components array in LoadingProvider
2. Only track `'ui'` and `'fonts'`
3. Set a fixed timer (e.g., 2-3 seconds) for loading screen minimum duration
4. Scene loads in background while loading screen shows

**Implementation:**
```typescript
// hooks/useLoadingState.tsx - Update components default
components = ['ui', 'fonts']  // Remove 'scene'

// Add minimum duration timer
useEffect(() => {
  const minDuration = setTimeout(() => {
    if (loadedComponents.size >= components.length) {
      setIsLoading(false);
    }
  }, 2000); // Show loading for at least 2 seconds
  return () => clearTimeout(minDuration);
}, [loadedComponents, components.length]);
```

#### Option B: Fix Scene Detection
More complex but tracks actual scene loading:
1. Move `setComponentLoaded('scene')` call outside of `Scene` component
2. Put it in `UnderwaterScene` component's useEffect
3. Or use the dynamic import's `onLoad` callback (if available)

#### Option C: Remove Loading State Entirely
If user just wants instant app loading:
1. Remove LoadingProvider wrapper
2. Remove Loading component
3. Remove AppContent wrapper
4. App shows immediately with scene loading in background

### Testing Plan:

After implementing fix:
1. Test locally: `npm run dev` and verify app loads
2. Test build: `npm run build` and check for errors
3. Push to GitHub and verify Vercel deployment
4. Use Playwright to capture before/after loading behavior
5. Verify smooth transition from loading → app

### Files to Modify:

**Priority 1 (Critical):**
- `hooks/useLoadingState.tsx` - Simplify component tracking
- `components/UnderwaterScene.tsx` - Remove scene loading signal (or move it)
- `app/page.tsx` - Possibly simplify

**Priority 2 (Testing):**
- Use Playwright to verify fix works
- Capture new screenshots

**Priority 3 (Documentation):**
- Update CLAUDE.md with loading state changes
- Update this CONTEXT.md after fix is complete

---

## 6. Known Issues

### Critical (Blocking):
1. **Loading state stuck infinitely** - Scene component never signals it loaded
   - Impact: App unusable on production
   - Priority: P0 - FIX IMMEDIATELY

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

*Remember: The loading state is currently BROKEN. Fix it before doing anything else!*
