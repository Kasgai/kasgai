'use strict';

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
    load()

  } else {
    // User is signed out.
    // ...
    window.location.href = '../login.html';
  }
});

function getParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function load() {
  firebase.database().ref("projects").once("value")
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        const key = childSnapshot.key;
        $("#projects").append("<li class='list-group-item'><a href='index.html?id="+ key +"'>" + childSnapshot.val().title + "</a></li>");
      });
    });
    if(getParam("id",window.location)) {
      firebase.database().ref("projects/"+getParam("id",window.location)+"/users").once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot) {
          firebase.database().ref("users/"+childSnapshot.key).once("value").then(function(ccSnapshot) {
            $("#summary").append("<li class='list-group-item'>作成者："+ccSnapshot.val().firstName + " " + ccSnapshot.val().familyName +"</li>");
          });
          
          
        });
      });
      firebase.database().ref("projects/"+getParam("id",window.location)).once("value").then(function(snapshot) {
        $("#detail").text(snapshot.val().title);
        const datetime = new Date(snapshot.val().datetime);
        $("#summary").append("<li class='list-group-item'>作成日時："+ datetime.toLocaleString("ja-JP") +"</li>");

      });
      firebase.database().ref("projects/"+getParam("id",window.location)+"/yattoko/log").once("value").then(function(snapshot) {
        let lastElapsedTime = 0;
        snapshot.forEach(function(childSnapshot) {
          const time = new Date(childSnapshot.val().datetime);
          let elapsedTime = childSnapshot.val().time;
          if(elapsedTime < lastElapsedTime) elapsedTime += lastElapsedTime;
          lastElapsedTime = elapsedTime;
          let colorlingClass =  "class='"+ (childSnapshot.val().isValidate ? (childSnapshot.val().hantei ? "table-success" : "table-danger") : "") +"'";
          $("#log").append("<tr "+ colorlingClass +"><td>"+time.getHours() + ":" + time.getMinutes() +"</td><td>"+childSnapshot.val().code+"</td><td>"+Math.floor(elapsedTime / 60) + "分" + Math.floor(elapsedTime % 60)+"秒</td></tr>");
        })
      });
    }
  }