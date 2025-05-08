var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', staticFolder + 'lib/style.js');
    game.load.script('mixins', staticFolder + 'lib/mixins.js');
    game.load.script('WebFont', staticFolder + 'vendor/webfontloader.js');
    game.load.script('gamemenu', staticFolder + 'states/GameMenu.js');
    game.load.script('game', staticFolder + 'states/Game.js');
    game.load.script('gameover', staticFolder + 'states/GameOver.js');
    game.load.script('credits', staticFolder + 'states/Credits.js');
    game.load.script('highscores', staticFolder + 'states/highscores.js');
    game.load.script('enemyPattern', staticFolder + '/assets/patterns/enemies.js');
  },

  loadBgm: function () {
    game.load.audio('mainMenu', staticFolder + 'assets/music/mainMenu.mp3');
    game.load.audio('gameNormal', staticFolder + 'assets/music/gameNormal.mp3');
    game.load.audio('gameBoss', staticFolder + 'assets/music/gameBoss.mp3');
    game.load.audio('gameOver', staticFolder + 'assets/music/gameOver.mp3');
  },

  loadImages: function () {
    game.load.image('stars', staticFolder + 'assets/images/stars.png');
    game.load.image('game-stars', staticFolder + 'assets/images/game-stars.png');
    game.load.image('rocket', staticFolder + 'assets/images/rocket.png');
    game.load.image('bullet', staticFolder + 'assets/images/bullet.png');
    game.load.image('enemy', staticFolder + 'assets/images/enemy.png');
    game.load.image('enemyBullet', staticFolder + 'assets/images/enemy-bullet.png');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['PressStart2'],
        urls: [staticFolder + 'assets/style/pressstart2.css']
      }
    }
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.status]);
  },

  preload: function () {
    game.add.sprite(0, 0, 'spacerunner');
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadBgm();
    this.loadImages();
    this.loadFonts();
  },

  addGameStates: function () {

    game.state.add("GameMenu", GameMenu);
    game.state.add("Game", Game);
    game.state.add("GameOver", GameOver);
    game.state.add("Credits", Credits);
    game.state.add("Highscores", Highscores);
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};
