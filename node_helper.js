var NodeHelper = require("node_helper");

var pin = 18;

module.exports = NodeHelper.create({
    start: function() {
        this.config = null;
    },
    socketNotificationReceived: function(notification, payload) {
        if(notification === 'SET_CONFIG'){
            this.config = payload;

            if(this.config['enableRaspberryButton']){
                var gpio = require("pi-gpio");

                while(true){
                    gpio.open(pin, "input", function(err) {
                        gpio.read(pin, function(err, value) {
                            console.log(value);
                            if(value === 1){
                                this.sendSocketNotification('ALEXA_START_RECORDING', {});
                                // TODO: sleep for few ms not to send multiple start commands
                            }
                        });
                    });
                }
            }
        }
    },
});