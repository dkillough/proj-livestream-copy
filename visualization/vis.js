// document.getElementById('txt-async').appendChild("div")
// one "inner container" made dynamically
// span "inner container" from start-time to end-time
// give "inner container" some darker color (or just red/green or smth)
// then append each desc as child within "inner container"

const cssMultiplier = 15;        // spacing between each timecode break

(() => {
    // populate backend db given data spreadsheet
    $.getJSON('./data.json', (json) => {
        const queryString = location.search
        let a = queryString.split('?')
        const videoId = a[1].split('=')[1]
        if(videoId) processData(json, videoId)
    });
})()

// display helper
function processData(json, videoId) {
    const timecodes = document.getElementById("timecodes")

    let found = false
    let lastDescTime = 0
    for(let i = 0; i < json.length; i++) {
        if (json[i].vidID == videoId) {
            found = true
            genChild(json[i].condition, json[i].timecode, json[i].descTxt)
            const t = parseTime(json[i].timecode)
            if(t > lastDescTime) lastDescTime = t
        }
    }

    if (!found) {
        console.log('timecodes not found')
        return;
    }

    // STILL NEED TO NORMALIZE START TIMES
    const timecodeArr = genTimecodes(lastDescTime)
    for (let i = 0; i < timecodeArr.length; i++) {
        const newDiv = document.createElement('div')
        newDiv.style.position = 'relative'
        newDiv.style.top = (parseTime(timecodeArr[i]) * cssMultiplier) + "px"
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

function genChild(parent, time, desc) {
    const audioDescs = document.getElementById("audio")
    const liveTextDescs = document.getElementById("txt-live")
    const asyncTextDescs = document.getElementById("txt-async")

    switch (parent) {
        case "A":
            var currentCondition = audioDescs
            break;
        case "TA":
            var currentCondition = asyncTextDescs
            break;
        case "TL":
            var currentCondition = liveTextDescs
            break;
        default:
            console.log("err! bad condition!")
            break;
    }

    const newDiv = document.createElement('div')
    newDiv.style.position = 'relative'
    newDiv.style.top = (parseTime(time) * cssMultiplier) + "px"
    newDiv.innerText = desc
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