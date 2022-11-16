/*  
    - How many audio descriptions for each condition/participant 
    - Total # / avg # words per description
        - How that varied over description types
        - Mean & Std. dev for each (per video and per condition)
    - Calculate with the intent to find patterns or outliers
*/

// obj container arrays 
var participants = []
var videos = []

let words = 0   // total # of words accumulator
let descs = 0   // total # of descriptions accumulator

// template p object
let p = {
    "rawNumA": 0,     // raw # descriptions
    "rawNumTL": 0,    // raw # descriptions
    "rawNumTA": 0,    // raw # descriptions
    "timeSpentA": 0,  // time spent describing in seconds (last time minus start time)
    "timeSpentTL": 0, // time spent describing in seconds (last time minus start time)
    "timeSpentTA": 0, // time spent describing in seconds (last time minus start time)
    "avgDescA": 0,    // avg descriptions per minute
    "avgDescTL": 0,   // avg descriptions per minute
    "avgDescTA": 0,   // avg descriptions per minute
    "contextA": 0,    // length of contextual description. 0 if not provided
    "contextTL": 0,   // length of contextual description. 0 if not provided
    "contextTA": 0,   // length of contextual description. 0 if not provided
}

let video = {
    "rawNumA": 0,     // raw # descriptions
    "rawNumTL": 0,    // raw # descriptions
    "rawNumTA": 0,    // raw # descriptions
    "timeSpentA": 0,  // time spent describing in seconds (last time minus start time)
    "timeSpentTL": 0, // time spent describing in seconds (last time minus start time)
    "timeSpentTA": 0, // time spent describing in seconds (last time minus start time)
    "avgDescA": 0,    // avg descriptions per minute
    "avgDescTL": 0,   // avg descriptions per minute
    "avgDescTA": 0,   // avg descriptions per minute
    "contextA": 0,    // length of contextual description. 0 if not provided
    "contextTL": 0,   // length of contextual description. 0 if not provided
    "contextTA": 0,   // length of contextual description. 0 if not provided
}

let allDescription = {
    "rawNumA": 0,     // raw # descriptions
    "rawNumTL": 0,    // raw # descriptions
    "rawNumTA": 0,    // raw # descriptions
    "timeSpentA": 0,  // time spent describing in seconds (last time minus start time)
    "timeSpentTL": 0, // time spent describing in seconds (last time minus start time)
    "timeSpentTA": 0, // time spent describing in seconds (last time minus start time)
    "avgDescA": 0,    // avg descriptions per minute
    "avgDescTL": 0,   // avg descriptions per minute
    "avgDescTA": 0,   // avg descriptions per minute
    "contextA": 0,    // length of contextual description. 0 if not provided
    "contextTL": 0,   // length of contextual description. 0 if not provided
    "contextTA": 0,   // length of contextual description. 0 if not provided
}

let allDescriptions = []

var videoDurations = {};

    (() => {
        const json = require('../visualization/data.json')
        const association = require('./association.json')

        // preprocessing
        for (let i = 0; i < json.length; i++) {
            calcDurations(json[i])
            words += calcNumWords(json[i])
            allDescriptions[i] = words
            descs++
        }

        // object population iteration
        for (let i = 0; i < json.length; i++) {
            let cond = json[i].condition
            let pKey = json[i].participantID
            let vKey = json[i].vidID
            let sesID = json[i].sessionID

            let p = participants[pKey]
            let v = videos[vKey]
            let d = allDescription

            // if (cond == "A") {
            //     if(json[i].timecode == "NOTIME") {
            //         p.contextA = calcNumWords(json[i])
            //         v.contextA = calcNumWords(json[i])
            //     }

            //     // p[rawNumA] = (p[rawNumA] ?? 0) + 1;
            //     v.rawNumA++
            //     d.rawNumA++

            //     p.timeSpentA = videoDurations[jsonObj.sessionID]
            //     v.timeSpentA = videoDurations[jsonObj.sessionID]
            //     d.timeSpentA += videoDurations[jsonObj.sessionID]

            //     p.avgDescA = p.rawNumA / p.timeSpentA
            //     v.avgDescA = v.rawNumA / v.timeSpentA

            // } else if (cond == "TL") {
            //     if(json[i].timecode == "NOTIME") {
            //         p.contextTL = calcNumWords(json[i])
            //         v.contextTL = calcNumWords(json[i])
            //     }

            //     if(p.rawNumTL) p.rawNumTL++; else p.rawNumTL = 1;
            //     if(v.rawNumTL) v.rawNumTL++; else v.rawNumTL = 1;
            //     if(d.rawNumTL) d.rawNumTL++; else d.rawNumTL = 1;

            //     p.timeSpentTL = videoDurations[jsonObj.sessionID]
            //     v.timeSpentTL = videoDurations[jsonObj.sessionID]
            //     if(d.timeSpentTL) d.timeSpentTL += videoDurations[jsonObj.sessionID]; else d.timeSpentTL = videoDurations[jsonObj.sessionID];

            //     p.avgDescTL = p.rawNumTL / p.timeSpentTL
            //     v.avgDescTL = v.rawNumTL / v.timeSpentTL

            // } else if (cond == "TA") {
            //     if(json[i].timecode == "NOTIME") {
            //         p.contextTA = calcNumWords(json[i])
            //         v.contextTA = calcNumWords(json[i])
            //     }

            //     if(p.rawNumTA) p.rawNumTA++; else p.rawNumTA = 1;
            //     if(v.rawNumTA) v.rawNumTA++; else v.rawNumTA = 1;
            //     if(d.rawNumTA) d.rawNumTA++; else d.rawNumTA = 1;

            //     p.timeSpentTA = videoDurations[jsonObj.sessionID]
            //     v.timeSpentTA = videoDurations[jsonObj.sessionID]
            //     if(d.timeSpentTA) d.timeSpentTA += videoDurations[jsonObj.sessionID]; else d.timeSpentTA = videoDurations[jsonObj.sessionID];

            //     p.avgDescTA = p.rawNumTA / p.timeSpentTA
            //     v.avgDescTA = v.rawNumTA / v.timeSpentTA
            // }
        }
        
        // value calculation
        let audioDescriptionsData = []
        let liveTxtDescriptionsData = []
        let asyncTxtDescriptionsData = []
        let rawNumAccumulatorA = 0
        let rawNumAccumulatorTA = 0
        let rawNumAccumulatorTL = 0
        let timeAccumulatorA = 0
        let timeAccumulatorTA = 0
        let timeAccumulatorTL = 0
        for (let i = 0; i < videos.length; i++) {
            audioDescriptionsData[i] = rawNumA
            liveTxtDescriptionsData[i] = rawNumTL
            asyncTxtDescriptionsData[i] = rawNumTA 
            rawNumAccumulatorA += videos[i].rawNumA
            rawNumAccumulatorTA += videos[i].rawNumTA
            rawNumAccumulatorTL += videos[i].rawNumTL
            timeAccumulatorA += videos[i].timeSpentA
            timeAccumulatorTA += videos[i].timeSpentTA
            timeAccumulatorTL += videos[i].timeSpentTL
        }
        allDescription.avgDescA = rawNumAccumulatorA / timeAccumulatorA
        allDescription.avgDescTA = rawNumAccumulatorTA / timeAccumulatorTA
        allDescription.avgDescTL = rawNumAccumulatorTL / timeAccumulatorTL

        console.log("Total quantity of descriptions: %d", descs)
        // console.log("Total word count of all descriptions: %f", allDescriptions.reduce(()=>{return total + num},0))
        console.log("Std. Deviation of word count over all Descriptions: %f", getStandardDeviation(allDescriptions))
        console.log("Variance over all descriptions: %f", getVariance(allDescriptions))
        console.log("Avg word count of Audio Descriptions: %f", allDescription.avgDescA)
        console.log("Avg word count of Async Text Descriptions: %f", allDescription.avgDescTA)
        console.log("Avg word count of Live Descriptions: %f", allDescription.avgDescTL)
        // console.log("Std. Deviation of Audio Descriptions:)
    })()

function calcDurations(jsonObj) {
    const t = parseTime(jsonObj.timecode)
    let cur = videoDurations[jsonObj.sessionID]
    if (cur) {
        if (t > cur) cur = t
    } else {
        cur = t
    }
}

function calcNumWords(jsonObj) {
    return jsonObj.descTxt.split(' ').length
}

function calcNumPerMin(jsonObj) {
    return 60 * (calcNumWords(jsonObj) / videoDurations[jsonObj.sessionID])
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

function getStandardDeviation(array) {
    if (!array || array.length === 0) return 0;
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function getVariance(array) {
    return Math.sqrt(getStandardDeviation(array))
}