(() => {
    const db = require('./textDict.json')
    
    db.forEach(e => {
        genCSV(e.id, e.sessionID, e.participantID, e.folderLink)
    })

})()

function genCSV(fileID, sID, pID, fL) {
    let jsonPath = '../../_textDescData/' + fileID + '.json'
    let sessionID = sID
    let participantID = pID
    let folderLink = fL

    let sessionSplit = sID.split('-')
    let condition = sessionSplit[2]
    let partCharArr = [...participantID]
    let vod = partCharArr[0] + sessionSplit[1]

    // init json file 
    const json = require(jsonPath)
    const fs = require('fs')
    
    let exp = [[]]
    let cols = ["Session ID", "Condition", "Participant ID", "Folder Link", "Video ID", "Description Text", "First Description Time", "Timecode from start of description"]
    exp.push(cols)
    let startTime = '99:99:99'
    for (let i = 0; i < json.length; i++) {
        if (json[i].time != 'NOTIME') {
            startTime = json[i].time
            break
        }
    }
    let foundTime = (startTime != '99:99:99')
    let splitStart = startTime.split(":")
    let parsedStart = foundTime ? timeToSeconds(splitStart[0], splitStart[1], splitStart[2]) : -1
    json.forEach(e => {
        let splitTime = e.time.split(":")
        let validTime = (foundTime && e.time != 'NOTIME')
        let parsedTimeSince = validTime ? (timeToSeconds(splitTime[0], splitTime[1], splitTime[2]) - parsedStart) : -1
        let strTimeSince = validTime ? secToTime(parsedTimeSince) : 'NOTIME'
        let startT = validTime ? startTime : 'NOTIME'
        let eSplit = e.text.split(",")
        let row = [sessionID, condition, participantID, folderLink, vod, eSplit.join('||'), startT, strTimeSince]
        exp.push(row)
    });

    let csv = fs.createWriteStream('../_exports/audio-text/' + fileID + '.csv')
    csv.on('error', (err) => { console.log(err) })
    exp.forEach(e => {
        csv.write(e.join(', ') + '\r\n')
    })
    csv.end()
}

function timeToSeconds(H, M, S) {
    if (H != 'NOTIME') {
        let hrs = parseInt(H, 10)
        let min = parseInt(M, 10)
        let sec = parseInt(S, 10)
        return ((hrs * 3600) + (min * 60) + sec)
    }
    else return -1
}

function secToTime(t) {
    let min = parseInt((t / 60), 10)
    let sec = parseInt((t % 60), 10)
    let strBuild = (sec < 10) ? "0" + sec : sec
    return (min + ":" + strBuild)
}