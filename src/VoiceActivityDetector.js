const vad = require('voice-activity-detection');

function VoiceActivityDetector(onStart, onStop){
    var self = this;

    this.onStart = onStart;
    this.onStop = onStop;
    this.audioContext = null;
    this.listening = false;
    this.firstWordSpoken = false; // TODO: this also can be moved

    this.initialize = function(){
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            self.audioContext = new AudioContext();

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            navigator.getUserMedia({audio: true},
                self._startUserMedia,
                function(){
                    console.warn('Could not connect microphone. Possible rejected by the user or is blocked by the browser.');
                });
        } catch (e) {
            console.warn('Mic input is not supported by the browser.');
        }
    };

    this.startDetection = function(){
        self.listening = true;
        self.firstWordSpoken = false;
    };

    this.stopDetection = function(){
        self.listening = false;
    };

    this._startUserMedia = function(stream){
        var options = {
            onVoiceStart: function () {
                if(self.listening){
                    if(!self.firstWordSpoken){
                        self.firstWordSpoken = true;
                    }

                    self.onStart();
                }
            },
            onVoiceStop: self._onVoiceStop,
            onUpdate: function (val) {
                //console.log('curr val:', val);
            }
        };
        vad(self.audioContext, stream, options);
    };

    this._onVoiceStop = function(){
        if(self.listening){
            self.listening = false;
            self.onStop();
        }
    };
}

module.exports = VoiceActivityDetector;