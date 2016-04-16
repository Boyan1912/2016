var logger = (function(){

    function executeCommand(command, p1, p2, p3, p4, p5, p6){
        validator.validateFunction(command);
        command(p1, p2, p3, p4, p5, p6);
        console.log(command.name + ' successfully executed!');
    }

    function executeModelCommand(model, command, p1, p2, p3){
        //validator.validateSprite(sprite, command);
        if (p1 || p2 || p3){
            model[command](p1, p2, p3);
        }else{
            model[command]();
        }
        console.log(model.name + ' succeeded in ' + command);
    }

    return {
        executeCommand: executeCommand,
        executeModelCommand: executeModelCommand
    }
}());