const dataLength = 8;            // number of fields for each row of data table
const videoIdField = 4;          // index of "Video" field
const timeFromStartField = 7;    // index of "Timecode from start of description" field
const conditionField = 1;        // index of "Condition" field
const descTxtField = 5;          // index of "Description Text" field

const fs = require('fs')
const data = fs.readFileSync('./data.csv', 'utf8');
const dataArr = data.split(',')
const cleanDataArr = []

for (let i = 0; i < dataArr.length; i++) {
    if (dataArr[i] != '') {
        // console.log(dataArr[i])
        if (dataArr[i].includes("\r\n")) {
            let temp = dataArr[i].split("\r\n")

            for (let j = 0; j < temp.length; j++) {
                if (temp[j] != '') cleanDataArr.push(temp[j])
            }
        } else {
            cleanDataArr.push(dataArr[i])
        }
    }
    // console.log(cleanDataArr)
}

if (cleanDataArr.length % dataLength != 0) {
    console.log("warning! amount of fields not divisible by length!")
}

const videoArr = calcByVideo()
const partArr = calcByParticipant()

function calcByVideo() {
    let i = 0
    let currentVideoID = cleanDataArr[i + videoIdField]
    let videoDataArr = []
    let newDataRow = []
    while (i < cleanDataArr.length) {
        if (currentVideoID != cleanDataArr[i + videoIdField]) {
            videoDataArr.push(newDataRow)
            newDataRow = []
            currentVideoID = cleanDataArr[i + videoIdField]
        }

        let j = i
        while (i < (j + dataLength)) {
            if (i >= cleanDataArr.length) {
                console.log('ERR RAN OUT OF DATA AT INDEX %d', i)
                break;
            }
            newDataRow.push(cleanDataArr[i])
            i++
        }
        // console.log('a')
    }
    console.log(newDataRow)
    videoDataArr.push(newDataRow)
    return videoDataArr
}

function calcByParticipant() {

}

function calcByCondition() {
    
}