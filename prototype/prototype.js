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
    video.src = './VODs/' + v + ".mp4"
    let o = q["option"]
    $.getJSON('../master-data.json', (json) => {
        for(let i = 0; i < json.length; i++) {
            if(v == json[i].vidID && o == json[i].condition) {
                let t = parseTime(json[i].timecode)
                timecodeArr[t] = json[i].descTxt
            }
        }
    })
}

function switchVideo() {
    const video = document.getElementById('content')
    video.src = 'CA.mp4'
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
