gameController.start();

eventsController.init(playerModels);

actionEventsService.getPossibleActions(actionController);

gameEngine.addMummiesToGame(5);

gameEngine.detectPlayerCollision();