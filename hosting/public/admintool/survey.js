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
	firebase.database().ref("surveys").once("value")
		.then(function (snapshot) {
			snapshot.forEach(function (childSnapshot) {
				const key = childSnapshot.key;
				$("#surveys").append("<li class='list-group-item'><a href='survey.html?id=" + key + "'>" + childSnapshot.val().title + "</a></li>");
			});
		});
	if (getParam("id", window.location)) {
		firebase.database().ref("surveys/" + getParam("id", window.location)).once("value").then(function (snapshot) {
			$("#editTitle").text(snapshot.val().title);
			$("#titleInput").val(snapshot.val().title);
			$("#csvInput").val(snapshot.val().csv);
		});
	}
	else {
		$("#editTitle").text("*新規");
	}
}

function save() {
	let param = getParam("id", window.location);
	if(param == null) {
		let ref = firebase.database().ref("surveys");
		let pushRef = ref.push({
			"title":$("#titleInput").val(),
			"csv":$("#csvInput").val()
		});
		window.location = "survey.html?id=" + pushRef.key;
	} else {
		let ref = firebase.database().ref("surveys/"+param);
		ref.set({
			"title":$("#titleInput").val(),
			"csv":$("#csvInput").val()
		});
	}
}