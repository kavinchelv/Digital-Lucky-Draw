//Random number generator
function randomNumberGenerate() {
    return new Promise((resolve) => {
        var day1Num, day2Num;
        day1Num = Math.floor(Math.random() * (20000 - 1 + 1)) + 1;
        day2Num = Math.floor(Math.random() * (40000 - 20001 + 1)) + 20001;
        var daysNum = [day1Num, day2Num];
        resolve(daysNum);
    })
}

//Random number generator
function randomSpecialNumberGenerate() {
    return new Promise((resolve) => {
        var specialNum;
        specialNum = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
        resolve(specialNum);
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

function checkForDuplicateSpecial(luckyNum) {
    return new Promise((resolve) => {
        var db = firebase.database();
        var user = db.ref('luckyDrawNumbers/Special/' + luckyNum);
        var condition;
        console.log('Do me Twice');
        console.log(user);
        user.once("value").then(function (snapshot) {
            console.log(snapshot.exists());
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
    var luckyNumDay1;
    var luckyNumDay2;
    var generatedNum = [];
    var day = 3;
    //Loop to generate initial Lucky Number
    generatedNum = await randomNumberGenerate();
    luckyNumDay1 = generatedNum[0];
    luckyNumDay2 = generatedNum[1];
    luckyNumSpecial = await randomSpecialNumberGenerate();
    console.log('Numbers generated');
    if (day == 1) {
        console.log('Day 1 Loop entered')
        var duplicate = await checkForDuplicateDay1(luckyNumDay1);
        console.log(duplicate);
        if (duplicate == 1) {
            var name = await retrieveWinnerName(luckyNumDay1, day)
            displayLuckyNumbers(luckyNumDay1, name);
        }
        else if (duplicate != 1) {
            while (duplicate != 1) {
                console.log('Generating new number...');
                generatedNum = await randomNumberGenerate();
                console.log('New number generated.');
                luckyNumDay1 = generatedNum[0];
                console.log('New Number: ' + luckyNumDay1);
                console.log('Checking if new number is duplicate...');
                duplicate = await checkForDuplicateDay1(luckyNumDay1);
                console.log(duplicate + ' OOOOO')
            }
            console.log('Duplicate Checking Done. Saving...');
            var name = await retrieveWinnerName(luckyNumDay1, day);
            displayLuckyNumbers(luckyNumDay1, name);
        }
    }
    if (day == 2) {
        //Loop to Draw Day 2 Ticket
        console.log('Day 2 Loop entered')
        var duplicate = await checkForDuplicateDay2(luckyNumDay2);
        console.log(duplicate);
        if (duplicate == 1) {
            var name = await retrieveWinnerName(luckyNumDay2, day)
            displayLuckyNumbers(luckyNumDay2, name);
        }
        else if (duplicate != 1) {
            while (duplicate != 1) {
                console.log('Generating new number...');
                generatedNum = await randomNumberGenerate();
                console.log('New number generated.');
                luckyNumDay2 = generatedNum[0];
                console.log('New Number: ' + luckyNumDay2);
                console.log('Checking if new number is duplicate...');
                duplicate = await checkForDuplicateDay2(luckyNumDay2);
                console.log(duplicate + ' OOOOO')
            }
            console.log('Duplicate Checking Done. Saving...');
            var name = await retrieveWinnerName(luckyNumDay2, day);
            displayLuckyNumbers(luckyNumDay2, name);
        }
    }
    if (day == 3) {
        console.log('Special Loop entered')
        var duplicate = await checkForDuplicateSpecial(luckyNumSpecial);
        console.log(duplicate);
        if (duplicate != 1) {
            while (duplicate != 1) {
                console.log('Generating new number...');
                luckyNumSpecial = await randomSpecialNumberGenerate();
                console.log('New number generated.');
                console.log('New Number: ' + luckyNumSpecial);
                console.log('Checking if new number is duplicate...');
                duplicate = await checkForDuplicateSpecial(luckyNumSpecial);
                console.log(duplicate + ' OOOOO')
            }
            console.log('Duplicate Checking Done. Saving...');
            displayLuckyNumbers(luckyNumSpecial, name);
            var name = await retrieveWinnerName(luckyNumSpecial, day);
        }
        else if (duplicate == 1) {
            console.log('No duplicates. Saving...');
            var name = await retrieveWinnerName(luckyNumSpecial, day);
            displayLuckyNumbers(luckyNumSpecial, name);
        }
    }

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

function displayLuckyNumbers(luckyNumbers, name) {
    document.getElementById("winnerName").innerHTML = name;
    document.getElementById("luckyNumber").innerHTML = luckyNumbers;

}

document.addEventListener("DOMContentLoaded", function () {
    drawLuckyNumber();
});