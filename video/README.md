# Northbound Data – 30-sekunders præsentationsvideo

Remotion-projekt (React → MP4) bygget med Superbrag-skabelonen som udgangspunkt
(<https://github.com/aakashmehra/superbrag>). 1920×1080, præcis 30 s, 60 fps (30 fps-variant medfølger).
Farver, fonte (Fraunces, Inter, IBM Plex Mono – selvhostede woff2) og tekster kommer fra northbound-data.dk.

## Drejebog

| Tid | Scene | Indhold |
|---|---|---|
| 0:00–0:05 | Hook | Seks datakilder (ERP, CRM, regneark, webshop, faktura, rapport) med dubletter og tal, der ikke stemmer → samles i ét gitter: "Samlet til ét overblik." → folder sig sammen til ét punkt |
| 0:05–0:12 | Introduktion | Keystone-logoet tegner sig, ordmærket glider ind, "Få styr på jeres data — og timerne tilbage." + "Partneren, der gør jeres data til en konkret konkurrencefordel." |
| 0:12–0:19 | Løsninger | Tre UI-kort: Dataopsætning (kilder flettes, dubletter 214 → 0), Automatisering (fakturaflow, 6,5 t → 0,5 t), ERP-assistance (sundhedstjek 58 % → 94 %). Systemer ruller i bunden |
| 0:19–0:23 | Værdi | Sidens før/efter-eksempel: 15,5 → 1 time om ugen, ≈ 750 timer om året |
| 0:23–0:30 | CTA | "Komplekse data, gjort enkle." + tillid (leverandøruafhængig, ingen binding, svar inden for én arbejdsdag) → logo, "Book et uforpligtende møde" klikkes, northbound-data.dk, e-mail og telefon |

## Render

Kræver Node.js 22+ og FFmpeg.

```bash
cd video
npm install
npx remotion browser ensure          # henter Chrome Headless Shell første gang
npm run render                       # → out/northbound-data-30s.mp4 (60 fps)
npm run render:30                    # → 30 fps-version
npm run studio                       # live forhåndsvisning/redigering i browseren
```

Valgfrit: normalisér lyden til -14 LUFS (som Superbrag gør):

```bash
ffmpeg -i out/northbound-data-30s.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5 -c:a aac -b:a 192k out/final.mp4
```

Al tekst og timing ligger i `src/scenes/*.tsx`; tidslinjen i `src/Video.tsx`; brandfarver i `src/kit.tsx`.

## Licenser

- Musik: "Happy Beats / Business Moves" Vol. 1 af Sascha Ende (ende.app), CC BY 4.0. Kreditering ved opslag: "Music: Sascha Ende, ende.app (CC BY 4.0)".
- Lydeffekter: Kenney (CC0).
- Remotion er gratis for virksomheder med op til 3 personer (remotion.dev/license).
