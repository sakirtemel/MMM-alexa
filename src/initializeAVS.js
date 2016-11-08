function initializeAVS(alexaRunner){
    var self = this;

    this.initialize = function(){
        alexaRunner.avs = new AVS({
            clientId: alexaRunner.config['avsClientId'],
            clientSecret: alexaRunner.config['avsClientSecret'],
            deviceId: alexaRunner.config['avsDeviceId'],
            deviceSerialNumber: 1234,
            token: localStorage.getItem('avsToken'),
            redirectUri: 'https://sakirtemel.github.io/MMM-alexa/',
            refreshToken: localStorage.getItem('avsRefreshToken')
        });

        alexaRunner.avs.on(AVS.EventTypes.TOKEN_SET, function(){
            alexaRunner.sendNotification('ALEXA_TOKEN_SET');
        });

        alexaRunner.avs.on(AVS.EventTypes.RECORD_START, function(){
            alexaRunner.sendNotification('ALEXA_RECORD_START');
        });

        alexaRunner.avs.on(AVS.EventTypes.RECORD_STOP, function(){
            alexaRunner.sendNotification('ALEXA_RECORD_STOP');
        });
    };

    this.saveTokens = function(){
        alexaRunner.avs.getToken().then((token) => localStorage.setItem('avsToken', token));
        alexaRunner.avs.getRefreshToken().then((refreshToken) => localStorage.setItem('avsRefreshToken', refreshToken));
        localStorage.setItem('avsInitialCode', alexaRunner.config['avsInitialCode']);
    };

    this.login = function(){
        var useCode = localStorage.getItem('avsInitialCode') !== alexaRunner.config['avsInitialCode'];

        if(useCode){
            alexaRunner.avs.getTokenFromCode(alexaRunner.config['avsInitialCode'])
                .then(() => alexaRunner.avs.refreshToken())
                .then(() => self.saveTokens())
                .then(() => alexaRunner.avs.requestMic())
                .catch((error) => {console.log(error);});
        }else{
            alexaRunner.avs.refreshToken()
                .then(() => self.saveTokens())
                .then(() => alexaRunner.avs.requestMic())
                .catch((error) => {console.log(error);});
        }
    };

    return new Promise((resolve, reject) => {
        self.initialize();
        self.login();

        resolve();
    });
}

module.exports = initializeAVS;