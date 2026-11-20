# Project Rules & Build Guidelines

## Web Only Build Restriction
- **CURRENT MODE**: Web Testing Only.
- **RESTRICTION**: Do NOT compile, build, or package for Desktop (Windows / macOS / Linux) or Mobile (Android / iOS).
- **FORBIDDEN COMMANDS**:
  - `npm run tauri build`
  - `npm run tauri dev`
  - `cargo build`
  - Any Android Gradle / NDK / Tauri mobile build commands
  - Do NOT invoke desktop or android compilation unless the user explicitly asks for desktop or android builds.
- **ALLOWED COMMANDS**:
  - `npm run build` (SvelteKit Web / Vite build)
  - `npm run dev` (Vite web development server)
  - `npm run preview`
- **REASON**: Rust and Android compilation artifacts in `src-tauri/target/` and `.gradle/` quickly consume 10GB–15GB+ of disk space.
