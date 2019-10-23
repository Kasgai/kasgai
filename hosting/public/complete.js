"use strict";
let user;

firebase.auth().onAuthStateChanged(function (uuser) {
    if (uuser) {
        user = uuser;
        load()
    } else {
        window.location.href = '../login.html';
    }
});

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)","g");
    let results = [];
    let newfind;
    while ((newfind = regex.exec(url)) !== null) {
        results.push(decodeURIComponent(newfind[2].replace(/\+/g, " ")));
    }
    return results;
}

function params() {
    let url_search = location.search.substr(1).split('&');
    let params = [];
    for (let i = 0; i < url_search.length; i++) {
        let key = url_search[i].split("=");
        params.push(key[0]);
    }
    return params
}

function load() {
    if (getParam("id", window.location)[0]) {
        firebase.database().ref("surveys/" + getParam("id", window.location)[0]).once("value").then(function (snapshot) {
            if (snapshot.val()) {
                $("#titleLabel").text(snapshot.val().title);
                let data = { datetime: firebase.database.ServerValue.TIMESTAMP };
                params().forEach(elem => {
                    let params = [];
                    if (params = getParam(elem, window.location), params.length > 1) {
                        data[elem] = getParam(elem, window.location);
                    } else {
                        data[elem] = getParam(elem, window.location)[0];
                    }

                });
                firebase.database().ref('surveys/' + getParam("id", window.location)[0] + "/" + user.uid).push(data).then(function () {
                    console.log("Remove succeeded.")
                    $("#fin").collapse("show");
                    $("#loading").remove();
                })
                    .catch(function (error) {
                        console.log("Remove failed: " + error.message);
                        $("#error").collapse("show");
                        $("#errorMessage").text(location.search);
                        $("#loading").remove();
                    });
            }
            else {
                $("#error").collapse("show");
                $("#errorMessage").text(location.search);
                $("#loading").remove();
            }
        });

    }
    else {
        $("#error").collapse("show");
        $("#errorMessage").text(location.search);
        $("#loading").remove();
    }
}