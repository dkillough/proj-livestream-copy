let timecodeArr = [];
const descriptionChanged = new CustomEvent('desc-changed')

window.addEventListener("load", function () {
    console.log("window loaded");
    processData()
    console.log(timecodeArr)
    updateVisualDescription()
});

function processData() {
    const video = document.getElementById('content')
    let q = parseQuery(window.location.href.split('?')[1])
    console.log(q)
    let v = q["videoId"]
    video.src = 'https://github.com/dkillough/livestream-vods/blob/main/' + v + ".mp4?raw=true"
    let o = q["option"]
    let timeOffset = 0;
    switch(v) {
        case "BA":
            if(o == "TL") timeOffset = 11
            break;
        case "BB":
            if(o == "TA") timeOffset = 113
            break;
        case "BC":
            if(o == "A") timeOffset = 9
            break;
        case "DA":
            if(o == "A") timeOffset = 8
            else if(o == "TL") timeOffset = 3
            else if(o == "TA") timeOffset = 49
            break;
        case "DB":
            if(o == "TL") timeOffset = 21
            break;
        case "DC":
            if(o == "TL") timeOffset = 18
            else if(o == "TA") timeOffset = 34
            break;
        case "CA":
            if(o == "TA") timeOffset = 12
            break;
        case "CB":
            if(o == "A") timeOffset = -56
            else if(o == "TL") timeOffset = 9
            else if(o == "TA") timeOffset = 3
            break;
        case "CC":
            if(o == "A") timeOffset = 67
            else if(o == "TL") timeOffset = 5
            break;
        case "LA":
            if(o == "TL") timeOffset = 22
            else if(o == "TA") timeOffset = 39
            break;
        case "LB":
            if(o == "A") timeOffset = 16
            else if(o == "TL") timeOffset = 9
            else if(o == "TA") timeOffset = 2
            break;
        case "LC":
            if(o == "TL") timeOffset = 4
            else if(o == "TA") timeOffset = 3
            break;
        case "MA":
            if(o == "A") timeOffset = -65
            else if(o == "TL") timeOffset = 1
            break;
        case "MB":
            if(o == "TA") timeOffset = 2
            break;
        case "SA":
            if(o == "A") timeOffset = 5    
            else if(o == "TA") timeOffset = 15
            break;
        case "SB":
            if(o == "A") timeOffset = 7
            else if(o == "TL") timeOffset = 4
            break;
        case "SC":
            if(o == "A") timeOffset = 6
            else if(o == "TL") timeOffset = 5
            else if(o == "TA") timeOffset = 4
            break;
        case "VA":
            if(o == "A") timeOffset = 4
            else if(o == "TA") timeOffset = 4
            break;
        case "VB":
            if(o == "TL") timeOffset = 5
            else if(o == "TA") timeOffset = 1
            break;
        case "VC":
            if(o == "TL") timeOffset = 45
            else if(o == "TA") timeOffset = 4
            break;
    }
    $.getJSON('../master-data.json', (json) => {
        for(let i = 0; i < json.length; i++) {
            if(v == json[i].vidID && o == json[i].condition) {
                let t = parseTime(json[i].timecode) + timeOffset
                timecodeArr[t] = json[i].descTxt
            }
        }
    })
}

function switchVideo() {
    const video = document.getElementById('content')
    video.src = 'https://github.com/dkillough/livestream-vods/blob/main/LA.mp4?raw=true'
}

function updateVisualDescription() {
    const video = document.getElementById('content')
    const desc = document.getElementById("timecodes")

    document.addEventListener('desc-changed', (e) => {
        console.log('The event happened!');
        playSFX()
    });

    setInterval(() => {
        document.getElementById("time").innerHTML = Math.floor(video.currentTime)
        let currentTime = document.getElementById("time").innerText
        let t = parseInt(currentTime)
        if (t < timecodeArr.length && timecodeArr[t] && desc.innerHTML != timecodeArr[t]) {
            desc.innerHTML = timecodeArr[t]
            document.dispatchEvent(descriptionChanged)
        }
    }, 1000);
}

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}
// potentially add edge case for seek

function playSFX() {
    var audio = new Audio('./ringtone.mp3');
    audio.loop = false;
    audio.play(); 
}

function parseTime(t) {
    const data = t.split(':')
    if (data[0] == "NOTIME") return 0;
    let offset = (data.length == 3) ? 1 : 0
    const min = parseInt(data[offset])
    const sec = parseInt(data[offset + 1])
    const time = (min * 60) + sec
    return time
}
