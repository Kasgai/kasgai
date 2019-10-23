"use strict";
let questions = [];

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
			csv2question(snapshot.val().csv);
		});
	}
	else {
		location.window = "survey.html";
	}
}

function csv2question(csv) {
	questions = [];
	let lines = csv.split("\n");
	lines.forEach(element => {
		if(element.startsWith("section")) {
			questions.push(new Section(element));
		} else if(element.startsWith("text")) {
			questions.push(new Text(element));
		} else if(element.startsWith("longtext")) {
			questions.push(new LongText(element));
		} else if(element.startsWith("check")) {
			questions.push(new Check(element));
		} else if(element.startsWith("radio")) {
			questions.push(new Radio(element));
		} else {
			throw new Error(csv+"\n存在しないタグです");
		}
	});
	showSurvey();
}

function showSurvey() {
	$("#questionsform").empty();
	questions.forEach(element => {
		$("#questionsform").append(element.getHTML());
	});
	$("#questionsform").append('<button class="btn btn-primary mt-5 mb-5 btn-lg btn-block" type="submit">回答を送信</button>');
	
}

class Section {

	constructor(csv) {
		let data = csv.split(",");
		if(data[0] != "section"){throw new Error(csv+"\nこれはSectionではありません");}
		this.title = data[1];
	}
	
	getHTML() {
		return '<h5 class="mt-3 mb-3">'+this.title+'</h5>';
	}
}

class Text {

	constructor(csv) {
		let data = csv.split(",");
		if(data[0] != "text"){throw new Error(csv+"\nこれはTextではありません");}
		this.question = data[1];
		this.isRequired = data[2] == 1;
	}
	
	getHTML() {
		return '<div class="form-group">'+
		'<label>'+this.question+(this.isRequired ? "" : '<span class="badge badge-secondary ml-2">Optional</span>')+'</label>'+
		'<input class="form-control" type="text" placeholder="記述解答">'+
	'</div>';
	}
}

class LongText {

	constructor(csv) {
		let data = csv.split(",");
		if(data[0] != "longtext"){throw new Error(csv+"\nこれはLongTextではありません");}
		this.question = data[1];
		this.isRequired = data[2] == 1;
	}
	
	getHTML() {
		return '<div class="form-group">'+
		'<label>'+this.question+(this.isRequired ? "" : '<span class="badge badge-secondary ml-2">Optional</span>')+'</label>'+
		'<textarea class="form-control"rows="3" placeholder="自由記述"></textarea></div>';
	}
}

class Check {

	constructor(csv) {
		let data = csv.split(",");
		if(data[0] != "check"){throw new Error(csv+"\nこれはCheckではありません");}
		this.question = data[1];
		this.isRequired = data[2] == 1;
		this.selections = [];
		for(let i = 3; i < data.length; i++) {
			this.selections.push(data[i]);
		}
	}
	
	getHTML() {
		let returnValue = ' <div class="form-group"><label>'+this.question+(this.isRequired ? "" : '<span class="badge badge-secondary ml-2">Optional</span>')+'</label><br />';

		this.selections.forEach(elem=>{
			returnValue += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" value="1">'+'<label class="form-check-label">'+
			(elem.startsWith("id=") ? '<input type="text" class="form-control form-control-sm" placeholder="その他">': elem)+'</label></div>'
		});

		return returnValue + '</div>';
	}
}

class Radio {

	constructor(csv) {
		let data = csv.split(",");
		if(data[0] != "radio"){throw new Error(csv+"\nこれはradioではありません");}
		this.question = data[1];
		this.isRequired = data[2] == 1;
		this.selections = [];
		for(let i = 3; i < data.length; i++) {
			this.selections.push(data[i]);
		}
	}
	
	getHTML() {
		let returnValue = ' <div class="form-group"><label>'+this.question+(this.isRequired ? "" : '<span class="badge badge-secondary ml-2">Optional</span>')+'</label><br />';

		this.selections.forEach(elem=>{
			returnValue += '<div class="form-check form-check-inline"><input class="form-check-input" type="radio" value="1">'+'<label class="form-check-label">'+(elem.startsWith("id=") ? '<input type="text" class="form-control form-control-sm" placeholder="その他">': elem)+'</label></div>'
		});

		return returnValue + '</div>';
	}
}
