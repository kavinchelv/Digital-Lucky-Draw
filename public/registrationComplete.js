const name = localStorage[0];
const icNum = localStorage[1];
const noOfTickets = localStorage[2];
const membership = localStorage[3];
const guestType = localStorage[4];
const shirt = localStorage[5];
var specialTicket = localStorage[6];

function showLuckyNum(luckyNum) {
        document.getElementById("write").innerHTML = luckyNum;
}

//Save Participants to firebase
function saveMessages(name, membership, guestType, shirt, noOfTickets, icNum) {
    var messagesRef = firebase.database().ref('Participants/' + name);
    messagesRef.set({
        icNum: icNum,
        membership: membership,
        guestType: guestType,
        shirt: shirt,
        noOfTickets: noOfTickets
    });
}

//Save Lucky draw numbers to firebase
function saveLuckyNum(name, icNum, day, luckyNum) {
    return new Promise((resolve) => {
        if (day == 1) {
            var messagesRef = firebase.database().ref('luckyDrawNumbers/day1/' + luckyNum);
            messagesRef.set({
                name: name,
                idNum: icNum
            });
        }
        if (day == 2) {
            messagesRef = firebase.database().ref('luckyDrawNumbers/day2/' + luckyNum);
            messagesRef.set({
                name: name,
                idNum: icNum
            });
        }
        if (day == 3) {
            messagesRef = firebase.database().ref('luckyDrawNumbers/Special/' + luckyNum);
            messagesRef.set({
                name: name,
                idNum: icNum
            });
        }
        resolve(luckyNum + ' is saved');
    })
}

//Random number generator
function randomNumberGenerate() {
    return new Promise((resolve) => {
        var day1Num, day2Num;
        day1Num = Math.floor(Math.random() * (20000 - 1 + 1)) + 1;
        day2Num = Math.floor(Math.random() * (40000 - 20001 + 1)) + 20001;
        console.log(day1Num, day2Num);
        day1Num = ("00000" + day1Num).slice(-5);
        day2Num = ("00000" + day2Num).slice(-5);
        var daysNum = [day1Num, day2Num];
        console.log(daysNum);
        resolve(daysNum);
    })
}

//Random number generator
function randomSpecialNumberGenerate() {
    return new Promise((resolve) => {
        var specialNum;
        specialNum = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
        specialNum = ("000" + specialNum).slice(-3);
        console.log(specialNum);
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

function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}

document.addEventListener("DOMContentLoaded", async function () {
    //save participants to firebase
    saveMessages(name, membership, guestType, shirt, noOfTickets, icNum);

    document.getElementById("displayName").innerHTML = name + "\n \n";
    document.getElementById("displayIC").innerHTML = icNum + "\n \n";

    var luckyNumDay1 = [];
    var luckyNumDay2 = [];
    var generatedNum = [];

    //Loop to generate initial Lucky Numbers
    for (i = 0; i < noOfTickets; i++) {
        generatedNum = await randomNumberGenerate();
        luckyNumDay1[i] = generatedNum[0];
        luckyNumDay2[i] = generatedNum[1];
        console.log('Numbers generated')
    }

    //Loop to check and create/save Day 1 Tickets
    //for (i = 0; i < noOfTickets; i++) {
    //    console.log('Day 1 Loop entered')
    //    var duplicate = await checkForDuplicateDay1(luckyNumDay1[i]);
    //    console.log(duplicate);
    //    if (duplicate == 1) {
    //        while (duplicate == 1) {
    //            console.log('Generating new number...');
    //            generatedNum = await randomNumberGenerate();
    //            console.log('New number generated.');
    //            luckyNumDay1[i] = generatedNum[0];
    //            console.log('New Number: ' + luckyNumDay1[i]);
    //            console.log('Checking if new number is duplicate...');
    //            duplicate = await checkForDuplicateDay1(luckyNumDay1[i]);
    //            console.log(duplicate + ' OOOOO')
    //        }
    //        console.log('Duplicate Checking Done. Saving...');
    //        await saveLuckyNum(name, icNum, 1, luckyNumDay1[i]);
    //    }
    //    else if (duplicate != 1) {
    //        console.log('No duplicates. Saving...');
    //        await saveLuckyNum(name, icNum, 1, luckyNumDay1[i]);
    //    }
    //}
    
    //Loop to check and create/save Day 2 Tickets
    for (i = 0; i < noOfTickets; i++) {
        console.log('Day 2 Loop entered')
        var duplicate = await checkForDuplicateDay2(luckyNumDay2[i]);
        console.log(duplicate);
        if (duplicate == 1) {
            while (duplicate == 1) {
                console.log('Generating new number...');
                generatedNum = await randomNumberGenerate();
                console.log('New number generated.');
                luckyNumDay2[i] = generatedNum[1];
                console.log('New Number: ' + luckyNumDay2[i]);
                console.log('Checking if new number is duplicate...');
                duplicate = await checkForDuplicateDay2(luckyNumDay2[i]);
                console.log(duplicate + ' OOOOO')
            }
            console.log('Duplicate Checking Done. Saving...');
            await saveLuckyNum(name, icNum, 2, luckyNumDay2[i]);
        }
        else if (duplicate != 1) {
            console.log('No duplicates. Saving...');
            await saveLuckyNum(name, icNum, 2, luckyNumDay2[i]);
        }
    }

    var luckyNumSpecial = await randomSpecialNumberGenerate();
    if (specialTicket == 1) {
        console.log('Special Loop entered')
        var duplicate = await checkForDuplicateSpecial(luckyNumSpecial);
        console.log(duplicate);
        if (duplicate == 1) {
            while (duplicate == 1) {
                console.log('Generating new number...');
                luckyNumSpecial = await randomSpecialNumberGenerate();
                console.log('New number generated.');
                console.log('New Number: ' + luckyNumSpecial);
                console.log('Checking if new number is duplicate...');
                duplicate = await checkForDuplicateSpecial(luckyNumSpecial);
                console.log(duplicate + ' OOOOO')
            }
            console.log('Duplicate Checking Done. Saving...');
            await saveLuckyNum(name, icNum, 3, luckyNumSpecial);
        }
        else if (duplicate != 1) {
            console.log('No duplicates. Saving...');
            await saveLuckyNum(name, icNum, 3, luckyNumSpecial);
        }
    }

    showLuckyNum(luckyNumDay2);

    if (specialTicket == 1) {
        document.getElementById("specialDisplay").innerHTML = 'Special Lucky Draw Number:';
        document.getElementById("special").innerHTML = luckyNumSpecial;
    }

    console.log(name);
    console.log(membership);
    console.log(guestType);
    console.log(shirt);
    console.log(noOfTickets);
    console.log(icNum);
    localStorage[6] = 0;
});