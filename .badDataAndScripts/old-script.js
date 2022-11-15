// document.getElementById('txt-async').appendChild("div")
// one "inner container" made dynamically
// span "inner container" from start-time to end-time
// give "inner container" some darker color (or just red/green or smth)
// then append each desc as child within "inner container"


const dataLength = 8;            // number of fields for each row of data table
const videoIdField = 4;          // index of "Video" field
const timeFromStartField = 7;    // index of "Timecode from start of description" field
const conditionField = 1;        // index of "Condition" field
const descTxtField = 5;          // index of "Description Text" field
const cssMultiplier = 10;        // spacing between each timecode break

(() => {
    // populate backend db given data spreadsheet
    const fs = require('fs')
    const data = fs.readFileSync('./data.csv', 'utf8');
    const dataArr = data.split(',')
    const cleanDataArr = []

    for (let i = 0; i < dataArr.length; i++) {
        if (dataArr[i] != '') {
            // console.log(dataArr[i])
            if (dataArr[i].includes("\r\n")) {
                let temp = dataArr[i].split("\r\n")

                for (let j = 0; j < temp.length; j++) {
                    if (temp[j] != '') cleanDataArr.push(temp[j])
                }
            } else {
                cleanDataArr.push(dataArr[i])
            }
        }
        // console.log(cleanDataArr)
    }

    if (cleanDataArr.length % dataLength != 0) {
        console.log("warning! amount of fields not divisible by length!")
    }

    let i = 0
    let currentVideoID = cleanDataArr[i + videoIdField]
    let videoDataArr = []
    let newDataRow = []
    while (i < cleanDataArr.length) {
        if (currentVideoID != cleanDataArr[i + videoIdField]) {
            videoDataArr.push(newDataRow)
            newDataRow = []
            currentVideoID = cleanDataArr[i + videoIdField]
        }

        let j = i
        while (i < (j + dataLength)) {
            if (i >= cleanDataArr.length) {
                console.log('ERR RAN OUT OF DATA AT INDEX %d', i)
                break;
            }
            newDataRow.push(cleanDataArr[i])
            i++
        }
        // console.log('a')
    }
    console.log(newDataRow)
    videoDataArr.push(newDataRow)

    // display appropriate data for this video ID

    const queryString = new URLSearchParams(location.search)
    if (queryString.has('videoid')) {
        processData(queryString.get(videoDataArr, videoId))
    }

    // let csv = fs.createWriteStream('../analysis/exports/test.csv')    
    // csv.on('error', (err) => { console.log(err) })
    // videoDataArr.forEach(e => {
    //     csv.write(e.join(', ') + '\r\n')
    // })
    // csv.end()
})()

// display helper
function processData(videoDataArr, videoId) {
    const timecodes = document.getElementById("timecodes")
    const audioDescs = document.getElementById("audio")
    const liveTextDescs = document.getElementById("txt-live")
    const asyncTextDescs = document.getElementById("txt-async")

    let startIndex = 0
    while (startIndex < videoDataArr.length && videoDataArr[startIndex[videoIdField]] != videoId) {
        startIndex++;
    }

    if (startIndex >= videoDataArr.length) {
        console.log('timecodes not found')
        return;
    }

    // STILL NEED TO NORMALIZE START TIMES
    let currentIndex = startIndex
    let currentCondition = audioDescs
    while (currentIndex < videoDataArr.length && videoDataArr[currentIndex[videoIdField]] == videoId) {
        switch (videoDataArr[currentIndex[conditionField]]) {
            case "A":
                currentCondition = audioDescs
                break;
            case "TA":
                currentCondition = asyncTextDescs
                break;
            case "TL":
                currentCondition = liveTextDescs
                break;
        }
        genChild(videoDataArr[currentIndex], currentCondition)
        currentIndex++
    }

    let lastDescTime = 0
    if (currentIndex >= videoDataArr.length) {
        var lastDescTimeStr = videoDataArr[videoDataArr.length - 1][timeFromStartField]
    } else {
        var lastDescTimeStr = videoDataArr[currentIndex - 1][timeFromStartField]
    }

    lastDescTime = parseTime(lastDescTimeStr)
    const timecodeArr = genTimecodes(lastDescTime)
    for (let i = 0; i < timecodeArr.length; i++) {
        const newDiv = timecodes.appendChild('div')
        newDiv.style.position = 'relative'
        newDiv.style.top = parseTime(timecodeArr[i]) * cssMultiplier
        newDiv.innerText(timecodeArr[i])
    }
}

// returns array for timecodes based on how long the video was
// would be better to generate this based on a function of the avg # of descriptions and time between them and length of each desc
function genTimecodes(lastDescTime) {
    let timecodeArr = []
    let step = (lastDescTime % 3 == 0) ? 3 : 2
    for (let i = 0; i < lastDescTime; i++) {
        if (i % step == 0 || (i + step) > lastDescTime) {
            let timeStr = (i / 60) + ":" + (i % 60)
            timecodeArr.push(timeStr)
        }
    }
}

function genChild(row, parent) {
    const newDiv = parent.appendChild('div')
    newDiv.style.position = 'relative'
    newDiv.style.top = parseTime(row[timeFromStartField]) * cssMultiplier
    newDiv.innerText = row[descTxtField]
    newDiv.borderWidth = 'thin'
    return genChild
}

function parseTime(t) {
    const data = t.split(':')
    if (data[0] == "NOTIME") {
        return 0
    }
    let offset = (data.length == 3) ? 1 : 0
    const min = parseInt(data[offset])
    const sec = parseInt(data[offset + 1])
    const time = (min * 60) + sec
    return time
}