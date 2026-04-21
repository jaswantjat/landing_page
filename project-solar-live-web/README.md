## Project Solar Live Web Snapshot

This folder contains the current `railway-web` source snapshot from the live `project-solar` monorepo.

What it is:
- the current landing-page app source used for `solar.eltex.es`
- copied from the main `project-solar` workspace

What it is not:
- not a fully standalone app in this folder by itself
- it still reflects the monorepo structure and shared-package assumptions from `project-solar`

Included on purpose:
- `app/`
- `src/`
- config files needed to inspect the web app source
- the shared brand contract used by the landing page

Excluded on purpose:
- `.env*`
- `.next/`
- `node_modules/`
- local build artifacts

Source of truth for production remains:
- `jaswantjat/project-solar`
- app path: `railway-web/`
