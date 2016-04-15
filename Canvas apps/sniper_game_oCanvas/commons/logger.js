var logger = (function(){

    function executeCommand(command){
        validator.validateFunction(command);
        command();
        console.log(command.name + ' successfully executed!');
    }

    function executeSpriteCommand(sprite, command, p1, p2, p3){
        //validator.validateSprite(sprite, command);
        if (p1 || p2 || p3){
            sprite[command](p1, p2, p3);
        }else{
            sprite[command]();
        }
        console.log(sprite.name + ' succeeded in ' + command.toUpperCase());
    }

    return {
        executeCommand: executeCommand,
        executeSpriteCommand: executeSpriteCommand
    }
}());