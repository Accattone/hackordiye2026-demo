# Hack or d(A/I) 2026 — sito

Sito statico dell'evento **Hack or d(A/I) 2026**, 12—14 novembre 2026 al
[Vag61](https://vag61.nublogs.org/) di Bologna (Via Paolo Fabbri 110, quartiere
Cirenaica).

I contenuti sono derivati dal sito originale
`https://hacklabbo.indivia.net/hackordiye26/` e riorganizzati in un sito
autonomo, senza dipendenze da framework o build step.

## Pagine

| File | Contenuto |
| --- | --- |
| `index.html` | Home: date, luogo, cosa trovi, link rapidi, info pratiche |
| `cft.html` | Call for Talk e form di proposta |
| `programma.html` | Programma dei tre giorni e dettagli di talk e laboratori |
| `come-arrivare.html` | Indicazioni per raggiungere il Vag61 (bici, bus, auto, aeroporto) |

## Struttura

```
.
├── index.html
├── cft.html
├── programma.html
├── come-arrivare.html
└── assets
    ├── css/style.css
    ├── js/main.js
    └── img
        ├── favicon.png
        └── locandina.jpg
```

## Vederlo in locale

Non serve compilare nulla. Basta servire la cartella con un web server statico:

```bash
python3 -m http.server 8000
```

Poi apri <http://localhost:8000/>.

Aprire direttamente `index.html` con `file://` funziona quasi del tutto, ma le
mappe embeddate e la copia negli appunti rendono meglio via HTTP.

## Deploy

Il sito è composto solo da file statici: può essere pubblicato così com'è su
GitHub Pages, GitLab Pages, Netlify, Cloudflare Pages o qualsiasi web server.

Per GitHub Pages è già presente il file `.nojekyll`.

## Note tecniche

- Tema chiaro/scuro con preferenza salvata in `localStorage`.
- Navigazione mobile, copia email, terminale di bordo con comandi (`help`, `ls`,
  `open`, `whoami`, `date`, `sudo`, `clear`, `exit`).
- Il form della Call for Talk invia a
  `https://flow.gattini.ninja/hooks/hod26-form-submission`. Se l'endpoint cambia,
  aggiorna l'attributo `action` in `cft.html`.
- Le mappe in `come-arrivare.html` sono embed di OpenStreetMap e
  `maps.gattini.ninja`.
- Il link al pad dei passaggi è `https://pad.esiliati.org/p/passaggiHoD`.

## Contatti

Email: `hacklabbo[chiocciolina]posta.indivia.net` (sostituire `[chiocciolina]`
con `@`).
