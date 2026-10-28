# Admissions Edu coded website

This is a standalone replacement for the current Wix coming-soon page. It uses plain HTML, CSS and JavaScript so it can be edited in VS Code and hosted on any static hosting provider.

## Preview locally

Open `index.html` directly, or run a local server from this folder:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Main files

- `index.html`: page content and form fields
- `styles.css`: colours, layout and responsive design
- `script.js`: launch date, countdown and form validation
- `assets/`: logo and favicon

## Before launch

The form is currently a visual, validated prototype. Connect the submit handler in `script.js` to the final Google Sheet, CRM or email service before publishing the production site.
