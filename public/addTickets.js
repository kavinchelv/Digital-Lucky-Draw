document.getElementById('registerForm').addEventListener('submit', submitForm);

//function to collect values from the add ticket form
async function submitForm(e) {
    e.preventDefault();

    //get values
    var addTicketnum = getInputVal('addTicketNum');
    var icNum = getInputVal('icNum');
    var name = getInputVal('name');

    //Removes - and spaces from identification number
    icNum = icNum.replace(/-/g, "");
    icNum = icNum.replace(/ /g, "");

    console.log(addTicketnum);
    console.log(icNum);

    var luckyNumDay1 = [];
    var luckyNumDay2 = [];
    var generatedNum = [];
    var day = 2;

    //Loop to generate initial Lucky Numbers
    for (i = 0; i < addTicketnum; i++) {
        generatedNum = await randomNumberGenerate();
        luckyNumDay1[i] = generatedNum[0];
        luckyNumDay2[i] = generatedNum[1];
        console.log('Numbers generated')
    }
    //save message
    updateTicketNum(addTicketnum, name);

    //Loop to check and create/save Day 1 Tickets
    for (i = 0; i < addTicketnum; i++) {
        console.log('Day 1 Loop entered')
        var duplicate = await checkForDuplicateDay1(luckyNumDay1[i]);
        console.log(duplicate);
        if (duplicate == 1) {
            while (duplicate == 1) {
                console.log('Generating new number...');
                generatedNum = await randomNumberGenerate();
                console.log('New number generated.');
                luckyNumDay1[i] = generatedNum[0];
                console.log('New Number: ' + luckyNumDay1[i]);
                console.log('Checking if new number is duplicate...');
                duplicate = await checkForDuplicateDay1(luckyNumDay1[i]);
                console.log(duplicate + ' OOOOO')
            }
            console.log('Duplicate Checking Done. Saving...');
            await saveLuckyNum(name, icNum, 1, luckyNumDay1[i]);
        }
        else if (duplicate != 1) {
            console.log('No duplicates. Saving...');
            await saveLuckyNum(name, icNum, 1, luckyNumDay1[i]);
        }
    }

    //Loop to check and create/save Day 2 Tickets
    for (i = 0; i < addTicketnum; i++) {
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

    const luckyNumbers = await checkTicketNum(icNum, day);
    displayLuckyNumbers(luckyNumbers);
}

//Function to get form values (Text Boxes Only)
function getInputVal(id) {
    return document.getElementById(id).value;
}

function displayLuckyNumbers(luckyNumbers) {
    document.getElementById("numbers").innerHTML = luckyNumbers;

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
        resolve(luckyNum + ' is saved');
    })
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
    document.getElementById("luckyNumbers").innerHTML = 'Loading...';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("luckyNumbers").innerHTML = 'Loading...';
    }
}

//Function that updates participants ticket count if they get more tickets
function updateTicketNum(addTicketNum, name) {
    var db = firebase.database();
    const gent = db.ref('Participants/' + name);

    //Finding the participant to be updated 
    console.log(gent);

    gent.once("value", function (snapshot) {
        var newNoOfTickets = (snapshot.val() && snapshot.val().noOfTickets); //retrieves current number of tickets
        newNoOfTickets = Number(newNoOfTickets) + Number(addTicketNum);//adds tickets to current ticket count
        snapshot.ref.update({ noOfTickets: newNoOfTickets });//Updates the ticket count to firebase
        console.log(newNoOfTickets);
    });
}

function checkTicketNum(icNum, day) {
    return new Promise((resolve) => {
        var db = firebase.database();
        var luckyNumbers = [];
        if (day == 1) {
            var gent = db.ref('luckyDrawNumbers/day1');
            //Finding the participant to be retrieved 
            var user = gent.orderByChild('idNum').equalTo(icNum);
            user.once("value", function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    console.log(snapshot.numChildren())
                    var noOfTickets = snapshot.numChildren();
                    var curKey = childSnapshot.key;//Finds the key of the participant to be updated
                    if (localStorage[0] < noOfTickets) {
                        luckyNumbers[localStorage[0]] = curKey;
                        console.log(curKey);
                        console.log(localStorage[0]);
                        localStorage[0]++;
                    }
                    if (localStorage[0] == noOfTickets) {
                        localStorage[0] = 0;
                        resolve(luckyNumbers);
                    }
                });
            });
        }
        if (day == 2) {
            var gent = db.ref('luckyDrawNumbers/day2');
            //Finding the participant to be retrieved 
            var user = gent.orderByChild('idNum').equalTo(icNum);
            user.once("value", function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    console.log(snapshot.numChildren())
                    var noOfTickets = snapshot.numChildren();
                    var curKey = childSnapshot.key;//Finds the key of the participant to be updated
                    if (localStorage[0] < noOfTickets) {
                        luckyNumbers[localStorage[0]] = curKey;
                        console.log(curKey);
                        console.log(localStorage[0]);
                        localStorage[0]++;
                    }
                    if (localStorage[0] == noOfTickets) {
                        localStorage[0] = 0;
                        resolve(luckyNumbers);
                    }
                });
            });
        }

    })
}