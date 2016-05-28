var soundsController = (function(sounds){

    function playSoundOnModelContact(model, hitter){
        if (model.name === 'sniper'){
          switch (hitter.name) {
            case 'fire_demon':
              sounds.male_scream2.play();
              break;
            case 'mummy':
              sounds.electricshock.play();
              break;
            case 'explosion':
              sounds.male_scream3.play();
              break;
            case 'fire':
              sounds.male_scream1.play();
              break;
            default:

          }
        }else {

        }
    }

    function playSoundOnDeath(model){
        sounds.dying_scream.play();
    }

    return {
      playSoundOnModelContact: playSoundOnModelContact,
      playSoundOnDeath: playSoundOnDeath
    }

}(commonModels.sounds));
