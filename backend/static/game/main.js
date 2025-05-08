// Global Variables
var
  game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),
  Main = function () {},
  musicPlayer;

Main.prototype = {

  loadImages: function () {
    game.load.image('spacerunner', staticFolder + 'assets/images/spacerunner-screen.png');
    game.load.image('loading', staticFolder + 'assets/images/loading.png');
  },

  loadScripts: function () {
    game.load.script('polyfill', staticFolder + 'lib/polyfill.js');
    game.load.script('utils', staticFolder + 'lib/utils.js');
    game.load.script('splash', staticFolder + 'states/Splash.js');
    game.load.script('style', staticFolder + 'lib/style.js');
    game.load.script('WebFont', staticFolder + 'vendor/webfontloader.js');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['PressStart2'],
        urls: [staticFolder + 'assets/style/pressstart2.css']
      }
    }
  },

  preload: function () {
    this.loadImages();
    this.loadScripts();
    this.loadFonts();
  },

  addStartButton: function () {
    var titleStyle = { font: '40pt PressStart2', fill: '#FFFFFF', align: 'center'};
    var text = game.add.text(game.world.centerX, 300, "START", titleStyle);
    text.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 5);
    text.anchor.set(0.5);

    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200, 200, 200, 0.5)";
      text.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0, 0, 0, 0)";
      text.useHandCursor = false;
    };

    text.inputEnabled = true;
    text.events.onInputOver.add(onOver, this);
    text.events.onInputOut.add(onOut, this);
    text.events.onInputUp.add(function (){game.state.start("Splash")}, this);

    let shown = true;
    function fadeLoop() {
      if (shown) {
        let tween = game.add.tween(text).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
        tween.onComplete.addOnce(() => {
          shown = false;
          fadeLoop();
        });
      } else {
        let tween = game.add.tween(text).to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
        tween.onComplete.addOnce(() => {
          shown = true;
          fadeLoop();
        });
      }
    }
    fadeLoop();
  },

  create: function () {
    game.add.sprite(0, 0, 'spacerunner');
    game.state.add('Splash', Splash);
    this.addStartButton();
  }
};

game.state.add('Main', Main);
game.state.start('Main');
