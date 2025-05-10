var GameOver = function(game) {};

GameOver.prototype = {

  preload: function () {
    this.optionCount = 1;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt PressStart2', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 300, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0)";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;

  },

  create: function () {
    try {
      musicPlayer.stop();
    } catch (error) {}
    musicPlayer = game.add.audio('gameOver');
    musicPlayer.loop = true;
    musicPlayer.volume = typeof gameVolume !== "undefined" ? gameVolume : 0.5;
    musicPlayer.play();

    game.add.sprite(0, 0, 'stars');
    var titleStyle = { font: 'bold 60pt PressStart2', fill: '#FDFFB5', align: 'center'};
    var text = game.add.text(game.world.centerX, 100, "Game Over", titleStyle);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    text.anchor.set(0.5);

    // Eingabefeld für den Namen des Spielers
    var inputBackground = game.add.graphics();
    inputBackground.beginFill(0x212121, 1);
    inputBackground.drawRect(game.world.centerX - 150, 200, 300, 40);
    inputBackground.endFill();

    var inputText = game.add.text(game.world.centerX - 140, 205, '', {
      font: '18px Arial',
      fill: '#FFFFFF',
      align: 'left',
    });

    var cursor = '|';
    game.time.events.loop(Phaser.Timer.SECOND / 2, () => {
      cursor = cursor === '|' ? '' : '|';
      inputText.setText(inputText.text.replace('|', '') + cursor);
    });

    game.input.keyboard.addCallbacks(this, null, null, (char) => {
      if (char === '\b') {
        inputText.setText(inputText.text.slice(0, -2) + cursor); // Entferne das letzte Zeichen
      } else if (char === '\r') {
        this.submitScore(inputText.text.replace('|', '').trim(), scorePoints); // Bestätige Eingabe
      } else if (char.length === 1) {
        inputText.setText(inputText.text.replace('|', '') + char + cursor); // Füge Zeichen hinzu
      }
    });

    // Button zum Bestätigen des Namens
    var submitButton = game.add.text(game.world.centerX, 300, 'Submit', {
      font: '20pt PressStart2',
      fill: '#FFFFFF',
      align: 'center',
    });
    submitButton.anchor.setTo(0.5);
    submitButton.inputEnabled = true;
    submitButton.events.onInputUp.add(() => {
      const playerName = inputText.text.replace('|', '').trim();
      if (playerName) {
        this.submitScore(playerName, scorePoints);
        
      }
    });

    this.addMenuOption('Main Menu', function (e) {
      this.game.state.start("GameMenu");
    });
  },

  submitScore: function (playerName, score) {
    // Sende den Score an die Datenbank
    console.log('Submitting score:', playerName, score);
    fetch('/api/highscores/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ player: playerName, score: score }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Score submitted successfully');
          // Wechsel zur Highscores-Seite nach 1 Sekunde
          game.time.events.add(Phaser.Timer.SECOND * 1, () => {
            this.game.state.start('Highscores');
          });
        } else {
          console.error('Failed to submit score');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  },
};
