var Game = function(game) {};

let scoreText;
let scorePoints = 0;

let waveText;
let waveNumber = 0;

// Neue Variablen für Boss-Lebensleiste
let bossHealth = 0;
let bossHealthBar;
let bossHealthBarBorder;

// Neue Variablen für die Boss-Bewegung
let bossDirection = 1; // 1 = nach rechts, -1 = nach links
let bossSpeed = 100; // Geschwindigkeit des Bosses

let isPaused = false;
let pauseGroup = null;

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
    scoreText = game.add.text(20, 20, "Score: " + scorePoints, optionStyle);
  },

  addWaveCounter: function() {
    var optionStyle = { font: '15pt PressStart2', fill: 'white', align: 'right', stroke: 'rgba(0,0,0,0)', strokeThickness: 4 };
    waveText = game.add.text(650, 20, "Wave: " + waveNumber, optionStyle);
  },

  preload: function () {
    this.stage.disableVisibilityChange = false;
    this.optionCount = 1;
  },

  create: function () {
    try {
      musicPlayer.stop();
    } catch (error) {}
    musicPlayer = game.add.audio('gameNormal');
    musicPlayer.loop = true;
    musicPlayer.volume = typeof gameVolume !== "undefined" ? gameVolume : 0.5;
    musicPlayer.play();

    stars = game.add.tileSprite(0, 0, 800, 600, 'game-stars');
    backgroundmove = 2;

    scorePoints = 0;
    waveNumber = 1;
    if (isPaused) {
      this.resumeGame();
    }

    this.addScorePoints();
    this.addWaveCounter();

    player = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'rocket');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();

    bullets = PlayerBullet.createGroup(game);
    enemyBullets = EnemyBullet.createGroup(game);

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    enemies.createMultiple(60, 'enemy');

    bossEnemys = game.add.group();
    bossEnemys.enableBody = true;
    bossEnemys.physicsBodyType = Phaser.Physics.ARCADE;
    bossEnemys.createMultiple(1, 'boss');

    // Debug-Ausgabe, um sicherzustellen, dass enemyPatterns verfügbar ist
    if (typeof enemyPatterns === 'undefined') {
      console.error("enemyPatterns is not defined. Make sure enemies.js is loaded.");
    } else {
      console.log("enemyPatterns loaded successfully:", enemyPatterns);
    }

    // ESC für Pause
    game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.togglePause, this);

    // Starte die Gegnerdarstellung nach 3 Sekunden
    // game.time.events.add(Phaser.Timer.SECOND * 3, this.spawnEnemies, this);

    //Wie ein exit button
    //this.addMenuOption('Next ->', function (e) {
      //this.game.state.start("GameOver");
    //});
  },

  update: function () {
    if (isPaused) return; // Keine Updates im Pausenmodus

    stars.tilePosition.y += backgroundmove;

    updateScore(1);

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
      this.fireBullet();
    }

    // Kollisionserkennung zwischen Bullets und Gegnern
    game.physics.arcade.overlap(bullets, enemies, this.bulletHitsEnemy, null, this);

    // Kollisionserkennung zwischen Bullets und dem Boss
    game.physics.arcade.overlap(bullets, bossEnemys, this.bulletHitsEnemy, null, this);

    // Kollisionserkennung zwischen enemyBullets und der Rakete
    game.physics.arcade.overlap(enemyBullets, player, this.playerHit, null, this);

    // Boss-Bewegung
    this.moveBoss();

    // Boss-Schießen
    if (Math.random() < (0.01 + waveNumber/100)) { // 2% Chance pro Frame, dass der Boss schießt
      this.bossFire();
    }

    // Überprüfen, ob keine Gegner mehr vorhanden sind
    if (enemies.countLiving() === 0 && bossEnemys.countLiving() === 0 && !this.spawnTimer) {
      this.spawnTimer = game.time.events.add(Phaser.Timer.SECOND * 1, () => {
        updateWave();
        updateScore(10000);
        if (waveNumber % 1 === 0) {
          this.spawnBoss(); // Boss spawnen
        } else {
          this.spawnEnemies();
        }

        
        this.spawnTimer = null; // Timer zurücksetzen
      });
    }

    // Zufällige Gegner schießen lassen
    this.enemyFire();

    // Überprüfen, ob ein Gegner die Tiefe von 150 Pixel vom unteren Rand erreicht hat
    this.checkEnemyDepth();
  },

  togglePause: function () {
    if (isPaused) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
  },

  pauseGame: function () {
    if (isPaused) return;
    isPaused = true;

    // Gruppe für Pause-UI
    pauseGroup = game.add.group();

    // Halbtransparentes Overlay
    let overlay = game.add.graphics(0, 0, pauseGroup);
    overlay.beginFill(0x000000, 0.7);
    overlay.drawRect(0, 0, game.world.width, game.world.height);
    overlay.endFill();

    // "Pause"-Text
    let pauseText = game.add.text(game.world.centerX, 200, "Pause", {
      font: 'bold 60pt PressStart2',
      fill: '#FDFFB5',
      align: 'center'
    }, pauseGroup);
    pauseText.anchor.set(0.5);

    // Weiter-Button
    let resumeBtn = game.add.text(game.world.centerX, 350, "Weiter", {
      font: '30pt PressStart2',
      fill: 'white',
      align: 'center'
    }, pauseGroup);
    resumeBtn.anchor.set(0.5);
    resumeBtn.inputEnabled = true;
    resumeBtn.events.onInputUp.add(this.resumeGame, this);

    // Einstellungen-Button
    let settingsBtn = game.add.text(game.world.centerX, 450, "Einstellungen", {
      font: '30pt PressStart2',
      fill: 'white',
      align: 'center'
    }, pauseGroup);
    settingsBtn.anchor.set(0.5);
    settingsBtn.inputEnabled = true;
    settingsBtn.events.onInputUp.add(function () {
      // Speichere den kompletten Spielzustand
      game.state.states.Game._savedState = {
        score: scorePoints,
        wave: waveNumber,
        isPaused: isPaused,
        player: {
          x: player.x,
          y: player.y
        },
        enemies: enemies.children
          .filter(enemy => enemy.alive)
          .map(enemy => ({
            x: enemy.x,
            y: enemy.y,
            velocity: enemy.body.velocity
          })),
        boss: bossEnemys.getFirstAlive() ? {
          x: bossEnemys.getFirstAlive().x,
          y: bossEnemys.getFirstAlive().y,
          health: bossHealth,
          direction: bossDirection
        } : null,
        // Speichere aktive Player Bullets
        playerBullets: bullets.children
          .filter(bullet => bullet.alive)
          .map(bullet => ({
            x: bullet.x,
            y: bullet.y,
            velocity: bullet.body.velocity
          })),
        // Speichere aktive Enemy Bullets
        enemyBullets: enemyBullets.children
          .filter(bullet => bullet.alive)
          .map(bullet => ({
            x: bullet.x,
            y: bullet.y,
            velocity: bullet.body.velocity
          }))
      };
      game.state.start("Settings", false, false);
    });

    game.physics.arcade.isPaused = true;
  },

  resumeGame: function () {
    if (!isPaused) return;
    isPaused = false;
    if (pauseGroup) {
      pauseGroup.destroy();
      pauseGroup = null;
    }
    game.physics.arcade.isPaused = false;
  },

  bulletHitsEnemy: function (bullet, enemy) {
    bullet.kill(); // Bullet entfernen

    if (enemy.key === 'boss') {
      // Wenn der Boss getroffen wird
      bossHealth -= 10; // Reduziere die Lebenspunkte
      this.updateBossHealthBar(); // Aktualisiere die Lebensleiste

      if (bossHealth <= 0) {
        enemy.kill(); // Entferne den Boss, wenn die Lebenspunkte 0 erreichen
        bossHealthBar.clear(); // Entferne die Lebensleiste
      }
    } else {
      // Normale Gegner
      enemy.kill();
    }
  },

  spawnBoss: function () {
    const bossEnemy = bossEnemys.getFirstExists(false);
    if (bossEnemy) {
      bossEnemy.reset(game.world.centerX - 25, 75); // Boss erscheint oben in der Mitte
      bossHealth = 100; // Setze die Lebenspunkte des Bosses

      // Erstelle die Lebensleiste
      if (!bossHealthBar) {
        bossHealthBar = game.add.graphics();
      }
      this.updateBossHealthBar();
    }
  },

  updateBossHealthBar: function () {
    if (bossHealthBar) {
      bossHealthBar.clear();
      bossHealthBar.beginFill(0xffffff); // Rote Farbe für die Lebensleiste
      const barWidth = 200; // Breite der Lebensleiste
      const barHeight = 20; // Höhe der Lebensleiste
      const x = game.world.centerX - barWidth / 2; // Zentriert
      const y = 20; 
      bossHealthBar.drawRect(x, y, (bossHealth / 100) * barWidth, barHeight);
      bossHealthBar.endFill();
    }
    updateScore(200);
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
            enemy.body.velocity.y = 15;
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
      if (Math.random() < (0.000001 + waveNumber/100000)) { // 1% Chance pro Frame
        this.fireEnemyBullet(enemy);
      }
    });
  },

  fireBullet: function () {
    if (game.time.now > bulletTime) {
      const bullet = bullets.getFirstExists(false);
      if (bullet) {
        bullet.reset(player.x + 25, player.y);
        bullet.body.velocity.y = -400;
        bulletTime = game.time.now + 20;
      }
    }
  },

  fireEnemyBullet: function (enemy) {
    const enemyBullet = enemyBullets.getFirstExists(false);
    if (enemyBullet) {
      enemyBullet.reset(enemy.x + enemy.width / 2, enemy.y + enemy.height);
      enemyBullet.body.velocity.y = 200;
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
  },

  moveBoss: function () {
    const bossEnemy = bossEnemys.getFirstExists(true); // Hole den existierenden Boss
    if (bossEnemy) {
      bossEnemy.x += bossDirection * bossSpeed * game.time.physicsElapsed; // Bewege den Boss

      // Überprüfe, ob der Boss den linken oder rechten Rand erreicht hat
      if (bossEnemy.x <= 0 || bossEnemy.x + bossEnemy.width >= game.world.width) {
        bossDirection *= -1; // Richtung umkehren
      }
    }
  },

  bossFire: function () {
    const bossEnemy = bossEnemys.getFirstExists(true); // Hole den existierenden Boss
    if (!bossEnemy) return;

    const randomShotType = Math.floor(Math.random() * 3); // Zufälliger Schusstyp (0, 1 oder 2)

    switch (randomShotType) {
      case 0: // Gerade Schüsse
        this.fireStraight(bossEnemy);
        break;
      case 1: // Zielgerichtete Schüsse
        this.fireTargeted(bossEnemy);
        break;
      case 2: // Diagonale Schüsse
        this.fireDiagonal(bossEnemy);
        break;
    }
  },

  fireStraight: function (bossEnemy) {
    const bullet = enemyBullets.getFirstExists(false);
    if (bullet) {
      bullet.reset(bossEnemy.x + bossEnemy.width / 2, bossEnemy.y + bossEnemy.height);
      bullet.body.velocity.y = 200; // Bewegt sich gerade nach unten
    }
  },

  fireTargeted: function (bossEnemy) {
    const bullet = enemyBullets.getFirstExists(false);
    if (bullet) {
      bullet.reset(bossEnemy.x + bossEnemy.width / 2, bossEnemy.y + bossEnemy.height);

      // Berechne die Richtung zum Spieler
      const dx = player.x - bullet.x;
      const dy = player.y - bullet.y;
      const magnitude = Math.sqrt(dx * dx + dy * dy);

      // Normalisiere die Richtung und setze die Geschwindigkeit
      bullet.body.velocity.x = (dx / magnitude) * 200;
      bullet.body.velocity.y = (dy / magnitude) * 200;
    }
  },

  fireDiagonal: function (bossEnemy) {
    const bulletLeft = enemyBullets.getFirstExists(false);
    const bulletRight = enemyBullets.getFirstExists(false);

    if (bulletLeft) {
      bulletLeft.reset(bossEnemy.x + bossEnemy.width / 2, bossEnemy.y + bossEnemy.height);
      bulletLeft.body.velocity.x = -150; // Diagonal nach links
      bulletLeft.body.velocity.y = 200;
    }

    if (bulletRight) {
      bulletRight.reset(bossEnemy.x + bossEnemy.width / 2, bossEnemy.y + bossEnemy.height);
      bulletRight.body.velocity.x = 150; // Diagonal nach rechts
      bulletRight.body.velocity.y = 200;
    }
  }
};

function updateScore(toAddPoints) {
  scorePoints += toAddPoints;
  scoreText.setText("Score: " + scorePoints);
}

function updateWave() {
  waveNumber++;
  waveText.setText("Wave: " + waveNumber);
}