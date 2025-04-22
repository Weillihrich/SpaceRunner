var Highscores = function() {};

Highscores.prototype = {

    preload: function () {
        this.optionCount = 1;
    },

    addMenuOption: function(text, callback) {
        var optionStyle = { font: '20pt PressStart2', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', strokeThickness: 4 };
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
        game.add.sprite(0, 0, 'stars');
        var titleStyle = { font: 'bold 50pt PressStart2', fill: '#FDFFB5', align: 'center'};
        var text = game.add.text(game.world.centerX, 100, "Highscores", titleStyle);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        text.anchor.set(0.5);

        this.addMenuOption('Back', function () {
            game.state.start("GameMenu");
        });

        showHighscores().then();
    }
};

const showHighscores = async () => {
    const response = await fetch("/api/highscores/");
    const highscoreJson = await response.json();

    let y = 180;
    highscoreJson.forEach((entry, index) => {
        var highscoreStyle = { font: '20pt PressStart2', fill: 'white', align: 'right', stroke: 'rgba(0,0,0,0)', strokeThickness: 4 }
        scores = game.add.text(game.world.centerX , y, `${index + 1}. ${entry.player}: ${entry.score}`, highscoreStyle);
        scores.anchor.setTo(0.5);
        scores.stroke = "rgba(0,0,0,0)";
        scores.strokeThickness = 4;

        y += 35;
    });
}