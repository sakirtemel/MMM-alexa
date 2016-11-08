# Module: Alexa
Alexa module allows MagicMirror to connect Amazon Alexa Voice Synthesis(AVS) service without requiring anything else.

TODO: add demo video link

## Usage
To use this module, add it to the modules array in the config/config.js file:

```
modules: [
	{
		module: 'MMM-alexa',
		position: 'top_right', // The status indicator position
		config: {
		    // See 'Configuration options' for more information.
		    avsDeviceId: 'my_device',
		    avsClientId: 'amzn1.application-oa2-client.abcdefgh',
		    avsClientSecret: 'abcdefgh',
		    avsInitialCode: 'ANVabcdefgh',
		    enableRaspberryButton: true
		}
	}
]
```

## Configuration options

The following properties can be configured:

| Argument | Default | Description |
|---|---|---|
| **`avcDeviceId`** | `""` | The device id  that you've created at Amazon. |
| **`avsClientId`** | `""` | The client id which is generated at Amazon. |
| **`avsClientSecret`** | `""` | The client secret which is generated at Amazon. |
| **`avsInitialCode`** | `""` | The initial code for authentication. |
| **`hideStatusIndicator`** | `false` | Hide status indicator on the mirror. |
| **`debug`** | `false` | Add `alexaStart()` and `alexaStop()` commands to the Javascript console. |
| **`disableVoiceActivityDetection`** | `false` | Disable voice activity detection(VAD), it's used to understand when the user stops speaking. |
| **`enableRaspberryButton`** | `false` | Enable starting to record with pressing button which is connected to GPIO. |


## 1. Adding MagicMirror to Amazon AVS Service

You have to be registered to Amazon AVS service, and add MagicMirror as device with using your account in order to use Amazon Alexa service.

After following the steps you should be able to gather all the parameters required to run Alexa on the MagicMirror.

Remember that each initial code can be used only once, then it's being converted to token by the module. So if you run your mirror at your computer for testing, you should gather another code.

TODO: add instructions

[https://sakirtemel.github.io/MMM-alexa/](https://sakirtemel.github.io/MMM-alexa/)


## 2. Raspberry Pi Button to start recording

Button should be connected to GPIO pin 4. The button is used only to start recording.

Do not forget to enable Raspberry Pi button in config. 

## 3. Installing microphone dependencies

Connect your usb microphone and find the devises with using

`aplay -l` and `arecord -l` commands.

Change hw:0,0 and hw:1,0 with the output and input source corresponding.

```
pcm.!default {
  type asym
   playback.pcm {
     type plug
     slave.pcm "hw:0,0"
   }
   capture.pcm {
     type plug
     slave.pcm "hw:1,0"
   }
}
```

Then run this command

`amixer cset numid=3 1`

## Events

This module has been designed in a way that it can interact with other modules. You can easily develop your own module and control this module or get notified about events happening.

You can send the commands from your module like:

`this.sendNotification('ALEXA_START_RECORDING', {});`

##### The possible commands that you can send to the module:

`ALEXA_START_RECORDING` : It will start recording, and if VAD is enabled will stop when the speech is end.

`ALEXA_STOP_RECORDING` : It will stop recording, and send the recorded voice to AVS for getting directives.

##### The possible events that you can receive at your module:

`ALEXA_TOKEN_SET` : It means that the module is successfully initialized with configuration and ready to start for recording. 
 
`ALEXA_RECORD_START` : Right now the record is started.
 
`ALEXA_RECORD_STOP` : The record is stopped and the voice is being sent to AVS.

`ALEXA_VAD_VOICE_DETECTION_START` : There's a voice activity right now.

`ALEXA_VAD_VOICE_DETECTION_STOP` : Voice activity ended.
 
## Tested on

- Jessie lite clean install [https://github.com/MichMich/MagicMirror/wiki/Jessie-Lite-Installation-Guide](https://github.com/MichMich/MagicMirror/wiki/Jessie-Lite-Installation-Guide)
- Raspbery Pi 2
- Bluemic Snowball Microphone

## Development

Feel free to create Pull Requests, or issues as new ideas. Current plan for development is listed below.
  
  * Improve voice activity detection
  * Add wake up keyword support
  * Add blinking leds on Raspberry Pi
  * Add voice spectrum while talking on the mirror(instead of status indicator)
  * Add tutorials about AVS and provide links for ASK
  * Add error sound on empty response
  * Fix threading issues, it hangs when there are multiple commands sent
  * Add blog post link

## Special thanks

[https://github.com/miguelmota/alexa-voice-service/](https://github.com/miguelmota/alexa-voice-service/) for creating such nice library for Javascript.

[https://github.com/MichMich/MagicMirror/](https://github.com/MichMich/MagicMirror/) for inspirations and building well designed framework.

## Licence

MIT