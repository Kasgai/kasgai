firebase.auth().onAuthStateChanged(function(user) {
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
      var ref = firebase.database().ref("users/"+uid);
        ref.once("value")
        .then(function(snapshot) {
            $("#greeting").text("Hi, " + snapshot.child("firstName").val());
        });

        firebase.database().ref("store/").once("value").then(function(snapshot) {
          snapshot.forEach(element => {
            console.log(element);
            $("#inputTemplate").append("<option value='"+element.key+"'>"+element.child("title").val()+"</option>");
          });
        });
      
    } else {
      // User is signed out.
      // ...
      window.location.href = 'login.html';
    }
  });

$("#createButton").on( "click", function(){

    let ref = firebase.database().ref("projects").push();
    ref.set({
        title: $("#inputTitle").val(),
        description: $("#inputDescription").val(),
        template: $("#inputTemplate").val()

      }).then(function() {
        console.log("Document successfully written!");
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });
    ref.child("users").set({
        [firebase.auth().currentUser.uid]:true
      }).then(function() {
        console.log("Document successfully written!");
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    firebase.database().ref('users/' + firebase.auth().currentUser.uid + "/projects").update({
        [ref.key]:true
      }).then(function() {
        console.log("Document successfully written!");
        window.location.href = 'index.html';
    }).catch(function(error) {
        console.error("Error writing document: ", error);
    });

    
});

