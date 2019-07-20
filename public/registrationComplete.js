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

function showLuckyNum(luckyNum=[]) {
    for (i = 0; i < noOfTickets; i++) {
        document.getElementById("write").innerHTML = luckyNum[i] + "\n";
        console.log(luckyNum[i]);
    }

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
function saveLuckyNum(name, icNum, luckyNum=[]) {
    //Reference messages collection
    var messagesRef = firebase.database().ref('luckyDrawNumbers');
    //var newMessageRef = messagesRef.push();
    messagesRef.push({
        luckyNum: luckyNum,
        name: name,
        idNum: icNum
    });
    //newMessageRef.push(newMessageRef);
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
    console.log(day1Num);
    console.log(day2Num);
    var daysNum = [day1Num, day2Num];
    return daysNum;
}

document.addEventListener("DOMContentLoaded", function () {
    //save participants to firebase
    saveMessages(name, membership, guestType, shirt, noOfTickets, icNum);

    document.getElementById("displayName").innerHTML = name + "\n \n";

    document.getElementById("displayIC").innerHTML = icNum + "\n \n";


    var firstTime = 0;
    var luckyNumDay1 = [];
    var luckyNumDay2 = [];
    var generatedNum = [];

    var db = firebase.database();
    const gent = db.ref('luckyDrawNumbers'); 

    //Loop to generate Lucky Numbers
    for (i = 0; i < noOfTickets; i++) {
        generatedNum = randomNumberGenerate();
        console.log(generatedNum);
        luckyNumDay1[i] = generatedNum[0];
        luckyNumDay2[i] = generatedNum[1];
    }

    console.log(luckyNumDay1);
    console.log(luckyNumDay2);

    for (i = 0; i < noOfTickets; i++) {
        //Checks if Day 1 Numbers already exists
        var user = gent.orderByChild('luckyNum').equalTo(luckyNumDay1[i]);
        while (user != null) {
            if (firstTime == 0)
                break;

            generatedNum = randomNumberGenerate();
            luckyNumDay1[i] = generatedNum[0];
            user = gent.orderByChild('luckyNum').equalTo(luckyNumDay1[i]);
            console.log(user);
        }
        //checks if Day 2 Numbers already exists
        var user = gent.orderByChild('luckyNum').equalTo(luckyNumDay2[i]);
        while (user != null) {
            if (firstTime == 0)
                break;

            generatedNum = randomNumberGenerate();
            luckyNumDay2[i] = generatedNum[1];
            user = gent.orderByChild('luckyNum').equalTo(luckyNumDay2[i]);
            console.log(user);
        }

        if (firstTime == 0)
            firstTime++;
    }

    for (i = 0; i < noOfTickets; i++) {
        saveLuckyNum(name, icNum, luckyNumDay1[i]);
        saveLuckyNum(name, icNum, luckyNumDay2[i]);
    }

    showLuckyNum(luckyNumDay1);
    console.log(name);
    console.log(membership);
    console.log(guestType);
    console.log(shirt);
    console.log(noOfTickets);
    console.log(icNum);
    console.log(phoneNum);
});

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
}