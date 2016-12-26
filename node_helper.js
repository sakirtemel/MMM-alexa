var NodeHelper = require('node_helper');
var enableSnowboyHotwordDetection = require('./src/enableSnowboyHotwordDetection');
const request = require('request');

var pin = 4;

module.exports = NodeHelper.create({
    start: function() {
        this.config = null;
        this.lastPressedTime = null;
        this.expressApp.get('/parse-m3u', function (req, res) {
            const m3uUrl = req.query.url;

            if (!m3uUrl) {
                return res.json([]);
            }

            const urls = [];

            request(m3uUrl, function(error, response, bodyResponse) {
                if (bodyResponse) {
                    urls.push(bodyResponse);
                }

                res.json(urls);
            });
        });
    },
    socketNotificationReceived: function(notification, payload) {
        if(notification === 'SET_CONFIG'){
            this.config = payload;
            var self = this;

            // TODO: make here configurable
            if(1){
                enableSnowboyHotwordDetection(function(){
                    self.sendSocketNotification('ALEXA_START_RECORDING', {});
                });
            }

            if(this.config['enableRaspberryButton']){
                var Gpio = require('onoff').Gpio,
                button = new Gpio(pin, 'in', 'both');

                process.on('SIGINT', function () {
                    button.unexport();
                    process.exit();
                });

                button.watch(function (err, value) {
                    if (err) { throw err; }

                    if(value === 1){
                        if(self.lastPressedTime === null || (self.lastPressedTime !== null && (new Date() - self.lastPressedTime) > 2000)){
                            self.lastPressedTime = new Date();
                            self.sendSocketNotification('ALEXA_START_RECORDING', {});
                        }
                    }
                });
            }
        }
    },
});