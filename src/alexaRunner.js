const AVS = require('alexa-voice-service');
const initializeAVS = require('./initializeAVS');
const setStatus = require('./setStatus');
const processSpeech = require('./processSpeech');
const runDirectives = require('./runDirectives');
const VoiceActivityDetector = require('./VoiceActivityDetector');

function alexaRunner(config, sendNotification){
    var self  = this;

    this.config = config;
    this.sendNotification = sendNotification;

    this.avs = null;
    this.listening = false;
    this.voiceActivityDetector = null;

    this.notificationReceived = function(notification){
        setStatus(self, notification);

        if(notification === 'ALEXA_START_RECORDING'){
            if(!self.listening){
                self.listening = true;
                self.avs.startRecording();

                if(self.voiceActivityDetector){
                    self.voiceActivityDetector.startDetection();
                }
            }
        }else if(notification === 'ALEXA_STOP_RECORDING'){
            if(self.listening){
                self.listening = false;

                if(self.voiceActivityDetector){
                    self.voiceActivityDetector.stopDetection();
                }

                processSpeech(self).then(({directives, audioMap}) => {
                    runDirectives(self, directives, audioMap);
                });
            }

        }
    };

    this.initialize = function(){
        initializeAVS(self);

        if(!self.config['disableVoiceActivityDetection']){
            this.voiceActivityDetector = new VoiceActivityDetector(function(){
                self.sendNotification('ALEXA_VAD_VOICE_DETECTION_START');
            }, function(){
                self.sendNotification('ALEXA_VAD_VOICE_DETECTION_STOP');
                self.sendNotification('ALEXA_STOP_RECORDING');
            });
            this.voiceActivityDetector.initialize();
        }

        sendNotification('ALEXA_CREATED');
    };
}

window.alexaRunner = alexaRunner;
module.exports = alexaRunner;