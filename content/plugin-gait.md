# Vicon Kalibrierung

## Kameras kalibrieren

- [ ] Auf den System Preparation Tab wechseln [i](info/system-preparation-tab.gif)
- [ ] Unter `Mask Cameras` auf **Start** klicken, ein paar Sekunden warten und dann auf **Stopp** klicken
- [ ] Unter Calibrate Cameras auf **Start** klicken und mit dem Kalibrierstab Kalibrierungsframes aufzeichnen

## Nullpunkt setzen

- [ ] Die Zentrierhilfe zwischen die Laufbänder stecken [i](info/grail-origin-01.mp4)
- [ ] Den Kalibrierstab auf das Laufbandzentrum legen [i](info/grail-origin-02.mp4)
- [ ] Unter Set Volume Origin auf **Start** klicken, 2–3 Sekunden warten und dann auf **Stopp** klicken

# Subject Kalibrierung

## Vorbereitung

- [ ] Einen neuen Trial anlegen
- [ ] Ein neues Skeleton (VSK) mit dem PlugIn Gait `FullBody_vKAD` Template (VST) erstellen [i](info/vkad.md)
- [ ] Die Modellparameter **Height** (Höhe in Millimeter) und **Mass** (Gewicht in kg) eingeben

## ROM-Trial aufzeichnen

- [ ] Den Patienten nach dem PlugIn Gait Markerset und den zwei zusätzlichen Kalibrierungsmarkern mit Markern versehen
- [ ] Den Patienten in Motorradfahrerposition in der Mitte des Grails mit Blickrichtung Leinwand stellen [i](info/motorbike.jpg)
- [ ] Eine Aufzeichnung starten
- [ ] Nach ca. 3 Sekunden in der initialen Position soll der Patient die für die Aufzeichnung notwendige Range of Motion (ROM) vollführen
- [ ] Aufzeichnung beenden und öffnen

## Postprocessing

- [ ] Mit geöffnetem ROM-Trial **Reconstruct** ausführen [i](info/reconstruct.png)
- [ ] Die **AutoInitialize** Labeling-Pipeline ausführen [i](info/auto-initialize.md)
- [ ] Start- und Endemarker (blaue Dreiecke) setzen, sodass sie die ersten Sekunden in der Anfangspose umfassen
- [ ] **Process Static Subject Calibration** ausführen [i](info/static-subject-calibration.md)
- [ ] **Process Static Plug-in Gait Model** ausführen [i](info/static-plugin-gait.md)
- [ ] VSK-Datei speichern
- [ ] Die Kalibrierungsmarker `THI` und `TIB` können nun entfernt werden

# Bewegungsanalyse

## Bewegungsaufzeichnung

- [ ] In den Live-Modus wechseln
- [ ] Aufzeichnung starten
- [ ] Den Patienten die gewünschten Bewegungen machen lassen
- [ ] Aufzeichnung beenden und öffnen

## Postprocessing

- [ ] Die Pipeline `01_Dynamic` öffnen
- [ ] Die Operation **Combined Processing** ausführen [i](info/combined-processing.md)
- [ ] Trajektorien prüfen und Lücken füllen – fehlende Marker-Frames mit **Fill Gaps** schließen, anschließend **Filter Trajectories (Woltring)** anwenden
- [ ] Die Operation **Kinematic Fit** erneut ausführen – aktualisiert das Skeleton-Modell nach dem Gap Filling
- [ ] Die Operation **Process Dynamic Plug-In Gait Model** ausführen [i](info/dynamic-plugin-gait.md)
