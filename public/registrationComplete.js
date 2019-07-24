//const urlParams = new URLSearchParams(window.location.search);
//const name = urlParams.get('name');
//const icNum = urlParms.get('icNum');
//const noOfTickets = urlParams.get('noOfTickets');

const name = localStorage[0];
const icNum = localStorage[1];
const noOfTickets = localStorage[2];
const membership = localStorage[3];
const guestType = localStorage[4];
const shirt = localStorage[5];

function showLuckyNum(luckyNum) {
        document.getElementById("write").innerHTML = luckyNum;
}

//Save Participants to firebase
function saveMessages(name, membership, guestType, shirt, noOfTickets, icNum) {
    var messagesRef = firebase.database().ref('Participants');
    messagesRef.push({
        name: name,
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
            var messagesRef = firebase.database().ref('luckyDrawNumbers/day1');
            messagesRef.push({
                luckyNum: luckyNum,
                name: name,
                idNum: icNum
            });
        }
        if (day == 2) {
            messagesRef = firebase.database().ref('luckyDrawNumbers/day2');
            messagesRef.push({
                luckyNum: luckyNum,
                name: name,
                idNum: icNum
            });
        }
        resolve(luckyNum + ' is saved');
    })
}


function randomNumberGenerate() {
    return new Promise((resolve) => {
        var day1Num, day2Num;
        day1Num = Math.floor(Math.random() * (20000 - 1 + 1)) + 1;
        day2Num = Math.floor(Math.random() * (40000 - 20001 + 1)) + 20001;
        var daysNum = [day1Num, day2Num];
        resolve(daysNum);
    })
}

function checkForDuplicate(luckyNum) {
    return new Promise((resolve) => {
        var db = firebase.database();
        var gent = db.ref('luckyDrawNumbers/day1');
        var user = gent.orderByChild('luckyNum').equalTo(luckyNum);
        var condition;
        user.once("value").then(function (snapshot) {
            snapshot.forEach(async function (childSnapshot) {
                var curLuckyNum = await childSnapshot.child('luckyNum').val();
                if (curLuckyNum == luckyNum) {
                    console.log(curLuckyNum);
                    console.log(luckyNum);
                    console.log('Duplicate Detected.');
                    condition = 1;
                }
                else {
                    console.log('No duplicate Detected.');
                    condition = 0
                }
                resolve(condition);
            });
        }); 
    })
}

document.addEventListener("DOMContentLoaded", async function () {
    //save participants to firebase
    saveMessages(name, membership, guestType, shirt, noOfTickets, icNum);

    document.getElementById("displayName").innerHTML = name + "\n \n";
    document.getElementById("displayIC").innerHTML = icNum + "\n \n";

    var luckyNumDay1 = [];
    var luckyNumDay2 = [];
    var generatedNum = [];
    //var db = firebase.database();

    //Loop to generate initial Lucky Numbers
    for (i = 0; i < noOfTickets; i++) {
        var generatedNum = await randomNumberGenerate();
        luckyNumDay1[i] = generatedNum[0];
        luckyNumDay2[i] = generatedNum[1];
        console.log('Numbers generated')
    }

    //Loop to check and create/save Day 1 Tickets
    for (i = 0; i < noOfTickets; i++) {
        luckyNumDay1[i] = 13924;
        console.log('Day 1 Loop entered')
        var duplicate = await checkForDuplicate(luckyNumDay1[i]);
        console.log(duplicate);
        if (duplicate == 1) {
            while (duplicate == 1) {
                console.log('Generating new number...');
                generatedNum = await randomNumberGenerate();
                console.log('New number generated.');
                luckyNumDay1[i] = generatedNum[0];
                console.log('Checking if new number is duplicate...');
                var duplicate = await checkForDuplicate(luckyNumDay1[i]);
            }

            console.log('Duplicate Checking Done. Saving...');
            await saveLuckyNum(name, icNum, 1, luckyNumDay1[i]);
        }
        if (duplicate != 1)
            console.log('No duplicates. Saving...');
            await saveLuckyNum(name, icNum, 1, luckyNumDay1[i]);
    }
    
    //Loop to check and create/save Day 2 Tickets
    for (i = 0; i < noOfTickets; i++) {
        try {
            var duplicate = await checkForDuplicate(luckyNumDay2[i]);
            while (duplicate == 1) {
                generatedNum = await randomNumberGenerate();
                luckyNumDay2[i] = generatedNum[0];
                duplicate = await checkForDuplicate(luckyNumDay2[i]);
            }
            await saveLuckyNum(name, icNum, 2, luckyNumDay2[i]);

        } catch (err) {
            console.log(err);
            await saveLuckyNum(name, icNum, 2, luckyNumDay2[i]);
        }
    }


           /* for await (var i of asyncGenerator()) {
                
                localStorage[6] = luckyNumDay1[i];

                if (firstTimeDay1 == 1) {
                    user.once("value").then(function (snapshot) {
                        snapshot.forEach(function (childSnapshot) {
                            luckyNumDay1[i] = localStorage[6];
                            var key = childSnapshot.key;
                            var curLuckyNum = childSnapshot.child('luckyNum').val();
                            console.log(curLuckyNum + "this is test");
                            console.log(key);
                            console.log(luckyNumDay1[i]);
                            while (curLuckyNum == luckyNumDay1[i]) {
                                console.log(curLuckyNum);
                                console.log(luckyNumDay1[i]);
                                console.log('Duplicate Detected');
                                var generatedNum = randomNumberGenerate();
                                luckyNumDay1[i] = generatedNum[0];
                                localStorage[6] = luckyNumDay1[i];
                            }
                            saveLuckyNum(name, icNum, 1, luckyNumDay1[i]);
                        });
                    });
                    firstTimeDay1 = 0;

                }

                else {
                    var day = 1;
                    //Checks if Day 1 Numbers already exists
                    var gent = db.ref('luckyDrawNumbers/day1');
                    var user = gent.orderByChild('luckyNum').equalTo(luckyNumDay1[i]);
                    console.log(luckyNumDay1[i]);
                    user.once("value").then(function (snapshot) {
                        snapshot.forEach(function (childSnapshot) {
                            luckyNumDay1[i] = localStorage[6];
                            var key = childSnapshot.key;
                            var curLuckyNum = childSnapshot.child('luckyNum').val();
                            console.log(curLuckyNum + "this is test");
                            console.log(key);
                            console.log(luckyNumDay1[i]);
                            while (curLuckyNum == luckyNumDay1[i]) {
                                console.log(curLuckyNum);
                                console.log(luckyNumDay1[i]);
                                console.log('Duplicate Detected');
                                var generatedNum = randomNumberGenerate();
                                luckyNumDay1[i] = generatedNum[0];
                                localStorage[6] = luckyNumDay1[i];
                            }
                            saveLuckyNum(name, icNum, 1, luckyNumDay1[i]);
                            console.log(localStorage[6] + ' is the current number');

                        });
                        luckyNumDay1[i] = localStorage[6];
                        console.log(luckyNumDay1[i] + ' is the number after the rerandomisaton');
                    });


                }
                //checks if Day 2 Numbers already exists
                var gent = db.ref('luckyDrawNumbers/day2');
                var user = gent.orderByChild('luckyNum').equalTo(luckyNumDay2[i]);
                user.once('value', function (snapshot) {
                    snapshot.forEach(function (child) {
                        var curKey = child.key;//Finds the key of the participant to be updated
                        console.log(curKey);
                        firebase.database().ref('luckyDrawNumbers/day2/' + curKey).once('value').then(function (snapshot) {
                            var curLuckyNum = (snapshot.val() && snapshot.val().luckyNum); //retrieves current number of tickets
                            while (luckyNumDay2[i] == curLuckyNum) {
                                console.log('Duplicate Detected');
                                console.log(curLuckyNum);
                                generatedNum = randomNumberGenerate();
                                luckyNumDay2[i] = generatedNum[1];
                            }
                        });
                    });
                });
            }*/

            showLuckyNum(luckyNumDay1);
            console.log(name);
            console.log(membership);
            console.log(guestType);
            console.log(shirt);
            console.log(noOfTickets);
            console.log(icNum);
});