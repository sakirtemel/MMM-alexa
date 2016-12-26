const AVS = require('alexa-voice-service');
const initializeAVS = require('./initializeAVS');
const setStatus = require('./setStatus');
const VoiceActivityDetector = require('./VoiceActivityDetector');
const Controller = require('./Controller');

function alexaRunner(config, sendNotification){
    var self  = this;

    this.config = config;
    this.sendNotification = sendNotification;

    this.avs = null;
    this.voiceActivityDetector = null;
    this.controller = new Controller(self);

    this.notificationReceived = function(notification){
        setStatus(self, notification); // TODO: this status will be gathered from the controller

        if(notification === 'ALEXA_START_RECORDING'){
            self.controller.fsm.listen();
        }else if(notification === 'ALEXA_STOP_RECORDING'){
            self.controller.fsm.stop();
        }else if(notification === 'ALEXA_AUDIO_PLAY_ENDED'){
            console.log('-- AUDIO ENDED');
            self.controller.fsm.finish();
        }
    //    ALEXA_RECORD_START
    //    ALEXA_RECORD_STOP
    //    ALEXA_AUDIO_PLAY_STARTED
    //    ALEXA_AUDIO_PLAY_ENDED
    };

    this.initialize = function(){
        initializeAVS(self).then(() => {
            if(!self.config['disableVoiceActivityDetection']){
                //TODO: probably these notifications also will be moved to controller, because we'll reduce the responsibility at VAD module, and move it to controller(timeout stuff)
                self.voiceActivityDetector = new VoiceActivityDetector(function(){
                    self.sendNotification('ALEXA_VAD_VOICE_DETECTION_START');
                }, function(){
                    self.sendNotification('ALEXA_VAD_VOICE_DETECTION_STOP');
                    self.sendNotification('ALEXA_STOP_RECORDING');
                });
                self.voiceActivityDetector.initialize();
            }

            self.controller.fsm.init();

            self.sendNotification('ALEXA_CREATED');
        });
    };
}

window.alexaRunner = alexaRunner;
module.exports = alexaRunner;