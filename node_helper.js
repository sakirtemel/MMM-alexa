var NodeHelper = require("node_helper");

var pin = 4;

module.exports = NodeHelper.create({
    start: function() {
        this.config = null;
        this.lastPressedTime = null;
    },
    socketNotificationReceived: function(notification, payload) {
        if(notification === 'SET_CONFIG'){
            this.config = payload;

            if(this.config['enableRaspberryButton']){
                var Gpio = require('onoff').Gpio,
                button = new Gpio(pin, 'in', 'both');

                process.on('SIGINT', function () {
                    button.unexport();
                    process.exit();
                });

                var self = this;

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