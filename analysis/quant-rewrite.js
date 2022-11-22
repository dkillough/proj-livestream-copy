// aggregating only on participant
// aggregating only on video
// aggregating only on condition

let partWords = {};
let videoWords = {};
let condWords = {};

(() => { 
    const json = require('../visualization/data.json')
    for (let i = 0; i < json.length; i++) {
        const txt = json[i].descTxt.split(' ')
        const w = txt.length

        if(partWords[json[i].participantID]) {
            partWords[json[i].participantID] += w
        } else {
            partWords[json[i].participantID] = w
        }

        if(videoWords[json[i].vidID]) {
            videoWords[json[i].vidID] += w
        } else {
            videoWords[json[i].vidID] = w
        }

        if(condWords[json[i].condition]) {
            condWords[json[i].condition] += w
        } else {
            condWords[json[i].condition] = w
        }
    }

    let numTotalWords = 0
    const val = Object.values(partWords)
    for(let i = 0; i < val.length; i++) {
        numTotalWords += val[i]
    }
    console.log(numTotalWords)

    const partEntries = Object.entries(partWords)
    console.log(partEntries)

    const vidEntries = Object.entries(videoWords)
    console.log(vidEntries)

    const condEntries = Object.entries(condWords)
    console.log(condEntries)

    
})()