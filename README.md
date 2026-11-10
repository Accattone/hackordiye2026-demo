# WHISKERCON 26 — sito

Sito statico satirico della **nona conferenza internazionale segreta dei gatti
ninja**, 20—22 novembre 2026 al Dojo Orbitale Mochi (coordinate redatte).

Un unico file HTML, CSS e JavaScript puri, senza framework, build step, font
esterni o CDN. Tutto il contenuto è inventato: WHISKERCON non esiste, almeno
ufficialmente.

## Pagine

Il sito è una single page: tutto vive in `index.html`.

| Sezione | Contenuto |
| --- | --- |
| Hero | Titolo glitch, countdown, radar, ticker di notizie riservate |
| Manifesto | Dossier, testi redatti cliccabili, statistiche |
| Keynote | Tre sessioni plenarie con titoli e abstract improbabili |
| Speaker | Otto relatori felini con identità parzialmente verificate |
| Programma | Tre giorni con tab accessibili, timeline e download `.ics` |
| Iscrizioni | Form dimostrativo con validazione e codice agente generato |
| Venue | Mappa stilizzata, logistica, FAQ e codice d'onore |
| Sponsor | Entità opache che negano ogni coinvolgimento |

## Struttura

```
.
├── index.html
├── assets
│   ├── css/style.css
│   ├── js/main.js
│   └── img/favicon.svg
├── .nojekyll
└── README.md
```

## Vederlo in locale

Non serve compilare nulla. Basta servire la cartella con un web server statico:

```bash
python3 -m http.server 8000
```

Poi apri <http://localhost:8000/>.

## Deploy

Il sito è composto solo da file statici: può essere pubblicato così com'è su
GitHub Pages, GitLab Pages, Netlify, Cloudflare Pages o qualsiasi web server
(nginx incluso). Per GitHub Pages è già presente il file `.nojekyll`.

Esempio con nginx: copia il contenuto della cartella nella web root e ricarica
nginx.

```bash
rsync -av --delete ./ utente@server:/var/www/whiskercon26/
```

## Note tecniche

- Tema scuro con **visione notturna** opzionale, preferenza salvata in
  `localStorage` (chiave `wc-theme`).
- Countdown live fino al 20 novembre 2026, ore 09:00 (UTC+9).
- Campo stellare su `<canvas>`, bagliore del cursore e reveal on scroll con
  `IntersectionObserver`; tutto rispetta `prefers-reduced-motion`.
- Navigazione mobile accessibile, tab del programma con supporto tastiera.
- Testi redatti rivelabili al clic.
- Form di iscrizione puramente dimostrativo: nessun dato viene inviato,
  conservato o miagolato. Il codice agente è generato nel browser.
- Download calendario `.ics` generato lato client.

## Disclaimer

WHISKERCON 26 è un sito satirico e dimostrativo. Non esiste alcuna conferenza
segreta di gatti ninja, almeno non ufficialmente. Nessun gatto è stato
interpellato per la realizzazione di questo sito; alcuni gatti hanno comunque
espresso opinioni.
