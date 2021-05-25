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
console.log("huu");

function email() {
    var cuser = auth.currentUser;
    console.log(cuser);
    if (cuser != null) {
        console.log(cuser);
        var u_email = cuser.email;
        document.getElementById('uemail').innerHTML = u_email;
    }
}


// SignIN Function




function signIn() {
    console.log('hii');
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;

            console.log(user);

            window.location.assign("../AdminDashboard/admindashboard.html");
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(email.value);
            console.log(errorCode);
            window.alert(errorMessage);

        })
        // var email = document.getElementById("email");
        // var password = document.getElementById("password");
        // const promise = auth.signInWithEmailAndPassword(email.value,password.value);
        // promise.catch(e=>alert(e.message));
};

function signOut() {
    auth.signOut();
    alert("SignOut Successfully from System");
    window.location.assign("../../index.html");
};

//active user to homepage
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var email = user.email;
        document.getElementById('uemail').innerHTML = email;

        // alert("Active user "+email);

    } else {
        // alert("No Active user Found")
    };
});














let database = firebase.firestore();





function data() {
    let imageholder = document.getElementById('imageholder').value;
    let headingnews = document.getElementById('headingnews').value;
    let contentNews = document.getElementById('contentNews').value;
    let descriptionNews = document.getElementById('descriptionNews').value;



    // for(i=53;i>48;i--){

    database.collection('news').doc('5').get().
    then(function(doc) {
        // console.log(doc.data().image)
        // console.log(image.src);

        var imgnews = doc.data().image;
        var headnews = doc.data().heading;
        var contentnews = doc.data().content;
        var descriptionnews = doc.data().description;
        // console.log(imgnews);




    
  



        firebase.firestore().collection('news').doc('6').update({
            date: today,
            image: imgnews,
            heading: headnews,
            content: contentnews,
            description: descriptionnews
        })
        console.log(imgnews);
    })

    database.collection('news').doc('4').get().
    then(function(doc) {
        // console.log(doc.data().image)
        // console.log(image.src);

        var imgnews = doc.data().image;
        var headnews = doc.data().heading;
        var contentnews = doc.data().content;
        var descriptionnews = doc.data().description;
        // console.log(imgnews);






        firebase.firestore().collection('news').doc('5').update({
            date: today,
            image: imgnews,
            heading: headnews,
            content: contentnews,
            description: descriptionnews
        })
        console.log(imgnews);
    })
    database.collection('news').doc('3').get().
    then(function(doc) {
        // console.log(doc.data().image)
        // console.log(image.src);

        var imgnews = doc.data().image;
        var headnews = doc.data().heading;
        var contentnews = doc.data().content;
        var descriptionnews = doc.data().description;
        // console.log(imgnews);






        firebase.firestore().collection('news').doc('4').update({
            date: today,
            image: imgnews,
            heading: headnews,
            content: contentnews,
            description: descriptionnews
        })
        console.log(imgnews);
    })
    database.collection('news').doc('2').get().
    then(function(doc) {
        // console.log(doc.data().image)
        // console.log(image.src);

        var imgnews = doc.data().image;
        var headnews = doc.data().heading;
        var contentnews = doc.data().content;
        var descriptionnews = doc.data().description;
        // console.log(imgnews);






        firebase.firestore().collection('news').doc('3').update({
            date: today,
            image: imgnews,
            heading: headnews,
            content: contentnews,
            description: descriptionnews
        })
        console.log(imgnews);
    })

    database.collection('news').doc('1').get().
    then(function(doc) {
        // console.log(doc.data().image)
        // console.log(image.src);

        var imgnews = doc.data().image;
        var headnews = doc.data().heading;
        var contentnews = doc.data().content;
        var descriptionnews = doc.data().description;
        // console.log(imgnews);






        firebase.firestore().collection('news').doc('2').update({
            date: today,
            image: imgnews,
            heading: headnews,
            content: contentnews,
            description: descriptionnews
        })
        console.log(imgnews);
    })


    database.collection('news').doc('0').get().
    then(function(doc) {
        // console.log(doc.data().image)
        // console.log(image.src);

        var imgnews = doc.data().image;
        var headnews = doc.data().heading;
        var contentnews = doc.data().content;
        var descriptionnews = doc.data().description;
        // console.log(imgnews);






        firebase.firestore().collection('news').doc('1').update({
            date: today,
            image: imgnews,
            heading: headnews,
            content: contentnews,
            description: descriptionnews
        })
        console.log(imgnews);
    })




    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;
    firebase.firestore().collection('news').doc('0').set({
        date: today,
        image: imageholder,
        heading: headingnews,
        content: contentNews,
        description: descriptionNews
    })











    window.alert('Saved Successfully');
    imageholder.value = "";
    headingnews.value = "";
    contentNews.value = "";
    descriptionNews.value = "";
}





function getdata() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;


    // from news.html
    for (i = 49; i < 55; i++) {
        let date = document.getElementById('datenews' + String.fromCharCode(i));
        let image = document.getElementById('newsimg' + String.fromCharCode(i));
        let heading = document.getElementById('heading' + String.fromCharCode(i));
        let content = document.getElementById('newscontent' + String.fromCharCode(i));
        let news = document.getElementById('news' + String.fromCharCode(i));
        // console.log(news.href);


        database.collection('news').doc(String.fromCharCode(i)).get()
            .then(function(doc) {
                // console.log(doc.data().image)
                // console.log(image.src);
                // console.log(doc.data().description)
                if (doc.exists) {
                    date.innerHTML = doc.data().date;
                    image.src = doc.data().image;
                    heading.innerHTML = doc.data().heading;
                    content.innerHTML = doc.data().content;
                    news.href = doc.data().description;
                    // console.log(doc.data().date)

                }

            })
    }
}
getdata()





























//changing data 

// const image = document.getElementById('imageholder');
// const headingnews = document.getElementById('headingnews');
// const contentNews = document.getElementById('contentNews');
// const descriptionNews = document.getElementById('descriptionNews');


// function data(){

//   var today = new Date();
//   var dd = String(today.getDate()).padStart(2, '0');
//   var mm = String(today.getMonth() + 1).padStart(2, '0');
//   var yyyy = today.getFullYear();
// var hour = today.getHours();
// var min = today.getMinutes();
// var sec = today.getSeconds();

// var time = hour + '-' + min + '-' + sec;
// today = dd + '-' + mm + '-' + yyyy;
// console.log(time);

// const imageholder = document.getElementById('imageholder');
// const headingnews = document.getElementById('headingnews');
// const contentNews = document.getElementById('contentNews');
// const descriptionNews = document.getElementById('descriptionNews');


// console.log(image.value);
// console.log('123');




// var i;
// for(i=1; i<=6;i++){
// console.log(i);

// var db_em = firebase.database().ref('news/' + 5);

// db_em.on('value',(snapshot)=>{

// const edatas = snapshot.val();
// var content = edatas.content;
// var image = edatas.image;
// var description = edatas.description;
// var date = edatas.date;
// var heading = edatas.heading;
// console.log(heading);



// firebase.database().ref('news/' + (6)).set({
//   date : date,
//   image: image,
//   heading: heading,
//   content: content,
//   description: description,

//   });

//   console.log(heading);
// });
// var db_em = firebase.database().ref('news/' + 4);

// db_em.on('value',(snapshot)=>{

// const edatas = snapshot.val();
// var content = edatas.content;
// var image = edatas.image;
// var description = edatas.description;
// var date = edatas.date;
// var heading = edatas.heading;
// console.log(heading);



//     firebase.database().ref('news/' + (5)).set({
//       date : date,
//       image: image,
//       heading: heading,
//       content: content,
//       description: description,

//   });

//   console.log(heading);
// });
// }





//     firebase.database().ref('news/4').set({
//       date : today,
//       image: imageholder.value,
//       heading: headingnews.value,
//       content: contentNews.value,
//       description: descriptionNews.value,


//     });

//     window.alert('Saved Successfully');
//     imageholder.value="";
//     headingnews.value="";
//     contentNews.value="";
//     descriptionNews.value="";

//   };



//   function add(cardno,imageholder,descriptionNews,headingnews,contentNews,date){

//     document.getElementById('datenews'+ cardno).innerHTML=date;
//     document.getElementById('newsimg'+ cardno).src=imageholder;
//     document.getElementById('heading'+ cardno).innerHTML=headingnews;
//     document.getElementById('newscontent'+ cardno).innerHTML=contentNews;
//     document.getElementById('news'+ cardno).href=descriptionNews;

// }


// function goData(){
// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();
// var hour = today.getHours();
// var min = today.getMinutes();
// var sec = today.getSeconds();

// var time = hour + '-' + min + '-' + sec;
// today = dd + '-' + mm + '-' + yyyy;
// console.log(time);

// firebase.database().ref('news/').once("value",function(snapshot){
//     snapshot.forEach(
//     function(childsnapshot){
//         let date = childsnapshot.val().date;
//         let contentNews = childsnapshot.val().content;
//         let descriptionNews = childsnapshot.val().description;
//         let headingnews = childsnapshot.val().heading;
//         let imageholder = childsnapshot.val().image;
//         let cardno=childsnapshot.key;
// console.log(cardno);

//         add(cardno,imageholder,descriptionNews,headingnews,contentNews,date);
//     }
//     );

// });
// }
// goData();

// function swapdata(){
//   // console.log('123');
//   var i;
//   for(i=4; i>=1;i--){
//     // console.log(i);

//     var db_em = firebase.database().ref('news/' + i);

//     db_em.on('value',(snapshot)=>{

//     const edatas = snapshot.val();
//     var content = edatas.content;
//     var image = edatas.image;
//     var description = edatas.description;
//     var date = edatas.date;
//     var heading = edatas.heading;
//     // console.log(heading);



//     firebase.database().ref('news/' + (i+1)).set({
//       date : date,
//       image: image,
//       heading: heading,
//       content: content,
//       description: description,

//   });

//   console.log(heading);
// });
//   }

// }