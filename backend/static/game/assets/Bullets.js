// PlayerBullet-Klasse
var PlayerBullet = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
};
PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
PlayerBullet.prototype.constructor = PlayerBullet;

PlayerBullet.createGroup = function(game) {
    var group = game.add.group();
    group.enableBody = true;
    group.physicsBodyType = Phaser.Physics.ARCADE;
    group.createMultiple(30, 'bullet');
    group.setAll('anchor.x', 0.5);
    group.setAll('anchor.y', 1);
    group.setAll('outOfBoundsKill', true);
    group.setAll('checkWorldBounds', true);
    return group;
};

// EnemyBullet-Klasse
var EnemyBullet = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'enemyBullet');
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
};
EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
EnemyBullet.prototype.constructor = EnemyBullet;

EnemyBullet.createGroup = function(game) {
    var group = game.add.group();
    group.enableBody = true;
    group.physicsBodyType = Phaser.Physics.ARCADE;
    group.createMultiple(30, 'enemyBullet');
    group.setAll('anchor.x', 0.5);
    group.setAll('anchor.y', 0.5);
    group.setAll('outOfBoundsKill', true);
    group.setAll('checkWorldBounds', true);
    return group;
};
