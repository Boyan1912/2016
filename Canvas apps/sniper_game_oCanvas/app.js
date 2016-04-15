gameController.start();

var playField = gameController.initPlayField();
var sniper = primaryModels.createSniper(playField);
var rocket = primaryModels.createRocket(playField, sniper);
var explosion = primaryModels.createExplosion(playField);

eventsController.init(playField);