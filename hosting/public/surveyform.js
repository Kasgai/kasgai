'use strict';

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		load()
	} else {
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
	if (getParam("id", window.location)) {
		firebase.database().ref("surveys/" + getParam("id", window.location)).once("value").then(function (snapshot) {
			$("#titleLabel").text(snapshot.val().title);
		});
	}
	else {
		location.window = "survey.html";
	}
}