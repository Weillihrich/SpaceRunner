var Settings = function() {};

Settings.prototype = {
  create: function () {
    // Transparenten Hintergrund hinzufügen
    var overlay = game.add.graphics(0, 0);
    overlay.beginFill(0x000000, 0.7);
    overlay.drawRect(0, 0, game.world.width, game.world.height);
    overlay.endFill();

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

    // "Zurück zum Spiel"-Button
    var backToGameBtn = game.add.text(game.world.centerX, 350, "Zurück zum Spiel", labelStyle);
    backToGameBtn.anchor.set(0.5);
    backToGameBtn.inputEnabled = true;
    backToGameBtn.events.onInputUp.add(function () {
      // Zurück zum Game-State und Zustand wiederherstellen
      game.state.start("Game", false, false);
      setTimeout(function() {
        var gameState = game.state.states.Game;
        if (gameState && gameState._savedState) {
          var savedState = gameState._savedState;
          
          // Grundwerte wiederherstellen
          scorePoints = savedState.score;
          waveNumber = savedState.wave;
          
          // Spieler Position
          if (player && savedState.player) {
            player.x = savedState.player.x;
            player.y = savedState.player.y;
          }

          // Gegner wiederherstellen
          if (savedState.enemies) {
            enemies.children.forEach(enemy => enemy.kill());
            savedState.enemies.forEach(enemyData => {
              var enemy = enemies.getFirstDead();
              if (enemy) {
                enemy.reset(enemyData.x, enemyData.y);
                enemy.body.velocity.x = enemyData.velocity.x;
                enemy.body.velocity.y = enemyData.velocity.y;
              }
            });
          }

          // Boss wiederherstellen
          if (savedState.boss) {
            var boss = bossEnemys.getFirstDead();
            if (boss) {
              boss.reset(savedState.boss.x, savedState.boss.y);
              bossHealth = savedState.boss.health;
              bossDirection = savedState.boss.direction;
              if (bossHealthBar) gameState.updateBossHealthBar();
            }
          }

          // Player Bullets wiederherstellen
          if (savedState.playerBullets) {
            bullets.children.forEach(bullet => bullet.kill());
            savedState.playerBullets.forEach(bulletData => {
              var bullet = bullets.getFirstDead();
              if (bullet) {
                bullet.reset(bulletData.x, bulletData.y);
                bullet.body.velocity.x = bulletData.velocity.x;
                bullet.body.velocity.y = bulletData.velocity.y;
              }
            });
          }

          // Enemy Bullets wiederherstellen
          if (savedState.enemyBullets) {
            enemyBullets.children.forEach(bullet => bullet.kill());
            savedState.enemyBullets.forEach(bulletData => {
              var bullet = enemyBullets.getFirstDead();
              if (bullet) {
                bullet.reset(bulletData.x, bulletData.y);
                bullet.body.velocity.x = bulletData.velocity.x;
                bullet.body.velocity.y = bulletData.velocity.y;
              }
            });
          }

          // Pause-Status wiederherstellen
          if (savedState.isPaused) {
            gameState.pauseGame();
          }
        }
      }, 50);
    });

    // "Zurück zum Hauptmenü"-Button
    var backBtn = game.add.text(game.world.centerX, 400, "Zurück zum Hauptmenü", labelStyle);
    backBtn.anchor.set(0.5);
    backBtn.inputEnabled = true;
    backBtn.events.onInputUp.add(function () {
      game.state.start("GameMenu");
    });
  }
};
