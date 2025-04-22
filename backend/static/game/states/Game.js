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

var enemyBullets;

var enemies;

Game.prototype = {

  addScorePoints: function() {
    var optionStyle = { font: '15pt PressStart2', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4 };
    scoreText = game.add.text(20, 20, "Score: 0", optionStyle);
  },

  preload: function () {
    this.stage.disableVisibilityChange = false;
    this.optionCount = 1;
  },

  create: function () {
    stars = game.add.tileSprite(0, 0, 800, 600, 'game-stars');
    backgroundmove = 2;

    this.addScorePoints();

    player = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'rocket');
    game.physics.enable(player, Phaser.Physics.ARCADE);

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

    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

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

    // Begrenze die Bewegung der Rakete innerhalb der Grenzen
    const leftBoundary = 45;
    const rightBoundary = game.world.width - 45 - player.width;

    if (player.x < leftBoundary) {
      player.x = leftBoundary;
    }

    if (player.x > rightBoundary) {
      player.x = rightBoundary;
    }

    if (fireButton.isDown) {
      fireBullet();
    }

    // Kollisionserkennung zwischen Bullets und Gegnern
    game.physics.arcade.overlap(bullets, enemies, this.bulletHitsEnemy, null, this);

    // Kollisionserkennung zwischen enemyBullets und der Rakete
    game.physics.arcade.overlap(enemyBullets, player, this.playerHit, null, this);

    // Überprüfen, ob keine Gegner mehr vorhanden sind
    if (enemies.countLiving() === 0 && !this.spawnTimer) {
      this.spawnTimer = game.time.events.add(Phaser.Timer.SECOND * 1, () => {
        this.spawnEnemies();
        this.spawnTimer = null; // Timer zurücksetzen
      });
    }

    // Zufällige Gegner schießen lassen
    this.enemyFire();

    // Überprüfen, ob ein Gegner die Tiefe von 150 Pixel vom unteren Rand erreicht hat
    this.checkEnemyDepth();
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

    var randomNumberForPatternChoice = Math.floor(Math.random() * enemyPatterns.length);
    var currentPattern = enemyPatterns[randomNumberForPatternChoice];

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
            enemy.body.velocity.y = 20;
          }
        }
        // X-Position wird immer aktualisiert – egal ob 0 oder 1
        currentX += enemyWidth + spacing;
      }
    }
  },

  enemyFire: function () {
    // Finde die unterste Reihe der Gegner
    const livingEnemies = enemies.children.filter(enemy => enemy.alive);
    const bottomEnemies = {};

    livingEnemies.forEach(enemy => {
      const x = enemy.x.toFixed(0); // Gruppiere Gegner nach ihrer X-Position
      if (!bottomEnemies[x] || bottomEnemies[x].y < enemy.y) {
        bottomEnemies[x] = enemy; // Speichere den untersten Gegner an dieser X-Position
      }
    });

    // Zufällige Chance, dass ein Gegner schießt
    Object.values(bottomEnemies).forEach(enemy => {
      if (Math.random() < 0.001) { // 1% Chance pro Frame
        this.fireEnemyBullet(enemy);
      }
    });
  },

  fireEnemyBullet: function (enemy) {
    const enemyBullet = enemyBullets.getFirstExists(false);
    if (enemyBullet) {
      enemyBullet.reset(enemy.x + enemy.width / 2, enemy.y + enemy.height);
      enemyBullet.body.velocity.y = 200; // Gegner-Bullet nach unten bewegen
    }
  },

  checkEnemyDepth: function () {
    const depthLimit = game.world.height - 100; // 150 Pixel vom unteren Rand
    const livingEnemies = enemies.children.filter(enemy => enemy.alive);

    for (let enemy of livingEnemies) {
      if (enemy.y + enemy.height >= depthLimit) {
        this.endGame(); // Spiel beenden, wenn ein Gegner die Tiefe erreicht
        break;
      }
    }
  },

  playerHit: function (player, enemyBullet) {
    // Gegner-Bullet ausblenden
    enemyBullet.kill();

    // Spiel beenden
    this.endGame();
  },

  endGame: function () {
    // Zeige eine Nachricht und starte das Spiel neu
    const gameOverText = game.add.text(game.world.centerX, game.world.centerY, 'Game Over', {
      font: '30px PressStart2P',
      fill: '#fff',
      align: 'center',
    });
    gameOverText.anchor.setTo(0.5);

    // Stoppe alle Bewegungen und Eingaben
    player.kill();
    game.time.events.add(Phaser.Timer.SECOND * 3, () => {
      game.state.start("GameOver"); // Neustart des Spiels
    });
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