// JavaScript source code
document.addEventListener("DOMContentLoaded", event => {
    const app = Firebase.app;
});
//Reference messages collection
var messagesRef = Firebase.database().ref('Participants');

//Listen for form submit

document.getElementById('registerForm').addEventListener('submit', submitForm);

//function to collect values from the Registration Form
function submitForm(e) {
    e.preventDefault();

    //get values
    var internationalTickets = 6;
    var localTickets = 2;
    var mentorTickets = 2; 
    var noOfTickets = 0;
    var stemShirtTickets = 2;
    var ieeeShirtTickets = 1;
    var committeeTickets = 2;
    var name = getInputVal('Name');
    var membership = document.querySelector('input[name = "Membership"]:checked').value;
    var shirt = document.querySelector('input[name = "Shirt"]:checked').value;
    var guestType = document.querySelector('input[name = "Type"]:checked').value;

    //Gives no of tickets based on membership type
    if (membership == 'International')
        noOfTickets += internationalTickets;
    else if (membership == 'Local')
        noOfTickets += localTickets;
    else
        noOfTickets += nonMemberTickets;
    //Gives no of tickets based on shirt
    if (shirt == 'STEM')
        noOfTickets += stemShirtTickets;
    else if (shirt == 'IEEE')
        noOfTickets += ieeeShirtTickets;
   
    //Gives no of tickets based on guest type
    if (guestType == 'Committee')
        noOfTickets += committeeTickets;
    else if (guestType == 'mentorHelper')
        noOfTickets += mentorTickets;

    console.log(name);
    console.log(membership);
    console.log(guestType);
    console.log(shirt);
    console.log(noOfTickets);
    //save message
    saveMessages(name, membership, guestType, shirt, noOfTickets)
}

//Function to get form values (Text Boxes Only)
function getInputVal(id) {
    return document.getElementById(id).value;
}

//Save to firebase
function saveMessages(name, membership, guestType, shirt, noOfTickets) {
    var newKey = ref.push().key();
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        name: name,
        membership: membership,
        guestType: guestType,
        shirt: shirt,
        noOfTickets: noOfTickets
    });
    newMessageRef.push(newMessageRef);
}