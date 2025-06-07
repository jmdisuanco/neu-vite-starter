# Neutralino vite starter app
### React + TypeScript + Vite + Nuetralino

- Typescript
- Tailwind CSS 4
- Shadcn UI
- Built-in Bun server


## Requirements
- **Development Stage**
  - [Bun](https://bun.sh/)
  - [Neutralino cli](https://neutralino.js.org/docs/cli/neu-cli/)
- **Build Stage**
  - [jq](https://jqlang.org/)

## Usage no extension
 Staring a new Neutralino project  using this template
 - `bunx degit jmdisuanco/neu-vite-starter TARGET_DIRECTORY`
 - `cd TARGET_DIRECTORY`
 - `neu update`
 - `bun run dev`


## Usage with Bun server extension
 Staring a new Neutralino project  using this template
 - `bunx degit jmdisuanco/neu-vite-starter#bun TARGET_DIRECTORY`
 - `cd TARGET_DIRECTORY`
 - `neu update`
 - `bun run dev`

## Icons
 only `icon.png`  is required. `.ico` and `.icns` is automatically generated from it.

## Build
 Building your app
 - osx `brew install jq` or Linux and Windows(WSL) `sudo apt-get install jq`
 - use neutralino build `neu build`
 - packaging 
   CLI Tool Coming soon

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## Pushing to repository 
you might need to `git config http.postBuffer 524288000`  to accomodate the build tool scaffolds


## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
