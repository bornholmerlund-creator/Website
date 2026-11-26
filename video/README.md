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

---

# Power BI-video (40 sekunder)

Video nummer to: "fra datakaos til klarhed" om Power BI. 1920×1080, 30 fps, præcis 40 s. Koden ligger i `src/pbi/`, og den deler brandfarver, fonte og animationshjælpere med 30-sekunders videoen (`src/kit.tsx`).

| Tid | Scene | Indhold |
|---|---|---|
| 0:00–0:06 | Problemet | Hurtige nærbilleder: budgetark med `#REF!`, CSV-eksport med dubletter, mailtråd med tre versioner af samme fil, databaseforespørgsel med manglende værdier. Kameraet trækker sig tilbage. Tekst: "Har I data overalt – men mangler ét samlet overblik?" |
| 0:06–0:14.8 | Transformation | Vinduerne bliver til datakilder (Excel, ERP, SQL-database, CRM, webshop), der flyder ind i én datamodel, som folder sig ud til et Power BI-agtigt dashboard. Tekst: "Fra data til indsigt." |
| 0:14.8–0:23.4 | Det leverer jeg | Implementering, Integrationer, Dashboards, Vedligeholdelse & optimering. Stjerneskema med kilder, en rodet gammel rapport der bliver til et rent dashboard (med krydsfiltrering), og en ydeevneanalyse |
| 0:23.4–0:33 | Drift og troværdighed | Hurtigere rapporter, pålidelig dataopdatering, Udvikling → Test → Produktion, sikker adgang. Derefter "700+" og "Erfaring fra Power BI-løsninger med 700+ brugere" |
| 0:33–0:40 | Brand og CTA | Frederiks portræt med navn og titel, logo, "Komplekse data, gjort enkle.", Power BI · Dataopsætning · Automatisering, "Book et uforpligtende møde", northbound-data.dk |

Dashboardet er tegnet i jeres egne farver i et velkendt Power BI-layout. Der er ingen Microsoft- eller Power BI-logoer, og alle tal er eksempeldata ("Eksempeldata" står i rapportens bundlinje).

## Speak, undertekster og musik

- Speaken og underteksterne har ét fælles manuskript med tider: `src/pbi/script.ts`.
- `npm run subs:pbi` skriver underteksterne som WebVTT og SRT til `out/` (til `<track>` på hjemmesiden eller til LinkedIn/YouTube).
- Speak: læg seks lydfiler i `public/vo/` med navnene `vo1.wav` … `vo6.wav` (én pr. replik i `VO`), og kør `npm run render:pbi-vo`. Musikken dukkes automatisk under speaken. Passer en replik ikke i tid, så ret `at` i `VO`.
- Musikken er komponeret i kode (`tools/make_music.py`, kræver numpy og scipy) og kræver ingen kreditering. Lydeffekter: Kenney (CC0).

## Render

```bash
npm run render:pbi          # med indbrændte undertekster
npm run render:pbi-clean    # uden undertekster (brug sammen med .vtt-filen)
```

De leverede filer er lydnormaliseret og derefter skruet 70 % ned (Frederiks ønske, 2026-11-26):

```bash
ffmpeg -i ind.mp4 -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11,volume=0.3" -c:a aac -b:a 192k -movflags +faststart ud.mp4
```
