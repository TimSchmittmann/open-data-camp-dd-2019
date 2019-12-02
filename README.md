# open-data-camp-dd-2019

## [Live Demo](http://glueck-in-dresden.de/)

## Vorhaben

Auf Grundlage einer regelmäßigen Bürgerumfrage zum Wohlbefinden und der Gesundheit der Bürger in Dresden (Zu finden bei [Open Data Dresden](https://opendata.dresden.de/DreiD/)) wollten wir mittels Machine-Learning-Ansätzen untersuchen, welche Faktoren für das persönliche Glück in Dresden eine Rolle spielen. Mit diesem Modell wäre es dann möglich, interessante "Was wäre wenn..?" Analysen durchzuführen. So könnte man z.B. den Einfluss von geplanten Spielplätzen, Sportstätten oder sonstigen Einrichtungen auf das persönliche Wohlempfinden der Bürger besser abschätzen und den Einsatz der verfügbaren Resssourcen optimieren.

## Durchführung

Da die Bürgerumfrage zum Wohlbefinden nach Stadträumen gegliedert wurde, bot sich der Vergleich der einzelnen Stadträume untereinander für unsere Zwecke an. Wir mussten allerdings schnell feststellen, dass die Gliederung nach Stadträumen nicht die einzige Einteilung der Daten ist. Es existieren auch oft feinere Einteilungen in Stadtteile (zus.) und statististische Bezirke oder gröbere Einteilungen nach Stadtbezirken und Ortschaften. Somit war unsere erste Aufgabe die Aggregation von feineren Einteilungen auf Stadträume (oder höher).
