# landing_page

This repository now contains the current production landing-page source from
`solar.eltex.es`.

## Current source

The live Railway landing-page app is stored in:

- `project-solar-live-web/`

That folder is a source snapshot of the production `railway-web` landing-page
app from the `project-solar` monorepo, including the landing page, capture
flow, and shared brand contract it depends on.

## Why it is stored this way

The repository already had an older standalone landing-page prototype at the
root. To avoid overwriting historical work without review, the current live app
has been added as a clearly named source folder instead of replacing the root
prototype in place.

## Important files

- `project-solar-live-web/app/p/[id]/page.tsx`
- `project-solar-live-web/src/components/LeadProposalTemplate.tsx`
- `project-solar-live-web/src/components/LeadCaptureForm.tsx`
- `project-solar-live-web/app/api/capture/route.ts`
- `project-solar-live-web/shared-solar-core/src/brand.js`
