(() => {
    const fileDir = require('./audioDict.json')

    fileDir.forEach(e => {
        parseDescription(e.file, e.sessionID, e.folderLink)
    })
})()

function parseDescription(file, sID, fLink) {
    const fs = require('fs')
    const fileData = fs.readFileSync('../audioDescData/' + file, 'utf8');
    
    const dirtyDataArr = fileData.split('\n')       // will contain entries for empty lines
    const data = []
    for(let i = 0; i < dirtyDataArr.length; i++) {
        if(dirtyDataArr[i] != '') {
            data.push(dirtyDataArr[i]) 
        }
    }
    let fileName = file.split('-')[0]

    let cols = ["Session ID", "Condition", "Participant ID", "Folder Link", "Video ID", "Description Text", "First Description Time", "Timecode from start of description"]
    let exp = [[]]
    exp.push(cols)
    
    let sessionID = sID
    let participantID = fileName
    let sessionSplit = sID.split('-')
    let condition = sessionSplit[2]
    let partCharArr = [...participantID]
    let vod = partCharArr[0] + sessionSplit[1]
    let folderLink = fLink
    let startT;

    for(let i = 0; i < data.length; i++) {
        let descArr = data[i].split(']')
        let desc = descArr[1]
        let timestamp = descArr[0].split('[')[1]
        if(i == 0) startT = timestamp
        let dSplit = desc.split(',')
        let row = [sessionID, condition, participantID, folderLink, vod, dSplit.join('||'), startT, timestamp]
        exp.push(row)
    }

    let csv = fs.createWriteStream('./exports/' + fileName + '.csv')    
    csv.on('error', (err) => { console.log(err) })
    exp.forEach(e => {
        csv.write(e.join(', ') + '\r\n')
    })
    csv.end()

    return;
}