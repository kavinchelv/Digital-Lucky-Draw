
document.getElementById('registerForm').addEventListener('submit', submitForm);

//function to collect values from the add ticket form
function submitForm(e) {
    e.preventDefault();

    //get values
    var addTicketnum = getInputVal('addTicketNum');
    var icNum = getInputVal('icNum');

    //Removes - and spaces from identification number
    icNum = icNum.replace(/-/g, "");
    icNum = icNum.replace(/ /g, "");

    console.log(addTicketnum);
    console.log(icNum);
    //save message
    updateTicketNum(addTicketnum, icNum);
}

//Function to get form values (Text Boxes Only)
function getInputVal(id) {
    return document.getElementById(id).value;
}

//Function that updates participants ticket count if they get more tickets
function updateTicketNum(addTicketNum, icNum) {
    var db = firebase.database();
    const gent = db.ref('Participants');

    //Finding the participant to be updated 
    var user = gent.orderByChild('idNum').equalTo(icNum);
    console.log(gent);

    user.once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            var curKey = child.key;//Finds the key of the participant to be updated
            console.log(curKey);
            return firebase.database().ref('Participants/' + curKey).once('value').then(function(snapshot) {
                var newNoOfTickets = (snapshot.val() && snapshot.val().noOfTickets); //retrieves current number of tickets
                newNoOfTickets = Number(newNoOfTickets) + Number(addTicketNum);//adds tickets to current ticket count
                snapshot.ref.update({ noOfTickets: newNoOfTickets });//Updates the ticket count to firebase
                console.log(newNoOfTickets);
            });
        });
    });
}