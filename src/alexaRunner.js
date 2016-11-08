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
                    setTimeout(function(){
                        self.voiceActivityDetector.startDetection();
                    }, 1000);
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
        initializeAVS(self).then(() => {
            if(!self.config['disableVoiceActivityDetection']){
                self.voiceActivityDetector = new VoiceActivityDetector(function(){
                    self.sendNotification('ALEXA_VAD_VOICE_DETECTION_START');
                }, function(){
                    self.sendNotification('ALEXA_VAD_VOICE_DETECTION_STOP');
                    self.sendNotification('ALEXA_STOP_RECORDING');
                });
                self.voiceActivityDetector.initialize();
            }

            self.sendNotification('ALEXA_CREATED');
        });
    };
}

window.alexaRunner = alexaRunner;
module.exports = alexaRunner;