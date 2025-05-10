var Settings = function() {};

Settings.prototype = {
  create: function () {
    game.add.sprite(0, 0, 'stars');

    var titleStyle = { font: 'bold 40pt PressStart2', fill: '#FDFFB5', align: 'center'};
    var text = game.add.text(game.world.centerX, 100, "Settings", titleStyle);
    text.anchor.set(0.5);

    var labelStyle = { font: '20pt PressStart2', fill: 'white', align: 'left'};
    var volumeLabel = game.add.text(game.world.centerX - 200, 250, "Volume:", labelStyle);

    var volumeValue = game.add.text(game.world.centerX + 80, 250, Math.round(gameVolume * 100) + "%", labelStyle);

    var minusBtn = game.add.text(game.world.centerX + 170, 250, "-", labelStyle);
    minusBtn.inputEnabled = true;
    minusBtn.events.onInputUp.add(function () {
      gameVolume = Math.max(0, gameVolume - 0.1);
      volumeValue.setText(Math.round(gameVolume * 100) + "%");
      if (typeof musicPlayer !== "undefined" && musicPlayer) {
        musicPlayer.volume = gameVolume;
      }
    });

    var plusBtn = game.add.text(game.world.centerX + 230, 250, "+", labelStyle);
    plusBtn.inputEnabled = true;
    plusBtn.events.onInputUp.add(function () {
      gameVolume = Math.min(1, gameVolume + 0.1);
      volumeValue.setText(Math.round(gameVolume * 100) + "%");
      if (typeof musicPlayer !== "undefined" && musicPlayer) {
        musicPlayer.volume = gameVolume;
      }
    });

    var backBtn = game.add.text(game.world.centerX, 400, "Back", labelStyle);
    backBtn.anchor.set(0.5);
    backBtn.inputEnabled = true;
    backBtn.events.onInputUp.add(function () {
      game.state.start("GameMenu");
    });
  }
};
