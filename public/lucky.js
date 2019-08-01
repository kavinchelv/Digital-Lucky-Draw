//Random number generator
function randomNumberGenerate() {
    return new Promise((resolve) => {
        var day1Num, day2Num;
        day1Num = Math.floor(Math.random() * (20000 - 1 + 1)) + 1;
        day2Num = Math.floor(Math.random() * (40000 - 20001 + 1)) + 20001;
        day1Num = ("00000" + day1Num).slice(-5);
        day2Num = ("00000" + day2Num).slice(-5);
        var daysNum = [day1Num, day2Num];
        resolve(daysNum);
    })
}

//Random number generator
function randomSpecialNumberGenerate() {
    return new Promise((resolve) => {
        var specialNum;
        specialNum = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
        specialNum = ("000" + specialNum).slice(-3);
        resolve(specialNum);
    })
}

//Save Drawn Lucky draw numbers to firebase
function saveDrawnLuckyNum(name, icNum, luckyNum) {
    return new Promise((resolve) => {
            messagesRef = firebase.database().ref('luckyDrawNumbers/Drawn/' + luckyNum);
            messagesRef.set({
                name: name,
                idNum: icNum
            });
        resolve(luckyNum + ' is saved');
    })
}

//Function to check for duplicates on day 1
function checkForDuplicateDay1(luckyNum) {
    return new Promise((resolve) => {
        var db = firebase.database();
        var user = db.ref('luckyDrawNumbers/day1/' + luckyNum);
        var condition;
        console.log('Do me Twice');
        console.log(user);
        user.once("value").then(function (snapshot) {
            console.log(snapshot.exists());
            console.log(snapshot.key);
            if (snapshot.exists()) {
                console.log('Duplicate Detected.');
                condition = 1;
            }
            else {
                console.log('No duplicate Detected.');
                condition = 0
            }
            resolve(condition);
        });
    })
}

//Function to check for duplicates on day 2
function checkForDuplicateDay2(luckyNum) {
    return new Promise((resolve) => {
        var db = firebase.database();
        var user = db.ref('luckyDrawNumbers/day2/' + luckyNum);
        var condition;
        console.log('Do me Twice');
        console.log(user);
        user.once("value").then(function (snapshot) {
            console.log(snapshot.exists());
            console.log(snapshot.val());
            if (snapshot.exists()) {
                console.log('Duplicate Detected.');
                condition = 1;
            }
            else {
                console.log('No duplicate Detected.');
                condition = 0
            }
            resolve(condition);
        });
    })
}

function checkForDrawn(luckyNum) {
    return new Promise((resolve) => {
        var db = firebase.database();
        var user = db.ref('luckyDrawNumbers/Drawn/' + luckyNum);
        var condition;
        console.log('Do me Twice');
        console.log(user);
        user.once("value").then(function (snapshot) {
            console.log(snapshot.exists());
            console.log(snapshot.val());
            if (snapshot.exists()) {
                console.log('Number is Drawn.');
                condition = 1;
            }
            else {
                console.log('Number not Drawn.');
                condition = 0
            }
            resolve(condition);
        });
    })
}

function checkForDuplicateSpecial(luckyNum) {
    return new Promise((resolve) => {
        var db = firebase.database();
        var user = db.ref('luckyDrawNumbers/Special/' + luckyNum);
        var condition;
        console.log('Do me Twice');
        console.log(user);
        user.once("value").then(function (snapshot) {
            console.log(snapshot.exists());
            console.log(snapshot.key);
            if (snapshot.exists()) {
                console.log('Duplicate Detected.');
                condition = 1;
            }
            else {
                console.log('No duplicate Detected.');
                condition = 0
            }
            resolve(condition);
        });
    })
}

async function drawLuckyNumber() {
    return new Promise(async (resolve) => {
        var luckyNumDay1;
        var luckyNumDay2;
        var generatedNum = [];
        var day = localStorage[9];
        var drawnLuckyNum;
        //Loop to generate initial Lucky Number
        generatedNum = await randomNumberGenerate();
        luckyNumDay1 = generatedNum[0];
        luckyNumDay2 = generatedNum[1];
        luckyNumSpecial = await randomSpecialNumberGenerate();
        console.log('Numbers generated');
        if (day == 1) {
            console.log('Day 1 Loop entered')
            var duplicate = await checkForDuplicateDay1(luckyNumDay1);
            var drawn = await checkForDrawn(luckyNumDay1);
            console.log(duplicate);
            if (duplicate == 1 && drawn != 1) {
                drawnLuckyNum = luckyNumDay1;
                var name = await retrieveWinnerName(drawnLuckyNum, day);
                var icNum = await retrieveWinnerId(drawnLuckyNum, day);
                displayLuckyNumbers(drawnLuckyNum, name, icNum);
                saveDrawnLuckyNum(name, icNum, drawnLuckyNum);
            }
            else if (duplicate != 1 || drawn == 1) {
                while (duplicate != 1 || drawn == 1) {
                    console.log('Generating new number...');
                    generatedNum = await randomNumberGenerate();
                    console.log('New number generated.');
                    luckyNumDay1 = generatedNum[0];
                    console.log('New Number: ' + luckyNumDay1);
                    console.log('Checking if new number is duplicate...');
                    duplicate = await checkForDuplicateDay1(luckyNumDay1);
                    drawn = await checkForDrawn(luckyNumDay1);
                    console.log(duplicate + ' OOOOO')
                }
                console.log('Duplicate Checking Done. Saving...');
                drawnLuckyNum = luckyNumDay1;
                var name = await retrieveWinnerName(drawnLuckyNum, day);
                var icNum = await retrieveWinnerId(drawnLuckyNum, day);
                displayLuckyNumbers(drawnLuckyNum, name, icNum);
                saveDrawnLuckyNum(name, icNum, drawnLuckyNum);
            }
        }
        if (day == 2) {
            //Loop to Draw Day 2 Ticket
            console.log('Day 2 Loop entered')
            var duplicate = await checkForDuplicateDay2(luckyNumDay2);
            var drawn = await checkForDrawn(luckyNumDay2);
            console.log(duplicate);
            if (duplicate == 1 && drawn != 1) {
                drawnLuckyNum = luckyNumDay2;
                var name = await retrieveWinnerName(drawnLuckyNum, day);
                var icNum = await retrieveWinnerId(drawnLuckyNum, day);
                displayLuckyNumbers(drawnLuckyNum, name, icNum);
                saveDrawnLuckyNum(name, icNum, drawnLuckyNum);
            }
            else if (duplicate != 1 || drawn == 1) {
                while (duplicate != 1 || drawn == 1) {
                    console.log('Generating new number...');
                    generatedNum = await randomNumberGenerate();
                    console.log('New number generated.');
                    luckyNumDay2 = generatedNum[0];
                    console.log('New Number: ' + luckyNumDay2);
                    console.log('Checking if new number is duplicate...');
                    duplicate = await checkForDuplicateDay2(luckyNumDay2);
                    drawn = await checkForDrawn(luckyNumDay2);
                    console.log(duplicate + ' OOOOO')
                }
                console.log('Duplicate Checking Done. Saving...');
                drawnLuckyNum = luckyNumDay2;
                var name = await retrieveWinnerName(drawnLuckyNum, day);
                var icNum = await retrieveWinnerId(drawnLuckyNum, day);
                displayLuckyNumbers(drawnLuckyNum, name, icNum);
                saveDrawnLuckyNum(name, icNum, drawnLuckyNum);
            }
        }

        if (day == 3) {
            console.log('Special Loop entered')
            var duplicate = await checkForDuplicateSpecial(luckyNumSpecial);
            var drawn = await checkForDrawn(luckyNumSpecial);
            console.log(duplicate);
            if (duplicate != 1 || drawn == 1) {
                while (duplicate != 1 || drawn == 1) {
                    console.log('Generating new number...');
                    luckyNumSpecial = await randomSpecialNumberGenerate();
                    console.log('New number generated.');
                    console.log('New Number: ' + luckyNumSpecial);
                    console.log('Checking if new number is duplicate...');
                    duplicate = await checkForDuplicateSpecial(luckyNumSpecial);
                    drawn = await checkForDrawn(luckyNumSpecial);
                    console.log(duplicate + ' OOOOO');
                }
                console.log('Duplicate Checking Done. Saving...');
                drawnLuckyNum = luckyNumSpecial;
                var name = await retrieveWinnerName(drawnLuckyNum, day);
                var icNum = await retrieveWinnerId(drawnLuckyNum, day);
                displayLuckyNumbers(drawnLuckyNum, name, icNum);
                saveDrawnLuckyNum(name, icNum, drawnLuckyNum);
            }
            else if (duplicate == 1 && drawn != 1) {
                console.log('No duplicates. Saving...');
                drawnLuckyNum = luckyNumSpecial;
                var name = await retrieveWinnerName(drawnLuckyNum, day);
                var icNum = await retrieveWinnerId(drawnLuckyNum, day);
                displayLuckyNumbers(drawnLuckyNum, name, icNum);
                saveDrawnLuckyNum(name, icNum, drawnLuckyNum);
            }
        }
        resolve(drawnLuckyNum);
    })
}

function retrieveWinnerName(luckyNum, day) {
    return new Promise((resolve) => {
        var db = firebase.database();
        if (day == 1) {
            var user = db.ref('luckyDrawNumbers/day1/' + luckyNum);
            console.log(user);
            user.once("value").then(function (snapshot) {
                console.log(snapshot.child('name').val());
                resolve(snapshot.child('name').val());
            });
        }
        else if (day == 2) {
            var user = db.ref('luckyDrawNumbers/day2/' + luckyNum);
            console.log(user);
            user.once("value").then(function (snapshot) {
                console.log(snapshot.child('name').val());
                resolve(snapshot.child('name').val());
            });
        }
        else if (day == 3) {
            var user = db.ref('luckyDrawNumbers/Special/' + luckyNum);
            console.log(user);
            user.once("value").then(function (snapshot) {
                console.log(snapshot.child('name').val());
                resolve(snapshot.child('name').val());
            });
        }
    })
}

function retrieveWinnerId(luckyNum, day) {
    return new Promise((resolve) => {
        var db = firebase.database();
        if (day == 1) {
            var user = db.ref('luckyDrawNumbers/day1/' + luckyNum);
            console.log(user);
            user.once("value").then(function (snapshot) {
                console.log(snapshot.child('idNum').val());
                resolve(snapshot.child('idNum').val());
            });
        }
        else if (day == 2) {
            var user = db.ref('luckyDrawNumbers/day2/' + luckyNum);
            console.log(user);
            user.once("value").then(function (snapshot) {
                console.log(snapshot.child('idNum').val());
                resolve(snapshot.child('idNum').val());
            });
        }
        else if (day == 3) {
            var user = db.ref('luckyDrawNumbers/Special/' + luckyNum);
            console.log(user);
            user.once("value").then(function (snapshot) {
                console.log(snapshot.child('idNum').val());
                resolve(snapshot.child('idNum').val());
            });
        }
    })
}

function displayLuckyNumbers(luckyNumbers, name, icNum) {
    document.getElementById("winnerName").innerHTML = name;
    document.getElementById("luckyNumber").innerHTML = luckyNumbers;
    document.getElementById("icNumber").innerHTML = icNum;
}

document.addEventListener("DOMContentLoaded", async function () {
    var day = localStorage[9];
    var drawnLuckyNum = [];
    var nameArr = [];
    var icNumArr = [];
    for (i = 0; i < 5; i++) {
        drawnLuckyNum[i] = await drawLuckyNumber();
        nameArr[i] = await retrieveWinnerName(drawnLuckyNum[i], day);
        icNumArr[i] = await retrieveWinnerId(drawnLuckyNum[i], day);
    }
    displayLuckyNumbers(drawnLuckyNum, nameArr, icNumArr);

});