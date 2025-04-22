var Game = function(game) {};

var stars;
var backgroundmove;
var player;
var cursors;

var bullets;
var bulletTime = 0;
var fireButton;

Game.prototype = {

  preload: function () {
    this.stage.disableVisibilityChange = false;
    this.optionCount = 1;
  },

  create: function () {

    stars = game.add.tileSprite(0, 0, 800, 600, 'game-stars');
    backgroundmove = 2;

    player = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'rocket');
    game.physics.enable(player,Phaser.Physics.ARCADE);

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



    //Wie ein exit button
    //this.addMenuOption('Next ->', function (e) {
      //this.game.state.start("GameOver");
    //});
  },

  update: function () {
    stars.tilePosition.y += backgroundmove;

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -200;
    }

    if (cursors.right.isDown) {
      player.body.velocity.x = 200;
    }

    if (fireButton.isDown) {
      fireBullet();
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
    bulletTime = game.time.now + 200;
  }
}
