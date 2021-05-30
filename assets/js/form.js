function myFunc() {
    var uname = document.contact.name.value;
    var email = document.contact.email.value;
    var message = document.contact.message.value;
    if (uname === "" || email === "" || message === "") {
        alert("Please fill the required field");
        return false;
    }
    else {
        alert('Thank you for contacting us');
        return true;
    }
}