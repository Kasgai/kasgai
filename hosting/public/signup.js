firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        //ユーザー登録作業
        //window.location.href = 'index.html';
    } else {
    }
  });

$("#signupButton").on( "click", function(){
    if($("#inputPassword").val() != $("#inputPasswordConfirm").val())
    {
        $("#problemAlert").removeClass("fade");
        $("#problemAlert").text("確認のパスワードが異なっています");
    }
    else if($("#inputFamilyName").val() == "")
    {
        $("#problemAlert").removeClass("fade");
        $("#problemAlert").text("FamilyNameが入力されていません");
    }
    else if($("#inputFirstName").val() == "")
    {
        $("#problemAlert").removeClass("fade");
        $("#problemAlert").text("FirstNameが入力されていません");
    }
    else
    {
        firebase.auth().createUserWithEmailAndPassword($("#inputEmail").val(), $("#inputPassword").val()).then(function(result){
            
            firebase.database().ref('users/' + result.user.uid).set({
                familyName: $("#inputFamilyName").val(),
                firstName: $("#inputFirstName").val(),
                id: $("#inputId").val()
              }).then(function() {
                console.log("Document successfully written!");
                window.location.href = 'index.html';
            }).catch(function(error) {
                console.error("Error writing document: ", error);
            });

        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            $("#problemAlert").removeClass("fade");
            $("#problemAlert").text(errorMessage);
          });
    }
    
});