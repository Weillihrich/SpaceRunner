// Global Variables
var
  game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),
  Main = function () {}

Main.prototype = {

  preload: function () {
    game.load.image('spacerunner', staticFolder + 'assets/images/spacerunner-screen.png');
    game.load.image('loading', staticFolder + 'assets/images/loading.png');
    game.load.script('polyfill', staticFolder + 'lib/polyfill.js');
    game.load.script('utils', staticFolder + 'lib/utils.js');
    game.load.script('splash', staticFolder + 'states/Splash.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }
};

game.state.add('Main', Main);
game.state.start('Main');
