// JavaScript source code

//Function to get form values (Text Boxes Only)
function getInputVal(id) {
    return document.getElementById(id).value;
}

//Listen for form submit
document.getElementById('registerForm').addEventListener('submit', submitForm);

//function to collect values from the Registration Form
function submitForm(e) {
    e.preventDefault();

    //get values
    var internationalTickets = 6;
    var localTickets = 2;
    var mentorTickets = 1;
    var nonMemberTickets = 0;
    var noOfTickets = 0;
    var specialTickets = 0;
    var stemShirtTickets = 2;
    var ieeeShirtTickets = 1;
    var committeeTickets = 2;
    var name = getInputVal('Name');
    var membership = document.querySelector('input[name = "Membership"]:checked').value;
    var shirt = document.querySelector('input[name = "Shirt"]:checked').value;
    var guestType = document.querySelector('input[name = "Type"]:checked').value;
    var stamps = document.querySelector('input[name = "Stamps"]:checked').value;
    var day = document.querySelector('input[name = "Day"]:checked').value;
    var phoneNum = getInputVal('phoneNum');
    var icNum = getInputVal('icNum');

    //Removes - and spaces from identification number
    icNum = icNum.replace(/-/g, "");
    icNum = icNum.replace(/ /g, "");

    //Remove "-", "+" and spaces from phone number
    phoneNum = phoneNum.replace(/-/g, "");
    phoneNum = phoneNum.replace(/ /g, "");
    phoneNum = phoneNum.replace(/\+/g, "");

    //Gives no of tickets based on membership type
    if (membership == 'International') {
        noOfTickets += internationalTickets;
        specialTickets++;
    }
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

    //Gives no of tickets based on the number of stamps collected
    if (stamps == 6)
        noOfTickets++;
    else if (stamps == 12)
        noOfTickets += 2;
    else if (stamps == 18)
        noOfTickets += 3;



    console.log(name);
    console.log(membership);
    console.log(guestType);
    console.log(shirt);
    console.log(noOfTickets);
    console.log(icNum);
    console.log(phoneNum);
    localStorage[0] = name;
    localStorage[1] = icNum;
    localStorage[2] = noOfTickets;
    localStorage[3] = membership;
    localStorage[4] = guestType;
    localStorage[5] = shirt;
    localStorage[6] = specialTickets;
    localStorage[7] = day;
    redirect();
}

function redirect() {
    document.location.href = "./registrationComplete.html";
}