function setStatus(alexaRunner, notification){
    if (alexaRunner.config['hideStatusIndicator']){
        return true;
    }

    var statusIndicator = document.getElementById('alexa');

    switch(notification){
        case 'ALEXA_TOKEN_SET':
            statusIndicator.className = 'alexa-tokenSet';
            break;
        case 'ALEXA_RECORD_START':
            statusIndicator.className = 'alexa-recordStart';
            break;
        case 'ALEXA_RECORD_STOP':
            statusIndicator.className = 'alexa-recordStop';
            break;
    }
}

module.exports = setStatus;