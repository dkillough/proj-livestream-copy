/*  - How many audio descriptions for each condition/participant 
    - Total # / avg # words per description
        - How that varied over description types
        - Mean & Std. dev for each (per video and per condition)
    - Calculate with the intent to find patterns or outliers
*/

// array participants of p objects
const participants = []

// template p object
let p = {
    "rawNumA": 0,
    "rawNumTL": 0,
    "rawNumTA": 0,    // raw # descriptions
    "timeSpentA": 0,  // time spent describing in seconds (last time minus start time)
    "timeSpentTL": 0,
    "timeSpentTA": 0,
    "avgDescA": 0,    // avg descriptions per minute
    "avgDescTL": 0,
    "avgDescTA": 0
}

(() => {
    const json = require('../visualization/data.json')

    for (let i = 0; i < json.length; i++) {
        genChild(json[i].condition, json[i].timecode, json[i].descTxt)
        const t = parseTime(json[i].timecode)
        if (t > lastDescTime) lastDescTime = t
    }

    if (!found) {
        console.log('timecodes not found')
        return;
    }

})()

function incrementCondition() {

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