Module.register("MMM-alexa",{
    defaults: {
    },
    start: function(){
        this.alexaRunner = new window.alexaRunner(this.config, function(notification){
        //    TODO: send global notification
            console.log(notification);
        });
    },
    getDom: function() {
        var wrapper = document.createElement('div');

        wrapper.className = 'alexa-notInitialized';
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
    }
});