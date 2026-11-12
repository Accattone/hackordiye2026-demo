# Hack or d(A/I) 2026 — Torneo del Potere

Versione statica del sito **Hack or d(A/I) 2026**, 12—14 novembre 2026 al
[Vag61](https://vag61.nublogs.org/) di Bologna, con tema **Dragon Ball Super —
Torneo del Potere**.

I talk sono interpretati dai dieci guerrieri dell'Universo 7: Goku, Vegeta,
Gohan, Piccolo, Krillin, Android 18, Android 17, Tien Shinhan, Master Roshi e
Frieza. La grafica, i testi e le animazioni sono personalizzati in
`dragonball.css`.

## Pagine

| File | Contenuto |
| --- | --- |
| `index.html` | Home con hero, roster dei guerrieri e info sull'evento |
| `programma.html` / `programma/index.html` | Programma dei tre giorni e talk |
| `come-arrivare.html` / `come-arrivare/index.html` | Come raggiungere l'Arena |
| `grazie/index.html` | Conferma candidatura |
| `tags/`, `categories/` | Pagine di tassonomia del sito statico |

## Struttura

Il sito è composto solo da file statici, senza build step. La grafica base è
quella del sito originale PaperMod, sovrascritta dal tema Dragon Ball in
`dragonball.css`.

```
.
├── index.html
├── programma.html
├── come-arrivare.html
├── dragonball.css
├── assets/
├── css/
├── js/
└── images/
```

## Deploy

I file possono essere pubblicati così come sono su qualsiasi web server statico
o su GitHub Pages. È già presente `.nojekyll`.
