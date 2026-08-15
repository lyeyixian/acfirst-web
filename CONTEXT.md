<!--
SKETCH — the docs skeleton `border-collie init` (v0.6.0-sketch) writes.

`init` can scaffold this file. It cannot fill it in: the terms below were read
off the repo's own module names, and the definitions are the operator's to
write. An entry left as `<!-- TODO -->` is worse than absent — a Worker will
treat a wrong definition as authoritative.
-->

# acfirst-web

A Remix storefront for AC First. All content and catalogue data lives in Strapi
(`acfirst-strapi`); this app renders it and takes orders.

## Language

**Page**:
A CMS-authored route, fetched by slug, whose body is an ordered list of
Sections. `app/models/page.server.ts`.

**Section**:
One `__component` entry inside a Page — `sections.hero`, `sections.showcase`,
`sections.product-categories` and so on. `app/utils/renderer.tsx` switches on
the discriminator and picks the component.
_Avoid_: block, widget

**Product** / **Category**:
<!-- TODO: what a product code means, and whether category is a tree -->

**Cart** / **Order**:
<!-- TODO: where cart state lives (session? Strapi?) and when it becomes an order -->

**Model**:
A function in `app/models/*.server.ts`. The only place `fetchApi` is called;
loaders call models, components never fetch.
_Avoid_: service, repository

## Architecture decisions

See [docs/adr/](./docs/adr/).
