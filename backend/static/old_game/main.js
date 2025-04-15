var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    // this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
}

//müssen wir kucken wie wir das dann reinbekommen. erstmal das spiel machen wa

function create() {
    // this.add.image(400, 300, 'sky');
    fetch('/api/highscores/')
        .then(response => response.json())
        .then(data => {
            console.log('Highscores:', data);

            // Du kannst sie auch anzeigen lassen:
            let y = 20;
            data.forEach((entry, index) => {
                this.add.text(20, y, `${index + 1}. ${entry.player}: ${entry.score}`, { fontSize: '16px', fill: '#fff' });
                y += 20;
            });
        });
}

function update() {
}

function postHighscore(name, score) {
    fetch('/api/highscores/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            player: name,
            score: score
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error('Fehler beim Speichern:', errorData);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data) console.log('Highscore gespeichert:', data);
    });
}

// Testaufruf
// postHighscore("Willi", 1800);
