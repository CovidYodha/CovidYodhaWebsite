import { firebaseConfig } from '../firebase-config';

firebaseConfig.initializeApp(firebaseConfig)

const auth = firebase.auth()

// SignIN Function
function signIn() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    const promise = auth.signInWithEmailAndPassword(email.value,password.value);
    promise.catch(e=>alert(e.message));
}

function signOut(){
    auth.signOut();
    alert("SignOut Successfully from System");
  }

  //active user to homepage
  firebase.auth().onAuthStateChanged((user)=>{
    if(user){
      var email = user.email;
      alert("Active user "+email);

    }else{
      // alert("No Active user Found")
    }
  })