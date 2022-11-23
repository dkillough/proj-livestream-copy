/* usually you don't do all this in JS lmao check out R packages 

*/

const { parse } = require('path');

// aggregating only on participant
// aggregating only on video
// aggregating only on condition

// total number of descriptions for each of these too
// time spent describing
// average descriptions per participant per minute
// average descriptions 

const precision = 3;
let partWords = {};
let videoWords = {};
let condWords = {};
let sesWords = {};
let lastTime = {};
let lastTimeSession = {};
let numPartDescriptions = {};
let numVideoDescriptions = {};
let numCondDescriptions = {};
let numSesDescriptions = {};
let numTotalDescriptions;

(() => { 
    const json = require('../../master-data.json')
    numTotalDescriptions = json.length;
    for (let i = 0; i < json.length; i++) {
        const txt = json[i].descTxt.split(' ')
        const w = txt.length

        if(partWords[json[i].participantID]) {
            partWords[json[i].participantID] += w
        } else {
            partWords[json[i].participantID] = w
        }
        if(numPartDescriptions[json[i].participantID]) {
            numPartDescriptions[json[i].participantID] += 1
        } else {
            numPartDescriptions[json[i].participantID] = 1
        }

        if(videoWords[json[i].vidID]) {
            videoWords[json[i].vidID] += w
        } else {
            videoWords[json[i].vidID] = w
        }
        if(numVideoDescriptions[json[i].vidID]) {
            numVideoDescriptions[json[i].vidID] += 1
        } else {
            numVideoDescriptions[json[i].vidID] = 1
        }

        if(condWords[json[i].condition]) {
            condWords[json[i].condition] += w
        } else {
            condWords[json[i].condition] = w
        }
        if(numCondDescriptions[json[i].condition]) {
            numCondDescriptions[json[i].condition] += 1
        } else {
            numCondDescriptions[json[i].condition] = 1
        }

        if(sesWords[json[i].sessionID]) {
            sesWords[json[i].sessionID] += w
        } else {
            sesWords[json[i].sessionID] = w
        }
        if(numSesDescriptions[json[i].sessionID]) {
            numSesDescriptions[json[i].sessionID] += 1
        } else {
            numSesDescriptions[json[i].sessionID] = 1
        }

        let l = lastTime[json[i].participantID]
        if(!l || (l == 'NOTIME') || (l < json[i].timecode)) lastTime[json[i].participantID] = json[i].timecode

        let t = lastTimeSession[json[i].sessionID]
        if(!t || (t == 'NOTIME') || (t < json[i].timecode)) lastTimeSession[json[i].sessionID] = json[i].timecode 
    }

    let numTotalWords = 0
    const val = Object.values(partWords)
    for(let i = 0; i < val.length; i++) {
        numTotalWords += val[i]
    }
    console.log("raw number of total words: ", numTotalWords)
    console.log("total number of descriptions: ", numTotalDescriptions)

    console.log('*****')
    console.log()
    const partEntries = Object.entries(partWords)
    console.log("total word counts broken down by participant: ", partEntries)
    let partArr = genValueArray(partEntries)
    console.log("avg words / participant: ", Number(getAvg(partArr)).toFixed(precision))
    console.log("std. dev words by participant: ", Number(getStandardDeviation(partArr)).toFixed(precision))
    console.log("variance words by participant: ", Number(getVariance(partArr)).toFixed(precision))
    console.log()
    const partDescEntries = Object.entries(numPartDescriptions)
    console.log("total description counts broken down by participant: ", partDescEntries)
    let partDescArr = genValueArray(partDescEntries)
    console.log("avg description counts / participant: ", Number(getAvg(partDescArr)).toFixed(precision))
    console.log("std. dev description counts / participant: ", Number(getStandardDeviation(partDescArr)).toFixed(precision))
    console.log("variance description counts / participant: ", Number(getVariance(partDescArr)).toFixed(precision))
    
    console.log('*****')
    console.log()
    const vidEntries = Object.entries(videoWords)
    console.log("total word counts broken down by video ID: ", vidEntries)
    let vidArr = genValueArray(vidEntries)
    console.log("avg words / video: ", Number(getAvg(vidArr)).toFixed(precision))
    console.log("std. dev words by video: ", Number(getStandardDeviation(vidArr)).toFixed(precision))
    console.log("variance words by video: ", Number(getVariance(vidArr)).toFixed(precision))
    console.log()
    const videoDescEntries = Object.entries(numVideoDescriptions)
    console.log("total description counts broken down by videoID: ", videoDescEntries)
    let vidDescArr = genValueArray(videoDescEntries)
    console.log("avg description counts / videoID: ", Number(getAvg(vidDescArr)).toFixed(precision))
    console.log("std. dev description counts / videoID: ", Number(getStandardDeviation(vidDescArr)).toFixed(precision))
    console.log("variance description counts / videoID: ", Number(getVariance(vidDescArr)).toFixed(precision))
    
    console.log('*****')
    console.log()
    const condEntries = Object.entries(condWords)
    console.log("total word counts broken down by condition: ", condEntries)
    let condArr = genValueArray(condEntries)
    console.log("avg words / condition: ", Number(getAvg(condArr).toFixed(precision)))
    console.log("std. dev words by condition: ", Number(getStandardDeviation(condArr)).toFixed(precision))
    console.log("variance words by condition: ", Number(getVariance(condArr)).toFixed(precision))
    console.log()
    const condDescEntries = Object.entries(numCondDescriptions)
    console.log("total description counts broken down by condition: ", condDescEntries)
    let condDescArr = genValueArray(condDescEntries)
    console.log("avg description counts / condition: ", Number(getAvg(condDescArr)).toFixed(precision))
    console.log("std. dev description counts / condition: ", Number(getStandardDeviation(condDescArr)).toFixed(precision))
    console.log("variance description counts / condition: ", Number(getVariance(condDescArr)).toFixed(precision))
    
    console.log('*****')
    console.log()
    const sesEntries = Object.entries(sesWords)
    console.log("total word counts broken down by session ID: ", sesEntries)
    let sesArr = genValueArray(sesEntries)
    console.log("total word count avg: ", Number(getAvg(sesArr).toFixed(precision)))
    console.log("total word count std dev:", Number(getStandardDeviation(sesArr).toFixed(precision)))
    console.log("total word count variance:", Number(getVariance(sesArr).toFixed(precision)))
    console.log()
    const sesDescEntries = Object.entries(numSesDescriptions)
    console.log("total description counts broken down by sessionID: ", sesDescEntries)
    let sesDescArr = genValueArray(sesDescEntries)
    console.log("total avg description counts: ", Number(getAvg(sesDescArr)).toFixed(precision))
    console.log("total std. dev description counts: ", Number(getStandardDeviation(sesDescArr)).toFixed(precision))
    console.log("total variance description counts: ", Number(getVariance(sesDescArr)).toFixed(precision))

    console.log('*****')
    console.log()
    const as = require('./association.json')
    let lastTimeAcc = {}    // accumulator based on participant ID
    for(key in lastTimeSession) {
        if(!lastTimeAcc[as[key]]) lastTimeAcc[as[key]] = parseTime(lastTimeSession[key])
        else lastTimeAcc[as[key]] += parseTime(lastTimeSession[key])
    }
    const lastTimeEntries = Object.entries(lastTimeSession)
    console.log("duration spent describing per participant in seconds: ", lastTimeEntries)
    let timeArr = genValueArray(lastTimeEntries)
    console.log("avg duration spent describing by participant in seconds: ", Number(getAvg(timeArr)).toFixed(precision))
    console.log("std. dev duration spent describing by participant in seconds: ", Number(getStandardDeviation(timeArr)).toFixed(precision))
    console.log("variance duration spent describing by participant in seconds: ", Number(getVariance(timeArr)).toFixed(precision))

    console.log('*****')
    console.log()
    let avgDescPerMinByPart = []
    for(key in numPartDescriptions) {
        const t = parseTime(lastTime[key])   // time in seconds
        let avgPerMin = 60 * numPartDescriptions[key] / t
        avgDescPerMinByPart[key] = Number(Number(avgPerMin).toFixed(precision))
    }
    const avgDescPerMinByPartEntries = Object.entries(avgDescPerMinByPart)  // lmao
    console.log('avg descriptions per min by participant: ', avgDescPerMinByPartEntries)
    const avgDescPerMinByPartVals = genValueArray(avgDescPerMinByPartEntries)
    console.log("avg of avg of descriptions per min over all participants: ", Number(getAvg(avgDescPerMinByPartVals)).toFixed(precision))
    console.log("std. dev of avg of descriptions per min over all participants: ", Number(getStandardDeviation(avgDescPerMinByPartVals)).toFixed(precision))
    console.log("variance of avg of descriptions per min over all participants: ", Number(getVariance(avgDescPerMinByPartVals)).toFixed(precision))
})()

function getAvg(array) {
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

function genValueArray(array) {
    let res = []
    for(let i = 0; i < array.length; i++) {
        if(typeof array[i][1] === "number") res.push(array[i][1])
        else res.push(parseTime(array[i][1]))
    }
    return res
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
