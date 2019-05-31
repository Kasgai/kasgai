firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        firebase.auth().signOut();
    } else {
    }
  });