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
    //Reference messages collection
    var messagesRef = firebase.database().ref('Participants');
    messagesRef.push({
        name: name,
        icNum: icNum,
        membership: membership,
        guestType: guestType,
        shirt: shirt,
        noOfTickets: noOfTickets
    });
    //newMessageRef.push(newMessageRef);
}

//Save Lucky draw numbers to firebase
function saveLuckyNum(name, icNum, day, luckyNum) {
    //Reference messages collection
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
}

function checkLuckyNum(addTicketNum, luckyNum) {
    var db = firebase.database();
    const gent = db.ref('luckyDrawNumbers');

    // 
    var user = gent.orderByChild('luckyNum').equalTo(luckyNum);
    console.log(gent);

    user.once("user_added", function (snapshot) {
        snapshot.forEach(function (child) {
            var curKey = child.key;//Finds the key of the participant to be updated
            console.log(curKey);
            return firebase.database().ref('luckyDrawNumbers/' + curKey).once('value').then(function (snapshot) {
                var curLuckyNum = (snapshot.val() && snapshot.val().luckyNum); //retrieves current lucky draw number
                newNoOfTickets = Number(newNoOfTickets) + Number(addTicketNum);//adds tickets to current ticket count
                console.log(newNoOfTickets);
            });
        });
    });
}

function randomNumberGenerate() {
    var day1Num, day2Num;
    day1Num = Math.floor(Math.random() * (20000 - 1 + 1)) + 1;
    day2Num = Math.floor(Math.random() * (40000 - 20001 + 1)) + 20001;
    var daysNum = [day1Num, day2Num];
    return daysNum;
}

document.addEventListener("DOMContentLoaded", function () {
    //save participants to firebase
    saveMessages(name, membership, guestType, shirt, noOfTickets, icNum);

    document.getElementById("displayName").innerHTML = name + "\n \n";
    document.getElementById("displayIC").innerHTML = icNum + "\n \n";

    var luckyNumDay1 = [];
    var luckyNumDay2 = [];
    var generatedNum = [];
    var firstTimeDay1 = 1;
    var firstTimeDay2 = 1;
    var db = firebase.database();
    

    //Loop to generate Lucky Numbers
    for (i = 0; i < noOfTickets; i++) {
        generatedNum = randomNumberGenerate();
        luckyNumDay1[i] = generatedNum[0];
        luckyNumDay2[i] = generatedNum[1];
    }
    

    for (i = 0; i < noOfTickets; i++) {
        luckyNumDay1[i] = 13924;
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
    }

    for(i = 0; i < noOfTickets; i++) {
        saveLuckyNum(name, icNum, luckyNumDay1[i], luckyNumDay2[i]);
    }

    showLuckyNum(luckyNumDay1);
    console.log(name);
    console.log(membership);
    console.log(guestType);
    console.log(shirt);
    console.log(noOfTickets);
    console.log(icNum);
});
/*
function toggleStar(postRef, uid) {
    postRef.transaction(function (post) {
        if (post) {
            if (post.stars && post.stars[uid]) {
                post.starCount--;
                post.stars[uid] = null;
            }
            else {
                post.starCount++;
                if (!post.stars) {
                    post.stars = {};
                }
                post.stars[uid] = true;
            }
        }
        return post;
    });
}*/