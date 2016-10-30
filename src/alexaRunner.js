const AVS = require('alexa-voice-service');

function alexaRunner(config){
    var self  = this;

    this.config = config;
}

window.alexaRunner = alexaRunner;
module.exports = alexaRunner;