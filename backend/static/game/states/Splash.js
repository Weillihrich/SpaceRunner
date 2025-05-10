var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('globals', staticFolder + 'lib/globals.js');
    game.load.script('bullets', staticFolder + 'assets/Bullets.js');
    game.load.script('mixins', staticFolder + 'lib/mixins.js');
    game.load.script('gamemenu', staticFolder + 'states/gamemenu.js');
    game.load.script('game', staticFolder + 'states/Game.js');
    game.load.script('gameover', staticFolder + 'states/gameover.js');
    game.load.script('credits', staticFolder + 'states/credits.js');
    game.load.script('highscores', staticFolder + 'states/highscores.js');
    game.load.script('enemyPattern', staticFolder + 'assets/patterns/enemies.js');
    game.load.script('settings', staticFolder + 'states/settings.js');
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
    game.load.image('boss', staticFolder + 'assets/images/boss.png');
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
  },

  addGameStates: function () {
    game.state.add("GameMenu", GameMenu); // Stelle sicher, dass GameMenu definiert ist
    game.state.add("Game", Game); // Stelle sicher, dass Game definiert ist
    game.state.add("GameOver", GameOver); // Stelle sicher, dass GameOver definiert ist
    game.state.add("Credits", Credits); // Stelle sicher, dass Credits definiert ist
    game.state.add("Highscores", Highscores); // Stelle sicher, dass Highscores definiert ist
    game.state.add("Settings", Settings); // Stelle sicher, dass Settings definiert ist
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};
