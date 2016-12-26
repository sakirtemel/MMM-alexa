const StateMachine = require('javascript-state-machine');
const processSpeech = require('./processSpeech');
const runDirectives = require('./runDirectives');

function Controller(alexaRunner){
    var self = this;

    this.alexaRunner = alexaRunner;

    this.fsm = StateMachine.create({
        initial: { state: 'idle', event: 'init', defer: false },
        error: function(){ console.log('error fsm, last state: ' + self.fsm.current); return -1; },
        events: [
            { name: 'listen',  from: 'idle',  to: 'listening' },
            { name: 'stop', from: 'listening', to: 'stoppedAndWaiting' }, // it was * before
            { name: 'answerReceived', from: 'stoppedAndWaiting', to: 'playing' },
            { name: 'listen', from: 'stoppedAndWaiting', to: 'waitingToListenAgain' }, //but it shouldn't be hotword detection
            { name: 'listen', from: 'playing', to: 'waitingToListenAgain' }, //but it shouldn't be hotword detection
            { name: 'finish', from: 'waitingToListenAgain', to: 'listening' }, //but first clear
            { name: 'finish', from: 'playing', to: 'idle' }, // ?? think
            // { name: 'listen', from: 'playing', to: 'listening' }, //?? maybe played state
            { name: 'errorx', from: '*', to: 'idle' },
        ],
        callbacks: {
            onlistening: function(){
                self.alexaRunner.voiceActivityDetector.stopDetection();

                alexaRunner.avs.stopRecording().then(dataView => {
                    // send record command
                    console.log('-- RECORDING');
                    self.alexaRunner.avs.startRecording();
                    // start vad after 1 second
                    self.startVAD();
                });
            },
            onstoppedAndWaiting: function(){
                console.log('-- STOPPED AND WAITING');

                //    stop VAD
                self.alexaRunner.voiceActivityDetector.stopDetection();

                // stop recording
                processSpeech(self.alexaRunner).then(({directives, audioMap}) => {
                    self.fsm.answerReceived();
                    runDirectives(self.alexaRunner, directives, audioMap);
                }).catch(error => {
                    //    error occurred
                    self.fsm.errorx();
                });
            },
            onerrorx: function(){
                console.log('-- ERROR OCCURRED EVENT');
                // clear
                // stop everything
                // beep
            },
            onidle: function(){
                console.log('-- IDLE');
                // clear
            }
            // ,
            // onlisten: function(){
            //     // on re listening, clear
            // }
        }
    });

    this.startVAD = function(){
        if(self.startVADTimeout) {
            self.startVADTimeout = undefined;
            clearTimeout(startVADTimeout);
        }

        self.startVADTimeout = setTimeout(function(){
            self.startVADTimeout = undefined;
            self.alexaRunner.voiceActivityDetector.startDetection();
        }, 1000);
    };
}

module.exports = Controller;

//VAD: first word spoken timeout 3 seconds
// if(self.listening && !self.firstWordSpoken){
//     // timeout
//     self._onVoiceStop();
// }


// fsm.warn() - transition from 'green' to 'yellow'
// fsm.panic() - transition from 'yellow' to 'red'
// fsm.calm() - transition from 'red' to 'yellow'
// fsm.clear() - transition from 'yellow' to 'green'
// along with the following members:
//
//     fsm.current - contains the current state
// fsm.is(s) - return true if state s is the current state
// fsm.can(e) - return true if event e can be fired in the current state
// fsm.cannot(e) - return true if event e cannot be fired in the current state
// fsm.transitions() - return list of events that are allowed from the current state
// fsm.states() - return list of all possible states.

// onpanic:  function(event, from, to, msg) { alert('panic! ' + msg);               },
// onclear:  function(event, from, to, msg) { alert('thanks to ' + msg);            },
// ongreen:  function(event, from, to)      { document.body.className = 'green';    },
// onyellow: function(event, from, to)      { document.body.className = 'yellow';   },
// onred:    function(event, from, to)      { document.body.className = 'red';      },
//TODO: what happens if there are more than 1 audio playing, wait until player queue is empty