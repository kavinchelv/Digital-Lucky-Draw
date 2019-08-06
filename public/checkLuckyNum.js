document.getElementById('registerForm').addEventListener('submit', submitForm);
localStorage[0] = 0;
var luckyNumbers = [];
//function to collect values from the add ticket form
async function submitForm(e) {
    e.preventDefault();

    //get values
    var icNum = getInputVal('name');
    var day = document.querySelector('input[name = "Day"]:checked').value;
    //Removes - and spaces from identification number

    console.log(icNum);
    //save message
    const luckyNumbers = await checkTicketNum(icNum, day);
    console.log(luckyNumbers);
    displayLuckyNumbers(luckyNumbers);
}

//Function to get form values (Text Boxes Only)
function getInputVal(id) {
    return document.getElementById(id).value;
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
function checkTicketNum(icNum, day) {
    return new Promise((resolve) => {
        var db = firebase.database();
        if (day == 1) {
            var gent = db.ref('luckyDrawNumbers/day1');
            //Finding the participant to be retrieved 
            var user = gent.orderByChild('name').equalTo(icNum);
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
            var user = gent.orderByChild('name').equalTo(icNum);
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

function displayLuckyNumbers(luckyNumbers) {
    document.getElementById("luckyNumbers").innerHTML = luckyNumbers;
}