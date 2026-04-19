# Carrer Valencia 214 Landing

## Overview
A React + Vite single-page landing page for a Spanish solar audit campaign. The app has no backend or database; all UI is rendered client-side from `src/App.jsx` and styled via `src/styles.css` with Tailwind CSS v4 imported through CSS.

## Project Structure
- `src/App.jsx` - Main landing page React component and embedded UI sections/forms.
- `src/main.jsx` - React entrypoint.
- `src/styles.css` - Global styles and responsive layout.
- `vite.config.js` - Vite config with React and Tailwind plugins, set for Replit preview on port 5000.
- `package.json` - npm scripts and dependencies.

## Development
- Run with `npm run dev`.
- Development server binds to `0.0.0.0:5000` and allows proxied preview hosts.
- Production deployment is configured as a static Vite build from `dist`.
