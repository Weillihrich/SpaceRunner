# SpaceRunner

https://chatgpt.com/share/67ebd6da-26d8-8001-9d48-56f6f342b749


cd SpaceRunner

python -m venv env

source env/bin/activate  # macOS/Linux
env\Scripts\activate     # Windows

pip install -r .\backend\requirements.txt  # Installiere Abhängigkeiten

python manage.py migrate  # Datenbank einrichten
python manage.py runserver  # Server starten


Ideen:

Ende des Spiels:
    Zeit abgelaufen?
    Getroffen?
        Wie oft getroffen?

Leben des Spielers:
    Treffer?

Gegner
    Größe
    
    Patternbasiert aber Random Patternaufruf
        20x5
    Werden "schnell"

Highscore
    Abgelaufene Zeit * Faktor X
    +
    Getroffene Gegner (mit Multipikator bei "schwereren" Gegnern)



ToDo:

Angreifende Gegner/Tod des Spieler erweitern
Boss-Wave - +100.000 Score ?  

Highscore Page erweitern? Zeiträume auswählen (All Time, dieser tag, letzte woche)

Countdown bevor Spielstart?

Name eingeben verbessern (Löschen und Überlänge)
Submit Button mit onover und onout functions für anzeige

Soundeffekt bei bullet schuss (NCS)

Hoch runter movement(w,s,up,down)

Spielerleben 3 Hits pro run
Vielleicht lebens als Belohnung für Bosslevel