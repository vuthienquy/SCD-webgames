# SCD-webgames — shared architecture update

## What changed in this package

- Extracted the inline CSS from the home page, game library, and Contraband page into `styles/home.css`, `menu/menu.css`, and `GAMES/Contraband/game.css`.
- Kept shared design tokens and baseline rules in `shared/styles/tokens.css` and `shared/styles/base.css`.
- Added a single shared language API in `shared/i18n/language.js` and moved home, menu, and Settings dictionaries into `shared/i18n/translations.js`.
- Updated the Settings component to use the shared language API. The stored preference remains `scd-language` (`en` or `vi`), and the existing `scd-language-change` event is retained.
- Kept the two background choices separate: the home page loads `effect-neuron-heavy.js`; the menu loads `effect-neuron.js`.
- Kept the 3D objects in `shared/objects/`; the heavy background imports and uses those modules rather than duplicating their drawing code.
- Made the Contraband page use the shared color/font tokens while preserving its page-specific layout.

## Target structure

```text
index.html
styles/home.css
menu/
  index.html
  menu.css
  games.js
  Contraband.html
GAMES/Contraband/
  main.html
  game.css
shared/
  i18n/
    language.js
    translations.js
  styles/
    tokens.css
    base.css
  background/
    background.css
    network.js
    effect-neuron.js
    effect-neuron-heavy.js
  objects/
    index.js
    factory.js
    rotation.js
    ... object modules ...
  settings.js
  settings.css
```

## Test checklist

1. Run the project through VS Code Live Server or another local HTTP server (do not open module pages using `file://`).
2. Check the home page in English and Vietnamese; the Settings button and popup should both translate.
3. Open the menu; it should show the neuron background only, with no floating 3D objects.
4. Change language from the menu and verify the game card, navigation, and Settings update.
5. Open the Contraband page and check its layout and responsive behavior.
6. Open the browser console and confirm there are no missing imports or 404s.

## Follow-up architecture work (not performed automatically)

- Extract a shared header/navigation component only after the page layouts are stable and the repeated HTML structure is clearly defined.
- Add more component CSS files only when a component is used by multiple pages; avoid creating one file per tiny element.
- Add a build tool such as Vite only if the project grows enough to benefit from bundling, asset hashing, or a more formal component system.

This package preserves the existing static HTML/CSS/JavaScript approach and does not require a build step.
