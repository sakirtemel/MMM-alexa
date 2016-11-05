function processSpeech(alexaRunner){
    return new Promise((resolve, reject) => {
        var audioMap = {};

        alexaRunner.avs.stopRecording().then(dataView => {
            alexaRunner.avs.sendAudio(dataView).then(({xhr, response}) => {
                var directives = null;

                // message parsing, assigning directives and audio
                if (response.multipart.length) {
                    response.multipart.forEach(multipart => {
                        let body = multipart.body;
                        if (multipart.headers && multipart.headers['Content-Type'] === 'application/json') {
                            try {
                                body = JSON.parse(body);
                            } catch (error) {
                                console.error(error);
                            }

                            if (body && body.messageBody && body.messageBody.directives) {
                                directives = body.messageBody.directives;
                            }
                        } else if (multipart.headers['Content-Type'] === 'audio/mpeg') {
                            const start = multipart.meta.body.byteOffset.start;
                            const end = multipart.meta.body.byteOffset.end;

                            /**
                             * Not sure if bug in buffer module or in http message parser
                             * because it's joining arraybuffers so I have to this to
                             * seperate them out.
                             */
                            var slicedBody = xhr.response.slice(start, end);

                            audioMap[multipart.headers['Content-ID']] = slicedBody;
                        }
                    });
                    resolve({directives, audioMap});
                }
            }).catch(error => { console.error(error); /* send audio error */ });
        });
    });
}

module.exports = processSpeech;