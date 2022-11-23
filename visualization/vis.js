// document.getElementById('txt-async').appendChild("div")
// one "inner container" made dynamically
// span "inner container" from start-time to end-time
// give "inner container" some darker color (or just red/green or smth)
// then append each desc as child within "inner container"

const cssMultiplier = 15;        // spacing between each timecode break
const offsetFromTop = 70;
let startTimeArray = [];
let firstTime = "";
let hasAudioContext = false;
let firstDescTime = Number.MAX_VALUE;

(() => {
    // populate backend db given data spreadsheet
    $.getJSON('../master-data.json', (json) => {
        const queryString = location.search
        let a = queryString.split('?')
        const videoId = a[1].split('=')[1]
        if (videoId) processData(json, videoId)      // and populate visualization if a videoID query is found
    });
})()

// display helper
function processData(json, videoId) {
    const timecodes = document.getElementById("timecodes")

    let found = false
    for (let i = 0; i < json.length; i++) {
        if (json[i].vidID == videoId) {
            found = true
            if (json[i].timecode == "NOTIME") {
                if (json[i].condition == "A") {
                    hasAudioContext = true
                }
            } else if (!startTimeArray[0] || !startTimeArray[1] || !startTimeArray[2]) {
                switch (json[i].condition) {
                    case "A":
                        if (!startTimeArray[0]) startTimeArray[0] = json[i].firstDesc
                        continue;
                    case "TL":
                        if (!startTimeArray[1]) startTimeArray[1] = json[i].firstDesc
                        continue;
                    case "TA":
                        if (!startTimeArray[2]) startTimeArray[2] = json[i].firstDesc
                        continue;
                    default:
                        console.log('hit default case in preprocessing ??')
                        break
                }
            } else break
        }
    }

    console.log(startTimeArray)

    if (!startTimeArray[0] || !startTimeArray[1] || !startTimeArray[2]) {
        if (!startTimeArray[0]) {
            if (!startTimeArray[1]) firstTime = startTimeArray[2]
            else if (!startTimeArray[2]) firstTime = startTimeArray[1]
            else firstTime = (startTimeArray[1] < startTimeArray[2]) ? startTimeArray[1] : startTimeArray[2]
        } else if (!startTimeArray[1]) {
            if (!startTimeArray[0]) firstTime = startTimeArray[2]
            else if (!startTimeArray[2]) firstTime = startTimeArray[0]
            else firstTime = (startTimeArray[0] < startTimeArray[2]) ? startTimeArray[0] : startTimeArray[2]
        } else if (!startTimeArray[2]) {
            if (!startTimeArray[1]) firstTime = startTimeArray[0]
            else if (!startTimeArray[0]) firstTime = startTimeArray[1]
            else firstTime = (startTimeArray[1] < startTimeArray[0]) ? startTimeArray[1] : startTimeArray[0]
        }
    } else if (startTimeArray[0] < startTimeArray[1]) {
        if (startTimeArray[0] <= startTimeArray[2]) firstTime = startTimeArray[0]
        else firstTime = (startTimeArray[1] < startTimeArray[2]) ? startTimeArray[1] : startTimeArray[2]
    } else if (startTimeArray[1] <= startTimeArray[2]) {
        firstTime = startTimeArray[1]
    } else {
        firstTime = startTimeArray[2]
    }

    let lastDescTime = 0
    for (let i = 0; i < json.length; i++) {
        if (json[i].vidID == videoId) {
            found = true
            genChild(json[i].condition, json[i].timecode, json[i].descTxt, json[i].firstDesc)
            const t = parseTime(json[i].timecode)
            if (t < firstDescTime) firstDescTime = t
            if (t > lastDescTime) lastDescTime = t
        }
    }

    if (!found) {
        console.log('timecodes not found')
        return;
    }

    const timecodeArr = genTimecodes(lastDescTime)
    for (let i = 0; i < timecodeArr.length; i++) {
        const newDiv = document.createElement('div')
        newDiv.style.position = 'absolute'
        newDiv.style.top = ((parseTime(timecodeArr[i]) * cssMultiplier) + offsetFromTop + 7) + "px"
        newDiv.innerText = timecodeArr[i]
        timecodes.appendChild(newDiv)
    }
}

// returns array for timecodes based on how long the video was
// would be better to generate this based on a function of the avg # of descriptions and time between them and length of each desc
function genTimecodes(lastDescTime) {
    let timecodeArr = []
    let step = (lastDescTime % 3 == 0) ? 3 : 2
    for (let i = 0; i < lastDescTime; i++) {
        if (i % step == 0 || (i + step) > lastDescTime) {
            let m = parseInt(i / 60)
            let s = (i % 60)
            let timeStr = (s < 10) ? (m + ":0" + s) : (m + ":" + s)
            timecodeArr.push(timeStr)
        }
    }
    return timecodeArr
}

function genChild(parent, time, desc, firstDesc) {
    const audioDescs = document.getElementById("audio")
    const liveTextDescs = document.getElementById("txt-live")
    const asyncTextDescs = document.getElementById("txt-async")

    let t = parseTime(time)
    let fD = parseTime(firstDesc)
    let fT = parseTime(firstTime)
    let timeDelta = fD - fT
    t = t + timeDelta

    switch (parent) {
        case "A":
            var currentCondition = audioDescs
            var color = "#CCF"
            t -= firstDescTime
            break;
        case "TA":
            var currentCondition = asyncTextDescs
            var color = "#88F"
            break;
        case "TL":
            var currentCondition = liveTextDescs
            var color = "#AAF"
            break;
        default:
            console.log("err! bad condition!")
            break;
    }

    const newDiv = document.createElement('div')
    newDiv.style.position = 'absolute'
    newDiv.style.top = (t * cssMultiplier) + offsetFromTop + "px"
    newDiv.style.backgroundColor = color
    newDiv.style.border = "1px solid #000";
    newDiv.innerText = normTime(time) + " " + desc
    currentCondition.appendChild(newDiv)
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

function normTime(t) {
    const tSplit = t.split(':')
    if (tSplit[0] == "NOTIME") {
        return "[Context Description]:\n"
    }
    let offset = (tSplit.length == 3) ? 1 : 0
    if (tSplit[offset][1]) return tSplit[offset][1] + ":" + tSplit[offset + 1]
    else return tSplit[offset] + ":" + tSplit[offset + 1]
}