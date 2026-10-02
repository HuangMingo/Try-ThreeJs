# Try Three.js

Next.js App Router starter using TypeScript and Three.js.

## Start development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Main structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.module.css
│   └── page.tsx
└── components/
    └── ThreeScene.tsx
public/
└── models/
```

Three.js code that uses browser APIs belongs in a Client Component such as
`ThreeScene.tsx`. Static models are available from `/models/<file-name>`.
