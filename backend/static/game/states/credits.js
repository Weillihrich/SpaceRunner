var Credits = function(game) {};

Credits.prototype = {

  preload: function () {
    this.creditCount = 0;
  },

  addCredit: function(task, author) {
    var authorStyle = { font: '20pt PressStart2', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var taskStyle = { font: '15pt PressStart2', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var authorText = game.add.text(game.world.centerX, 900, author, authorStyle);
    var taskText = game.add.text(game.world.centerX, 950, task, taskStyle);
    authorText.anchor.setTo(0.5);
    authorText.stroke = "rgba(0,0,0,0)";
    authorText.strokeThickness = 4;
    taskText.anchor.setTo(0.5);
    taskText.stroke = "rgba(0,0,0,0)";
    taskText.strokeThickness = 4;
    game.add.tween(authorText).to( { y: -300 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 2000);
    game.add.tween(taskText).to( { y: -250 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 2000);
    this.creditCount ++;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '20pt PressStart2', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(10, 530, text, optionStyle);

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
  },

  create: function () {
    this.stage.disableVisibilityChange = true;

    var bg = game.add.sprite(0, 0, 'stars');

    this.addCredit('Developer', 'Willi Weihrich');
    this.addCredit('Developer', 'David Göbel');
    this.addCredit('Phaser.io', 'Powered By');
    this.addCredit('for playing', 'Thank you');
    this.addMenuOption('Back', function () {
      game.state.start("GameMenu");
    });
    game.add.tween(bg).to({alpha: 0}, 20000, Phaser.Easing.Cubic.Out, true, 40000);
  }

};
