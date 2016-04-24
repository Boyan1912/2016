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

    function monitorHitDamage(model, damage){
        console.log('hit model: ' + model.name);
        console.log('hit model id: ' + model.id);
        console.log('hit model health: ' + model.health);
        console.log('damage: ' + damage)
    }

    function monitorBlastsDetection(blasts, victims, tolerance){
        console.log('in blast collision detection');
        console.log('blasts count: ' + blasts.length);
        console.log('potential victims count: ' + victims.length);
    }

    return {
        executeCommand: executeCommand,
        executeModelCommand: executeModelCommand,
        monitorHitDamage: monitorHitDamage,
        monitorBlastsDetection: monitorBlastsDetection
    }
}());