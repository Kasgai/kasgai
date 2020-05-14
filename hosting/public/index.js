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
        ref.child("projects").on('value', function(snapshot) {
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


  function makeCard(id)
  {
    firebase.database().ref("projects/"+id).once("value").then(function(snapshot){
      let title = snapshot.child("title").val();
      let description = snapshot.child("description").val();
      let template = "";
      if(snapshot.child("template").val() == "1")
      {
        template = "図形の分類";
      }
      var image;
      if(snapshot.child("latestImage").exists())
      {
        image = firebase.storage().ref(firebase.auth().currentUser.uid + "/" + snapshot.child("latestImage").val());
      }
      else{
        image = firebase.storage().ref("share/kasgaiTemplateImage.png");
      }
      image.getDownloadURL().then(function(url) {
      $("#"+id + "image").attr("src",url);
      }).catch(function(error) {
        // Handle any errors
      });

      $("#cardContainer").append(
        "<div class='col-sm-6'><div class='card mb-3' id='"+ id+"Card"+"'><img id='"+ id + "image" +"' class='card-img-top' alt='...'>"
        +"<div class='card-img-overlay text-right'><button type='button' id='"+ id + "SettingButton" + "' class='btn btn-outline-info'>Settings</button></div>"
        +"<div class='card-body'><h5 class='card-title'>" + title + "</h5>"
      +"<h6 class='card-subtitle mb-2 text-muted'>" + template + "</h6>"
      +"<p class='card-text'>" + description+ "</p>"
      +"</div><ul class='list-group list-group-flush'>"+
                  "<li class='list-group-item'><a href="+ "kegaki/index.html?id=" + id +" class='card-link'>Open in Kegaki</a></li>"+
                  "<li class='list-group-item'><a href="+ "yattoko/index.html?id=" + id +" class='card-link'>Open in Yattoko</a></li>"+
                  "<li class='list-group-item'><a href="+ "kanna/?id=" + id +" class='card-link'>Open in Kanna</a></li>"+
                  "<li class='list-group-item'><a href="+ "https://shikkui.kasgai.com/?id=" + id +" class='card-link'>Open in Shikkui</a></li>"+
                "</ul></div></div>");

        $("#"+id+"SettingButton").on( "click", function(event){
            let id = $(event.target).attr("id").replace("SettingButton","");
            $("#modalDeleteButton").attr("targetProjectId",id);
            $("#modalTitle").text($("#"+id+"Card").find(".card-title").text() + " の設定");
            $("#modalDescription").text($("#"+id+"Card").find(".card-text").text());
            $("#settingModal").modal();
        });
    });
    
  }

  $("#modalDeleteButton").on("click",function(event){
    let id = $(event.target).attr("targetProjectId");
    firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/projects/" + id).remove();
    $("#settingModal").modal('hide');
  })
