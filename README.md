# Wissensplatform

Interaktive Schritt-für-Schritt-Protokoll-App für klinische Bewegungsanalyse (Vicon PlugIn Gait). Inhalte werden aus Markdown-Dateien generiert und als Angular-App auf GitHub Pages bereitgestellt.

## Branch-Struktur

| Branch | Inhalt |
|--------|--------|
| `main` | Markdown-Inhalte, Medien-Assets und Parser-Skript |
| `dev` | Angular-App (Quellcode, Build-Config) |

Bei jedem Push auf `main` läuft automatisch eine GitHub Actions Pipeline:

1. Markdown-Dateien in `content/` werden mit `parser.py` in `public/content/steps.json` konvertiert
2. Medien-Dateien aus `content/info/` werden in `public/content/info/` kopiert
3. Die Angular-App (Branch `dev`) wird gebaut und auf GitHub Pages veröffentlicht

## Inhalte bearbeiten

Protokollschritte werden in `content/*.md` gepflegt:

```markdown
# Makro-Schritt Titel

## Abschnitt (optional)

- [ ] Beschreibung der Aufgabe
- [ ] Aufgabe mit Infobild [i](info/bild.png)
- [ ] Aufgabe mit Info-Video [i](info/video.mp4)
- [ ] Aufgabe mit eigenem Infotitel [i](info/datei.md)
  > Titel des Info-Panels
- [ ] Aufgabe mit reinem Inline-Text
  > Dieser Text erscheint direkt als **Markdown** im Info-Panel
```

Medien-Dateien (Bilder, Videos, GIFs) gehören in den Ordner `content/info/`.

Markdown-Formatierung (fett, kursiv, `Code`, Links) ist in Schritt-Beschreibungen erlaubt.

## Konvertierung lokal testen

Voraussetzung: Python 3.x

```bash
# Einzelne Datei parsen (Ausgabe auf stdout)
python parser.py content/plugin-gait.md

# Ganzes content/-Verzeichnis parsen
python parser.py content/

# Direkt in die App synchronisieren (dev-Branch muss unter ../app liegen)
python parser.py content/ --sync ../app
```

Die Ausgabe ist das `steps.json`, das die Angular-App per HTTP lädt. Struktur:

```json
[
  {
    "id": "a1b2c3d4",
    "title": "Makro-Schritt",
    "mids": [
      {
        "id": "e5f6a7b8",
        "title": "Abschnitt",
        "leaves": [
          {
            "id": "c9d0e1f2",
            "description": "Aufgaben-Beschreibung (Markdown)",
            "info": {
              "title": "Optionaler Titel",
              "content": "Markdown-Inhalt des Info-Panels"
            }
          }
        ]
      }
    ]
  }
]
```

IDs sind deterministisch (MD5-Hash aus Inhaltspfad), damit abgehakte Schritte nach einem Re-Parse erhalten bleiben.
