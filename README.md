# Aleksandr Zamashkin — Portfolio

Hosted at [zamashkin.ru](https://zamashkin.ru/) and [zamashkin.dev](https://zamashkin.dev/)

Personal website with work experience, technology stack, CV, and contact links.
Built with HTML, CSS, and vanilla JavaScript. No dependencies to install or build
step required.

## Structure

```text
public/             Deployable website
  index.html        Page content
  css/              Stylesheets
  js/               Browser JavaScript
  assets/           Images, videos, and CV
tests/              Automated tests
design/             Design references
docs/               Deployment guide
.github/workflows/  GitHub Actions
```

## Preview

Open `public/index.html` directly in your browser. For an optional HTTP preview:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Then open [localhost:8000](http://127.0.0.1:8000).

## Tests

With Node.js installed:

```sh
node --test tests/copy-email.test.cjs
```

## Deployment

Once configured, GitHub Actions tests and uploads the website to a DigitalOcean
droplet on pushes to `main`. The remote website mirrors `public/`, including
removal of files that no longer exist locally.
See [deployment setup](docs/deployment.md) for instructions and
[design references](design/README.md) for the retained mockups.
