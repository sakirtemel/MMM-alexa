const AVS = require('alexa-voice-service');
const initializeAVS = require('./initializeAVS');
const setStatus = require('./setStatus');
const processSpeech = require('./processSpeech');
const runDirectives = require('./runDirectives');

function alexaRunner(config, sendNotification){
    var self  = this;

    this.config = config;
    this.sendNotification = sendNotification;

    this.avs = null;
    this.listening = false;

    this.notificationReceived = function(notification){
        setStatus(self, notification);

        if(notification === 'ALEXA_START_RECORDING'){
            if(!self.listening){
                self.listening = true;
                self.avs.startRecording();
            }
        }else if(notification === 'ALEXA_STOP_RECORDING'){
            if(self.listening){
                self.listening = false;
                processSpeech(self).then(({directives, audioMap}) => {
                    runDirectives(self, directives, audioMap);
                });
            }

        }
    };

    this.initialize = function(){
        initializeAVS(self);

        sendNotification('ALEXA_CREATED');
    };
}

window.alexaRunner = alexaRunner;
module.exports = alexaRunner;