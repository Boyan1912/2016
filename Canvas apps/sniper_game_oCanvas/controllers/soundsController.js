var soundsController = (function(sounds) {
    var self = this;
    self.activeSounds = [];

    function playSoundOnModelContact(model, hitter) {

        if (model.name === 'sniper' ) {
            switch (hitter.name) {
                case 'fire_demon':
                    if (!soundIsActive('male_scream2')){
                        lazyLoadPlay('male_scream2')
                    }
                    break;
                case 'jinn':
                    if (!soundIsActive('male_scream2')){
                        lazyLoadPlay('male_scream2')
                    }
                    break;
                case 'mummy':
                    if (!soundIsActive('electricshock')){
                        lazyLoadPlay('electricshock')
                    }
                    break;
                case 'explosion':
                    // if (soundIsActive('male_scream1')){
                    //     // console.log(soundIsActive('male_scream1'));
                    //     return;
                    // }
                    if (!soundIsActive('male_scream3')){
                        // console.log(!soundIsActive('male_scream3'));
                        lazyLoadPlay('male_scream3')
                    }
                    break;
                case 'fire':
                    if (soundIsActive('male_scream3')){
                        self.activeSounds['male_scream3'].stop();
                    }
                    if (!soundIsActive('male_scream1')){
                        lazyLoadPlay('male_scream1')
                    }
                    break;
                default:
                    break;
            }
        } else {

        }
        // console.log(self.activeSounds);
    }

    function lazyLoadPlay(name){
        self.activeSounds[name] ? self.activeSounds[name].play() : self.activeSounds[name] = sounds[name].play()
    }

    function soundIsActive(name) {
        // if (self.activeSounds[name]){console.log(self.activeSounds[name].pos())}
        return self.activeSounds[name] && self.activeSounds[name].pos() > 0;
    }

    function playSoundOnDeath(model){
        lazyLoadPlay('dying_scream');
    }

    function playSoundOnMegaDeath(){
        if(!soundIsActive('fuckYouMotherFucker')){
            lazyLoadPlay('fuckYouMotherFucker');
        }
    }

    return {
        playSoundOnModelContact: playSoundOnModelContact,
        playSoundOnDeath: playSoundOnDeath,
        playSoundOnMegaDeath: playSoundOnMegaDeath,
        lazyLoadPlay: lazyLoadPlay,
        soundIsActive: soundIsActive
    }

}(commonModels.sounds));
