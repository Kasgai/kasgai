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
        ref.child("surveys").on('value', function(snapshot) {
          $("#cardContainer").empty();
          if(snapshot.numChildren() == 0)
          {
            $("#noprojectCard").collapse("show");
          } 
          else {
            snapshot.forEach(function(child){
              makeCard(child.key);
            });
          }
          $("#loading").remove();
          
        });
      
    } else {
      // User is signed out.
      // ...
      window.location.href = 'login.html';
    }
  });
