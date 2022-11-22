/*  
    - How many audio descriptions for each condition/participant 
    - Total # / avg # words per description
        - How that varied over description types
        - Mean & Std. dev for each (per video and per condition)
    - Calculate with the intent to find patterns or outliers
*/

// aggregating only on participant
// aggregating only on video
// aggregating only on condition

// obj container arrays 
var videos = []

let words = 0   // total # of words accumulator
let descs = 0   // total # of descriptions accumulator

let wordsPerVideo = []
let wordsPerCondition = {
    "A": 0,
    "TL": 0,
    "TA": 0
}

let wordsPerConditionPerVideo = {}

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

var videoDurations = {}
let contextual = {};

(() => {
    const json = require('../visualization/data.json')
    const association = require('./association.json')

    // first pass preprocessing & constructing data structures
    for (let i = 0; i < json.length; i++) {
        let jsonObj = json[i]
        calcDurations(jsonObj)
        constructNumWords(jsonObj)
        let w = calcNumWords(jsonObj)
        
        words += w
        // if (contextual[jsonObj.sessionID]) { // ??????????????
        //     contextual[jsonObj.sessionID] = w
        // } else {
        //     contextual[jsonObj.sessionID] = 0
        // }

        allDescriptions[i] = words
        descs++
    }

    // object population iteration
    for (let i = 0; i < json.length; i++) {
        let jsonObj = json[i]
        let cond = jsonObj.condition
        let vKey = jsonObj.vidID
        let sesID = jsonObj.sessionID

        wordsPerConditionPerVideo[vKey][cond] = calcNumWords(jsonObj)

        //     if(p.rawNumTL) p.rawNumTL++; else p.rawNumTL = 1
        //     p.timeSpentTL = videoDurations[jsonObj.sessionID]
        //     if(d.timeSpentTA) d.timeSpentTA += videoDurations[jsonObj.sessionID]; else d.timeSpentTA = videoDurations[jsonObj.sessionID];
        //     p.avgDescTA = p.rawNumTA / p.timeSpentTA

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
    let d = allDescriptions.reduce((total, num) => { return total + num }, 0)
    console.log("Total word count of all descriptions: %f", d)
    console.log("Avg description length: %f", getMean(allDescriptions))
    console.log("Std. Deviation of word count over all Descriptions: %f", getStandardDeviation(allDescriptions))
    console.log("Variance over all descriptions: %f", getVariance(allDescriptions))

    let globalFilteredContext = Object.values(contextual).filter((words) => { return (words != 0) })
    console.log("Number of global descriptions: %d", globalFilteredContext.length)
    console.log("Avg global description length: %f", getMean(globalFilteredContext))
    console.log("Std. Deviation of global descriptions: %f", getStandardDeviation(globalFilteredContext))
    console.log("Variance of global descriptions: %f", getVariance(globalFilteredContext))

    let localFilteredContext = Object.values(contextual).filter((words) => { return (words == 0) })
    console.log("Number of local descriptions: %d", localFilteredContext.length)
    console.log("Avg local description length: %f", getMean(localFilteredContext))
    console.log("Std. Deviation of local descriptions: %f", getStandardDeviation(localFilteredContext))
    console.log("Variance of local descriptions: %f", getVariance(localFilteredContext))
})()

function calcDurations(jsonObj) {
    const t = parseTime(jsonObj.timecode)
    let curLastTime = videoDurations[jsonObj.sessionID]
    if (curLastTime) {
        if (t > curLastTime) curLastTime = t
    } else {
        curLastTime = t
    }
}

function calcNumWords(jsonObj) {
    return jsonObj.descTxt.split(' ').length
}

function constructNumWords(jsonObj) {
    let numWords = calcNumWords(jsonObj)
    if (wordsPerVideo[jsonObj.sessionID]) wordsPerVideo[jsonObj.sessionID] += numWords; else wordsPerVideo[jsonObj.sessionID] = numWords
    let wordsPerCondition = {
        "A": 0,
        "TL": 0,
        "TA": 0
    }
    wordsPerConditionPerVideo[jsonObj.vidID] = wordsPerCondition
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

function getMean(array) {
    if (!array || array.length === 0) return 0;
    const n = array.length
    return array.reduce((a, b) => a + b) / n
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