const AVS = require('alexa-voice-service');
const initializeAVS = require('./initializeAVS');

function alexaRunner(config, sendNotification){
    var self  = this;

    this.config = config;
    this.sendNotification = sendNotification;

    this.avs = null;
    this.listening = false;

    this.initialize = function(){
        initializeAVS(self);

        sendNotification('ALEXA_CREATED');
    };
}

window.alexaRunner = alexaRunner;
module.exports = alexaRunner;