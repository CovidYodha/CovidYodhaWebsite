// import { firebaseConfig } from '../firebase-config';
 var firebaseConfig = {
  apiKey: "AIzaSyCjoFObfrlrNU96eiKUUIyGKYuC_nWzyC4",
  authDomain: "covidyodhawebsite.firebaseapp.com",
  projectId: "covidyodhawebsite",
  storageBucket: "covidyodhawebsite.appspot.com",
  messagingSenderId: "434959698791",
  appId: "1:434959698791:web:e0f9dd590c456744097dc2",
  measurementId: "G-JPN2FFJTK7"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();

// SignIN Function
function signIn() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    const promise = auth.signInWithEmailAndPassword(email.value,password.value);
    promise.catch(e=>alert(e.message));
};

function signOut(){
    auth.signOut();
    alert("SignOut Successfully from System");
  };

  //active user to homepage
  firebase.auth().onAuthStateChanged((user)=>{
    if(user){
      var email = user.email;
      alert("Active user "+email);

    }else{
      // alert("No Active user Found")
    };
  });


  //changing data 
    
// const image = document.getElementById('imageholder');
// const headingnews = document.getElementById('headingnews');
// const contentNews = document.getElementById('contentNews');
// const descriptionNews = document.getElementById('descriptionNews');
  
  function data() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    // document.write(today);

  const imageholder = document.getElementById('imageholder');
  const headingnews = document.getElementById('headingnews');
  const contentNews = document.getElementById('contentNews');
  const descriptionNews = document.getElementById('descriptionNews');

    
    // console.log(image.value);
    userId=today;
    firebase.database().ref('news/' + userId).set({
      date : today,
      image: imageholder.value,
      heading: headingnews.value,
      content: contentNews.value,
      description: descriptionNews.value,
     
      
    });
    
    window.alert('Saved Successfully');
    imageholder.value="";
    headingnews.value="";
    contentNews.value="";
    descriptionNews.value="";

  };
  