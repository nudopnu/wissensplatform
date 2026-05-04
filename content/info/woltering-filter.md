Der Woltring-Filter ist ein quintic spline smoother — er glättet die Marker-Trajektorien, indem er hochfrequentes Rauschen entfernt, das durch Messungenauigkeiten der Kameras entsteht.

Zwei Modi:

- MSE (Mean Square Error) — du gibst einen Fehlerwert vor, der Filter wählt automatisch die passende Glättungsstärke. Wird meistens verwendet.
- GCV (Generalized Cross-Validation) — bestimmt die optimale Glättung vollautomatisch ohne manuellen Parameter.

Da das Dynamic Model Positionen zweifach ableitet (→ Geschwindigkeit → Beschleunigung), wird selbst kleines Messrauschen stark verstärkt und führt zu unrealistischen Spitzen in Gelenkkräften und -momenten. Der Woltring-Filter glättet die Trajektorien so, dass diese Artefakte verschwinden, ohne das echte Bewegungssignal zu verzerren — und funktioniert dabei auch bei lückenhaften oder ungleichmäßig gesampelten Daten zuverlässiger als ein einfacher Butterworth-Filter.