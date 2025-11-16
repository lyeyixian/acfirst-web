# Agent Guidelines for acfirst-web/frontend

## Commands
- **Build**: `npm run build` (Remix build)
- **Dev server**: `npm run dev` (Remix dev)
- **Start production**: `npm run start` (Remix serve)
- **Type check**: `npm run typecheck` (TypeScript)
- **Lint**: `npx eslint` (ESLint with Remix config)

## Code Style
- **Framework**: Remix with React 18, TypeScript strict mode
- **UI Library**: Mantine v6 with Emotion styling
- **Imports**: External libraries first, then internal with `~/*` path alias
- **Components**: PascalCase, functional with hooks
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **JSX**: react-jsx transform
- **Error Handling**: Null checks, early returns, no try/catch unless necessary
- **Styling**: Mantine createStyles hook with theme-based responsive design
- **Server Models**: Async functions with fetchApi utility, Strapi-like API structure

## File Organization
- `app/components/`: Reusable UI components
- `app/routes/`: Remix route files
- `app/models/`: Server-side data fetching
- `app/utils/`: Helper functions and utilities
- `app/hooks/`: Custom React hooks</content>
<parameter name="filePath">/Users/yixianlye/Documents/repo/acfirst-web/frontend/AGENTS.md