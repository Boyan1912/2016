var validator = (function(){

    function validateFunction(func){
        if (typeof func !== 'function'){
            console.log(func + ' IS NOT A FUNCTION! It is ' + typeof func);
        }
    }

    function validateObject(obj){
        if (typeof obj !== 'object'){
            console.log(obj + ' IS NOT AN OBJECT! It is ' + typeof obj);
        }
    }

    function validateString(data){
        if (typeof data !== 'string'){
            console.log(data + ' IS NOT A STRING! It is ' + typeof data);
        }
    }

    //function validateSprite(sprite, command){
    //    validateObject(sprite);
    //    if (!sprite.isPrototypeOf(playField.display.sprite)){ // doesn't work like that
    //        console.log(sprite + ' IS NOT A SPRITE!');
    //    }else{
    //        if (command){
    //            validateString(command);
    //            if (!sprite.hasOwnProperty(command)){
    //                console.log(sprite.name + ' DOES NOT HAVE A PROPERTY NAMED ' + command)
    //            }else{
    //                validateFunction(sprite[command])
    //            }
    //        }
    //    }
    //}

    return {
        validateFunction: validateFunction,
        validateObject: validateObject,
        //validateSprite: validateSprite
    }

}());