# SpaceRunner

https://chatgpt.com/share/67ebd6da-26d8-8001-9d48-56f6f342b749


cd SpaceRunner

python -m venv env

source env/bin/activate  # macOS/Linux
env\Scripts\activate     # Windows

pip install -r .\backend\requirements.txt  # Installiere Abhängigkeiten

python manage.py migrate  # Datenbank einrichten
python manage.py runserver  # Server starten
