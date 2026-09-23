# Northbound Data — Website

The website for Northbound Data: data setup, automation and ERP assistance for small and
medium-sized businesses.

It is a single page, [`index.html`](index.html), with four sections: Home (hero, the three
services and a call to action), Services, About and Contact. It is built with plain HTML5,
Tailwind CSS v4 (loaded from a pinned CDN build) and a little vanilla JavaScript. There is
no build step and nothing to install.

## Try it

Open `index.html` in a browser. That's it.

## Features

- Fully responsive, with a hamburger menu on phones
- Light and dark mode, following the visitor's system setting
- English and Danish, switched with the flag toggle in the header; the choice is remembered
  per browser
- Contact form with inline validation

## Editing

- **Text:** the English copy is the text inside each element. The Danish version sits next
  to it in a `data-da` attribute (`data-da-placeholder`, `data-da-aria-label` and
  `data-da-content` for attributes), so both languages are edited in the same place.
  Messages written by the script (form errors and confirmations) are in `STRINGS` near the
  bottom of the file.
- **Colours:** theme tokens (`--c-*`) at the top of the file, with a light and a dark set.
- **Contact details:** search for `hello@northbounddata.com` and `+44 20 4538 1190`. They
  are placeholders.

## Contact form

Until it is connected, the form validates input and tells the visitor that nothing was sent.
To receive messages, create a form at [Formspree](https://formspree.io) (or a similar
service) and paste its URL into `FORM_ENDPOINT` near the bottom of `index.html`.

## Deploying

Any static host works, since `index.html` is served from the repository root:

- **GitHub Pages:** Settings → Pages → deploy from this branch, folder `/ (root)`.
- **Netlify / Vercel:** import the repository. `netlify.toml` and `vercel.json` tell them
  there is no build step.

## Previous version

The earlier multi-page Astro site is in the git history, at commit `ac7fa7e`.
