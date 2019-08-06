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
                    luckyNumDay2 = generatedNum[1];
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
    //document.getElementById("winnerName").innerHTML = name;
    //document.getElementById("odometer").innerHTML = luckyNumbers;
    //document.getElementById("icNumber").innerHTML = icNum;
}

document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById("topbar").innerHTML = 'Loading';
    localStorage.deleteArray('drawnLuckyNums');
    localStorage.deleteArray('nameArrs');
    localStorage.deleteArray('icNumArrs');
    var day = localStorage[9];
    var drawnLuckyNum = [];
    var nameArr = [];
    var icNumArr = [];
    for (i = 0; i < 15; i++) {


        document.getElementById("topbar").innerHTML = 'Loading';

        drawnLuckyNum[i] = await drawLuckyNumber();
        localStorage.pushArrayItem('drawnLuckyNums', drawnLuckyNum[i]);

        document.getElementById("topbar").innerHTML = 'Loading.';

        nameArr[i] = await retrieveWinnerName(drawnLuckyNum[i], day);
        localStorage.pushArrayItem('nameArrs', nameArr[i]);

        document.getElementById("topbar").innerHTML = 'Loading..';

        icNumArr[i] = await retrieveWinnerId(drawnLuckyNum[i], day);
        localStorage.pushArrayItem('icNumArrs', icNumArr[i]);

        document.getElementById("topbar").innerHTML = 'Loading...';
        document.getElementById("winnerName").innerHTML = i + 1;
    }
    document.getElementById("topbar").innerHTML = 'Are You Ready?';
    console.log(drawnLuckyNum, nameArr, icNumArr);
    localStorage[1] = 0;
});

//Fetch the array
Storage.prototype.getArray = function (arrayName) {
    var thisArray = [];
    var fetchArrayObject = this.getItem(arrayName);
    if (typeof fetchArrayObject !== 'undefined') {
        if (fetchArrayObject !== null) { thisArray = JSON.parse(fetchArrayObject); }
    }
    return thisArray;
}

//Save the array
Storage.prototype.pushArrayItem = function (arrayName, arrayItem) {
    var existingArray = this.getArray(arrayName);
    existingArray.push(arrayItem);
    this.setItem(arrayName, JSON.stringify(existingArray));
}

//Remove an array
Storage.prototype.deleteArray = function (arrayName) {
    this.removeItem(arrayName);
}

document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
        document.getElementById("topbar").innerHTML = 'Abandon Hope All Ye Who Enter Here';
        document.getElementById("winnerName").innerHTML = '';
        odometer.innerHTML = 99999;
        //your code
        var drawnLuckyNum = localStorage.getArray('drawnLuckyNums');
        //var drawnLuckyNum = [11111, 22222, 33333, 44444, 12345, 67890, 55555, 66666, 77777, 88888, 99999, 00000]
        console.log(drawnLuckyNum);
        var nameArr = localStorage.getArray('nameArrs');
        //var nameArr = ['aaaaa', 'bbbbb', 'ccccc', 'ddddd', 'eeeee', 'fffff', 'ggggg', 'hhhhhh', 'iiiiii', 'jjjjj', 'kkkkkk', 'lsdjakh']
        console.log(nameArr);
        var icNumArr = localStorage.getArray('icNumArrs');
        console.log(icNumArr);
        var index = Number(localStorage[1]);

        if (drawnLuckyNum[index] != undefined) {

            setTimeout(function () {
                odometer.innerHTML = drawnLuckyNum[index];
            }, 1000);

            setTimeout(function () {
                document.getElementById("winnerName").innerHTML = nameArr[index];
            }, 3000);

            setTimeout(function () {
                document.getElementById("topbar").innerHTML = 'Congratulations!';
            }, 3000);

            console.log(drawnLuckyNum[index]);
        }
        else {
            document.getElementById("topbar").innerHTML = 'That\'s all folks';
            odometer.innerHTML = 58008;
            document.getElementById("winnerName").innerHTML = '';
        }
        console.log(index);
        localStorage[1] = Number(localStorage[1]) + 1;
    }
}

window.odometerOptions = {
    auto: false, // Don't automatically initialize everything with class 'odometer'
    selector: '.my-numbers', // Change the selector used to automatically find things to be animated
    format: '(,ddd).ddd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
    duration: 5000, // Change how long the javascript expects the CSS animation to take
    theme: 'car', // Specify the theme (if you have more than one theme css file on the page)
    animation: 'count' // Count is a simpler animation method which just increments the value,
    // use it when you're looking for something more subtle.
};
