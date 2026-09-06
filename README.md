# Aleksandr Zamashkin — Portfolio

Personal website with work experience, technology stack, CV, and contact links.
Built with HTML, CSS, and vanilla JavaScript. No dependencies to install or build
step required.

## Preview

Open `index.html` directly in your browser. For an optional HTTP preview:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open [localhost:8000](http://127.0.0.1:8000).

## Tests

With Node.js installed:

```sh
node --test tests/copy-email.test.cjs
```

## Deployment

Once configured, GitHub Actions tests and uploads the website to a DigitalOcean
droplet on pushes to `main`. Design mockups and development files are excluded.
See [deployment setup](DEPLOYMENT.md) for instructions and
[design references](design/README.md) for the retained mockups.
