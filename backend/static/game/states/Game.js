var Game = function(game) {};

let scoreText;
let scorePoints = 0;

var stars;
var backgroundmove;
var player;
var cursors;

var bullets;
var bulletTime = 0;
var fireButton;

Game.prototype = {

  addScorePoints: function() {
    var optionStyle = { font: '15pt PressStart2', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    scoreText = game.add.text(400, 10, "Score: 0", optionStyle);
    scoreText.anchor.setTo(0.5);
    scoreText.stroke = "rgba(0,0,0,0)";
    scoreText.strokeThickness = 4;
  },

  preload: function () {
    this.stage.disableVisibilityChange = false;
    this.optionCount = 1;
  },

  create: function () {

    stars = game.add.tileSprite(0, 0, 800, 600, 'game-stars');
    backgroundmove = 2;

    player = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'rocket');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    this.addScorePoints();

    cursors = game.input.keyboard.createCursorKeys();

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    enemies.createMultiple(60, 'enemy');

    // Debug-Ausgabe, um sicherzustellen, dass enemyPatterns verfügbar ist
    if (typeof enemyPatterns === 'undefined') {
      console.error("enemyPatterns is not defined. Make sure enemies.js is loaded.");
    } else {
      console.log("enemyPatterns loaded successfully:", enemyPatterns);
    }

    // Starte die Gegnerdarstellung nach 3 Sekunden
    // game.time.events.add(Phaser.Timer.SECOND * 3, this.spawnEnemies, this);

    //Wie ein exit button
    //this.addMenuOption('Next ->', function (e) {
      //this.game.state.start("GameOver");
    //});
  },

  update: function () {
    stars.tilePosition.y += backgroundmove;

    scorePoints = scorePoints + 1;
    updateScore(scorePoints);

    player.body.velocity.x = 0;

    if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      player.body.velocity.x = -200;
    }

    if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      player.body.velocity.x = 200;
    }

    if (fireButton.isDown) {
      fireBullet();
    }

    // Kollisionserkennung zwischen Bullets und Gegnern
    game.physics.arcade.overlap(bullets, enemies, this.bulletHitsEnemy, null, this);

    // Überprüfen, ob keine Gegner mehr vorhanden sind
    if (enemies.countLiving() === 0 && !this.spawnTimer) {
      this.spawnTimer = game.time.events.add(Phaser.Timer.SECOND * 1, () => {
        this.spawnEnemies();
        this.spawnTimer = null; // Timer zurücksetzen
      });
    }
  },

  bulletHitsEnemy: function (bullet, enemy) {
    // Bullet und Gegner ausblenden
    bullet.kill();
    enemy.kill();
  },

  spawnEnemies: function () {
    if (!enemyPatterns || enemyPatterns.length === 0) {
      console.error("No enemy patterns available.");
      return;
    }

    var testPattern = [
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    ];
    var randomNumberForPatternChoice = Math.floor(Math.random() * enemyPatterns.length);
    var currentPattern = enemyPatterns[randomNumberForPatternChoice];
    // var currentPattern = testPattern;

    const enemyWidth = 50;
    const enemyHeight = 50;
    const startY = 40;
    const screenWidth = 800;
    const marginX = 45;

    for (let row = 0; row < currentPattern.length; row++) {
      const rowPattern = currentPattern[row];
      const slotsInRow = rowPattern.length;

      // Berechne die Gesamtbreite aller Slots (inkl. spacing)
      const totalEnemyWidth = slotsInRow * enemyWidth;
      const totalSpacing = screenWidth - 2 * marginX - totalEnemyWidth;
      const spacing = slotsInRow > 1 ? totalSpacing / (slotsInRow - 1) : 0;

      let currentX = marginX;

      for (let col = 0; col < slotsInRow; col++) {
        if (rowPattern[col] === 1) {
          const enemy = enemies.getFirstExists(false);
          if (enemy) {
            enemy.reset(currentX, startY + row * (enemyHeight + 10));
            enemy.body.velocity.y = 5;
          }
        }
        // X-Position wird immer aktualisiert – egal ob 0 oder 1
        currentX += enemyWidth + spacing;
      }
    }
  }
};

function fireBullet() {
  if (game.time.now > bulletTime) {
    bullet = bullets.getFirstExists(false);
  }
  if (bullet) {
    bullet.reset(player.x + 25, player.y);
    bullet.body.velocity.y = -400;
    bulletTime = game.time.now + 20;
  }
}

function updateScore(scorePoints) {
  scoreText.setText("Score: " + scorePoints);
}