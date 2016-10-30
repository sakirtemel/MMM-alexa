Module.register("alexa",{
    defaults: {
    },
    start: function(){
    },
    getDom: function() {
        var wrapper = document.createElement("div");

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
    }
});