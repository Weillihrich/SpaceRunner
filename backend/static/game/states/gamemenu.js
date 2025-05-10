var GameMenu = function() {};

GameMenu.prototype = {

  init: function () {
    this.optionCount = 1;
  },

  create: function () {
    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'spacerunner');

    try {
      if (!musicPlayer || !musicPlayer.isPlaying || musicPlayer.key !== 'mainMenu') {
        if (musicPlayer) musicPlayer.stop();
        musicPlayer = game.add.audio('mainMenu');
        musicPlayer.loop = true;
        musicPlayer.volume = typeof gameVolume !== "undefined" ? gameVolume : 0.5;
        musicPlayer.play();
      }
    } catch (error) {}

    // Vier Ecken, aber nur in der unteren Hälfte, mit umgekehrtem Text-Alignment
    var optionStyleLeft = { font: '25pt PressStart2', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4 };
    var optionStyleRight = { font: '25pt PressStart2', fill: 'white', align: 'right', stroke: 'rgba(0,0,0,0)', strokeThickness: 4 };

    var marginX = 60;
    var halfY = game.world.height / 2.4;
    var marginY = 120;
    var bottomY = game.world.height - marginY;
    var midY = halfY + (bottomY - halfY) / 2;

    // Unten links: Start (linksbündig)
    var startBtn = game.add.text(marginX, midY, 'Start', optionStyleLeft);
    startBtn.anchor.setTo(0, 0.5);
    startBtn.inputEnabled = true;
    startBtn.events.onInputUp.add(function () {
      game.state.start("Game");
    });

    // Unten rechts: Settings (rechtsbündig)
    var settingsBtn = game.add.text(game.world.width - marginX, midY, 'Settings', optionStyleRight);
    settingsBtn.anchor.setTo(1, 0.5);
    settingsBtn.inputEnabled = true;
    settingsBtn.events.onInputUp.add(function () {
      game.state.start("Settings");
    });

    // Ganz unten links: Highscores (linksbündig)
    var highscoresBtn = game.add.text(marginX, bottomY, 'Highscores', optionStyleLeft);
    highscoresBtn.anchor.setTo(0, 0.5);
    highscoresBtn.inputEnabled = true;
    highscoresBtn.events.onInputUp.add(function () {
      game.state.start("Highscores");
    });

    // Ganz unten rechts: Credits (rechtsbündig)
    var creditsBtn = game.add.text(game.world.width - marginX, bottomY, 'Credits', optionStyleRight);
    creditsBtn.anchor.setTo(1, 0.5);
    creditsBtn.inputEnabled = true;
    creditsBtn.events.onInputUp.add(function () {
      game.state.start("Credits");
    });
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
