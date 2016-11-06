function runDirectives(alexaRunner, directives, audioMap){
    var self = this;

    this.audioMap = audioMap;
    this.alexaRunner = alexaRunner;

    this.findAudioFromContentId = function(contentId) {
        contentId = contentId.replace('cid:', '');
        for (var key in self.audioMap) {
            if (key.indexOf(contentId) > -1) {
                return self.audioMap[key];
            }
        }
    };

    // commands
    this.SpeechSynthesizerSpeak = function(directive){
        const contentId = directive.payload.audioContent;
        const audio = self.findAudioFromContentId(contentId);
        if (audio) {
            self.alexaRunner.avs.audioToBlob(audio);
            return self.alexaRunner.avs.player.enqueue(audio);
        }
    };

    this.AudioPlayerPlay = function(directive){
        const streams = directive.payload.audioItem.streams;
        streams.forEach(stream => {
            const streamUrl = stream.streamUrl;

            const audio = self.findAudioFromContentId(streamUrl);

            if (audio) {
                self.alexaRunner.avs.audioToBlob(audio);
                return self.alexaRunner.avs.player.enqueue(audio);
            } else if (streamUrl.indexOf('http') > -1) {
                const xhr = new XMLHttpRequest();
                const url = `/parse-m3u?url=${streamUrl.replace(/!.*$/, '')}`;
                xhr.open('GET', url, true);
                xhr.responseType = 'json';
                xhr.onload = (event) => {
                    const urls = event.currentTarget.response;

                    urls.forEach(url => {
                        self.alexaRunner.avs.player.enqueue(url);
                    });
                };
                xhr.send();

                return function(){};
            }
        });
    };

    this.SpeechRecognizerListen = function(directive){
        const timeout = directive.payload.timeoutIntervalInMillis;
        // enable mic
        // beep

        return function(){
            if (directives.length > 1){
                self.alexaRunner.avs.player.one(AVS.Player.EventTypes.ENDED, () => {
                    self.alexaRunner.sendNotification('ALEXA_START_RECORDING');
                });
            }else{
                setTimeout(function(){
                    self.alexaRunner.sendNotification('ALEXA_START_RECORDING');
                }, 2000);
            }
        }();
    };

    var promises = [];

    // directive running
    directives.forEach(directive => {
        if (directive.namespace === 'SpeechSynthesizer' && directive.name === 'speak'){
            promises.push(self.SpeechSynthesizerSpeak(directive));
        } else if (directive.namespace === 'AudioPlayer' && directive.name === 'play') {
            promises.push(self.AudioPlayerPlay(directive));
        } else if (directive.namespace === 'SpeechRecognizer' && directive.name === 'listen') {
            promises.push(self.SpeechRecognizerListen(directive));
        }
    });

    // promise running
    if (promises.length) {
        Promise.all(promises).then(() => {
            self.alexaRunner.avs.player.playQueue();
        });
    }
}

module.exports = runDirectives;