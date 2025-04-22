var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 260,
    startX: 30
  },

  init: function () {
    this.optionCount = 1;
  },

  create: function () {

    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'spacerunner');

    this.addMenuOption('Start', function () {
      game.state.start("Game");
    });
    this.addMenuOption('Highscores', function () {
      game.state.start("Highscores");
    });
    this.addMenuOption('Credits', function () {
      game.state.start("Credits");
    });
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
