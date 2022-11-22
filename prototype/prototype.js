let timecodeArr = [];

window.addEventListener("load", function () {
    console.log("window loaded");
    processData()
    updateVisualDescription()
});

function processData() {
    timecodeArr[1] = "hello"
    timecodeArr[3] = "text @ 3"
    timecodeArr[4] = "text @ 4"
    timecodeArr[5] = "text5"
    timecodeArr[8] = "cool"
}

function getCurTime() {
    const video = document.getElementById('content')
    document.getElementById("time").innerHTML = Math.round(video.currentTime)
    setInterval(() => { document.getElementById("time").innerHTML = Math.round(video.currentTime) }, 1000)
}

function switchVideo() {
    const video = document.getElementById('content')
    video.src = './Chess-B.mp4'
}

function updateVisualDescription() {
    let currentTime = document.getElementById("time").innerText
    const desc = document.getElementById("timecodes")
    setInterval(function () {
        if (currentTime < timecodeArr.length && timecodeArr[currentTime]) {
            desc.innerHTML = timecodeArr[currentTime]
        }
    }, 1000);
}

// potentially add edge case for seek

