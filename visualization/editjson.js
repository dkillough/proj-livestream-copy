(() => {

    const json = require('./oldData.json')
    const newTimes = require('./newAudioDescTimes.json')
    const fs = require('fs')

    const f = fs.createWriteStream('./newData.json')
    f.write('[')
    for (let i = 0; i < json.length; i++) {
        for (let j = 0; j < newTimes.length; j++) {
            if (json[i].sessionID == newTimes[j].SessionID) {
                json[i].firstDesc = newTimes[j].newStartTime;
            }
        }
        f.write(JSON.stringify(json[i]))
        if (i != json.length - 1) f.write(',')
    }
    f.write(']')

    f.close()
})()