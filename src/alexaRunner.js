const AVS = require('alexa-voice-service');
const initializeAVS = require('./initializeAVS');
const setStatus = require('./setStatus');

function alexaRunner(config, sendNotification){
    var self  = this;

    this.config = config;
    this.sendNotification = sendNotification;

    this.avs = null;
    this.listening = false;

    this.notificationReceived = function(notification){
        setStatus(self, notification);
    };

    this.initialize = function(){
        initializeAVS(self);

        sendNotification('ALEXA_CREATED');
    };
}

window.alexaRunner = alexaRunner;
module.exports = alexaRunner;