# Northbound Data — Website

The website for Northbound Data: data setup, automation and ERP assistance for small and
medium-sized businesses.

It is built with plain HTML5, Tailwind CSS v4 and a little vanilla JavaScript. There is no
build step and nothing to install.

| File | What it is |
|---|---|
| [`index.html`](index.html) | The website: Home (hero, the three services and a call to action), Services, About and Contact |
| [`privacy.html`](privacy.html) | Privacy policy, in English and Danish |
| `assets/site.css` | Shared styles: fonts, colour tokens and the policy text styles |
| `assets/fonts/` | Self-hosted fonts (Fraunces, Inter, IBM Plex Mono) with their licences |
| `assets/vendor/` | Tailwind CSS browser build with its licence |
| `assets/og-image.png` | The 1200 × 630 image shown when the site is shared (LinkedIn, Facebook, Slack, messaging apps) |
| `favicon.svg`, `favicon-48.png`, `apple-touch-icon.png` | Browser tab, search result and iPhone home-screen icons |
| `brand/` | Logo files for LinkedIn and other profiles (square and horizontal, PNG and SVG) |

Everything is served from the site itself: no fonts, scripts or other content are loaded from
other companies, so visitor data isn't shared with anyone when the page loads.

## Try it

Open `index.html` in a browser. For a result identical to the live site (fonts included), serve
the folder over HTTP instead, e.g. `python3 -m http.server` and open http://localhost:8000.

## Features

- Fully responsive, with a hamburger menu on phones
- Light and dark mode, following the visitor's system setting
- Danish by default, with English one click away on the flag toggle in the header; the choice
  is remembered per browser and carries over to the privacy policy
- Contact form with inline validation
- Cookie notice: the site sets no cookies and does no tracking. The notice tells visitors what
  is saved in their browser (their language choice, and that they closed the notice) and links
  to the privacy policy. It is informational, so there is nothing to accept or decline. If
  analytics or other tracking is ever added, it must become a real consent banner.

## Editing

- **Text:** the Danish copy (the default) is the text inside each element. The English
  version sits next to it in a `data-en` attribute (`data-en-placeholder`,
  `data-en-aria-label` and `data-en-content` for attributes), so both languages are edited
  in the same place.
  Messages written by the script (form errors and confirmations) are in `STRINGS` near the
  bottom of `index.html`.
- **Privacy policy:** `privacy.html` has one `<article>` per language. Update both, and the
  "Last updated" / "Senest opdateret" date, whenever the way you handle personal data
  changes (for example a new email provider, a form service or analytics).
- **Colours:** theme tokens (`--c-*`) in `assets/site.css`, with a light and a dark set.
- **Contact and company details:** search for `frlu@northbound-data.dk`,
  `+45 42928009` and `46630726` in both HTML files.

## Link previews and search

Each page has Open Graph tags (title, description, `assets/og-image.png`), a canonical URL on
`https://northbound-data.dk/`, and the front page has structured business data (name, address,
CVR, phone, email, LinkedIn) for search engines. If you change the preview text or image,
LinkedIn keeps its old copy for a while: paste the URL into LinkedIn's
[Post Inspector](https://www.linkedin.com/post-inspector/) to refresh it.

## Contact form

Messages are delivered by [Formspree](https://formspree.io) to the email address on the
Formspree account. The form's address is the `action` attribute on
`<form id="contact-form" …>` in `index.html`; change it there if you ever switch form.

- The page's own script sends the message in the background and shows the confirmation in
  the visitor's language. Each email gets the subject "Ny besked fra [navn] via
  northbound-data.dk" and a `language` line showing whether the visitor wrote in Danish or
  English. Replying to the email answers the visitor directly.
- Without JavaScript the form still works: it posts straight to Formspree, which shows its
  own thank-you page.
- The privacy policy names Formspree. Delete old submissions in the Formspree dashboard in
  line with the policy (enquiries are deleted within 12 months).

## Deploying

Any static host works, since the pages are served from the repository root:

- **GitHub Pages:** Settings → Pages → deploy from this branch, folder `/ (root)`.
- **Netlify / Vercel:** import the repository. `netlify.toml` and `vercel.json` tell them
  there is no build step.

## Previous version

The earlier multi-page Astro site is in the git history, at commit `ac7fa7e`.
