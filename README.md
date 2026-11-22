# Please Fit the Form

A short browser game about who gets to write the rules for belonging.

## Play locally

Unzip the download, then double-click `index.html` to open it in your browser.
There is no installation, server, account, or internet connection needed.

## GitHub Pages

Put the game files at the root of a GitHub repository. In **Settings → Pages**,
choose **Deploy from a branch**, select your branch and **/(root)**, and save.
The game uses relative paths, so it can also run on a project site.

## Source

- `index.html` contains the interface.
- `styles.css` styles the atelier, registry, and sandbox.
- `avatar.js` draws the layered avatar.
- `game.js` controls the stages and rule validation.

During the registry review, change your avatar and resubmit to reveal more
requirements. The final conflict is intentional. Open **Inspect requirements**
after denial, or use **Skip to rules editor** for a shorter playthrough.
**Restart** clears the game state. Player input stays in the current page.
