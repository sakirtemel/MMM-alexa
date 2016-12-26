var record = require('node-record-lpcm16');
var { Detector, Models } = require('snowboy');
var path = require('path');

function enableSnowboyHotwordDetection(hotwordCallback){
    var self = this;

    this.hotwordCallback = hotwordCallback;

    this.pipeMic = function(){
        self._initDetector();
        self.mic = record.start({
            threshold: 0,
        });

        self.mic.pipe(self.detector);
    };

    this._initDetector = function(){
        self.models = new Models();

        self.models.add({
            file: path.join(__dirname, '../resources/alexa.umdl'),
            sensitivity: '0.5',
            hotwords : 'alexa'
        });

        self.detector = new Detector({
            resource: path.join(__dirname, '../resources/common.res'),
            models: self.models,
            audioGain: 2.0
        });

        self.detector.on('hotword', function (index, hotword) {
            self.hotwordCallback();
        });

        self.detector.on('error', function () {
            console.log('error with snowboy detector');
        });
    };

    self._initDetector();
    self.pipeMic();
}

module.exports = enableSnowboyHotwordDetection;