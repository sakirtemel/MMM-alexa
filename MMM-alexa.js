Module.register("MMM-alexa",{
    defaults: {
    },
    start: function(){
        var self = this;

        var sendNotification = function(notification){
            self.alexaRunner.notificationReceived(notification);
            self.sendNotification(notification, {});
        };

        this.alexaRunner = new window.alexaRunner(this.config, sendNotification);

        if(this.config['debug']){
            window.alexaStart = function(){
                sendNotification('ALEXA_RECORD_START');
            };

            window.alexaStop = function(){
                sendNotification('ALEXA_RECORD_STOP');
            };
        }
    },
    getDom: function() {
        var wrapper = document.createElement('div');

        if(this.config['hideStatusIndicator']){
            wrapper.className = 'alexa-hidden';
        }else{
            wrapper.className = 'alexa-notInitialized';
        }

        wrapper.id = 'alexa';

        return wrapper;
    },
    getScripts: function(){
        return [
            this.file('alexaRunner.babel.js')
        ];
    },
    getStyles: function(){
        return [
            this.file('alexa.css')
        ];
    },
    notificationReceived: function(notification, payload, sender) {
        if(notification === 'DOM_OBJECTS_CREATED'){
            this.alexaRunner.initialize();
        }

        if(notification.startsWith('ALEXA_')){
            this.alexaRunner.notificationReceived(notification);
        }
    }
});