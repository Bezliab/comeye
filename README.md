# Church site with reusable includes (EJS)

## Install
```bash
npm install
```

## Run
```bash
npm start
```

Open: http://localhost:3000

## Where the reusable parts are
- `views/partials/nav.ejs`  -> shared navbar + mobile menu
- `views/partials/footer.ejs` -> shared footer
- `views/partials/head.ejs` and `views/partials/scripts.ejs` -> shared shell

## Notes
- Page content stays exactly as in your split HTML pages (it’s just moved into `views/pages/*.ejs`).
- `showPage()` has been removed from `public/church.js` because navigation is now real routes/pages.
