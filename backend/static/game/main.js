// Global Variables
var
  game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),
  Main = function () {},
  musicPlayer;

Main.prototype = {

  preload: function () {
    game.load.image('spacerunner', staticFolder + 'assets/images/spacerunner-screen.png');
    game.load.image('loading', staticFolder + 'assets/images/loading.png');
    game.load.script('polyfill', staticFolder + 'lib/polyfill.js');
    game.load.script('utils', staticFolder + 'lib/utils.js');
    game.load.script('splash', staticFolder + 'states/Splash.js');

  },

  create: function () {
    game.add.sprite(0, 0, 'spacerunner');

    var titleStyle = { font: 'bold 50pt PressStart2', fill: '#FDFFB5', align: 'center'};
    var text = game.add.text(game.world.centerX, 100, "Highscores", titleStyle);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    text.anchor.set(0.5);

    //game.state.add('Splash', Splash);
    //game.state.start('Splash');
  }
};

game.state.add('Main', Main);
game.state.start('Main');
