'use strict';

let nodes, network, edges;

const ObjectKind = {
	Target: "TARGET",
	Condition: "CONDITION",
	EntryPoint: "ENTRY POINT"
}

const EdgeType = {
	Yes: "YES",
	No: "NO",
	Entry: "ENTRY"
}

const conditions = [
	{id:0,text:"1組の平行な辺があるか"},
	{id:1,text: "頂点は三つか"},
	{id:2,text:"3辺の長さは等しいか"},
	{id:3,text:"2辺の長さが等しいか"},
	{id:4,text:"4辺の長さが等しいか"},
	{id:5,text:"直角があるか"},
	{id:6,text:"2組の平行な辺があるか"}
];

const targets = [
	{id:0,name: "四角形",
		condition:{
			0: false,
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
			6: false
		}},
	{id:1,name: "正三角形",
		condition: {
			0: false,
			1: true,
			2: true,
			3: true,
			4: false,
			5: false,
			6: false
	}},
	{id:2,name: "直角二等辺三角形",
		condition: {
			0: false,
			1: true,
			2: false,
			3: true,
			4: false,
			5: true,
			6: false
		}},
	{id:3,name: "二等辺三角形",
		condition: {
			0: false,
			1: true,
			2: false,
			3: true,
			4: false,
			5: false,
			6: false
		}},
	{id:4,name: "直角三角形",
		condition: {
			0: false,
			1: true,
			2: false,
			3: false,
			4: false,
			5: true,
			6: false
		}},
	{id:5,name: "三角形",
		condition: {
			0: false,
			1: true,
			2: false,
			3: false,
			4: false,
			5: false,
			6: false
		}},
	{id:6,name: "正方形",
		condition: {
			0: true,
			1: false,
			2: true,
			3: true,
			4: true,
			5: true,
			6: true
		}},
	{id:7,name: "ひし形",
		condition: {
			0: true,
			1: false,
			2: true,
			3: true,
			4: true,
			5: false,
			6: true
		}},
	{id:8,name: "長方形",
		condition: {
			0: true,
			1: false,
			2: false,
			3: true,
			4: false,
			5: true,
			6: true
		}},
	{id:9,name: "平行四辺形",
		condition: {
			0: true,
			1: false,
			2: false,
			3: true,
			4: false,
			5: false,
			6: true
		}},
	{id:10,name: "台形",
		condition: {
			0: true,
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
			6: false
		}}
];


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
        showNetwork();

        if(snapshot.val().code && snapshot.val().code != "{}") {
          let data = JSON.parse(snapshot.val().code);
          let entryPointId = nodes.get()[0].id;
          addToNodes(data,entryPointId,EdgeType.Entry);
        }
      });
      firebase.database().ref("projects/"+getParam("id",window.location)+"/yattoko/log").once("value").then(function(snapshot) {
        let lastElapsedTime = 0;
        let successTime;
        let successCount = 0;
        let failureCount = 0;
        let count = 0;
        snapshot.forEach(function(childSnapshot) {
          count++;
          const time = new Date(childSnapshot.val().datetime);
          let elapsedTime = childSnapshot.val().time;
          if(elapsedTime < lastElapsedTime) elapsedTime += lastElapsedTime;
          lastElapsedTime = elapsedTime;
          let colorlingClass =  "class='"+ (childSnapshot.val().isValidate ? (childSnapshot.val().hantei ? "table-success" : "table-danger") : "") +"'";
          if(childSnapshot.val().isValidate == true && childSnapshot.val().hantei == true && !successTime) successTime = lastElapsedTime;
          if(childSnapshot.val().isValidate == true && childSnapshot.val().hantei == true) successCount++;
          if(childSnapshot.val().isValidate == true && childSnapshot.val().hantei == false) failureCount++;
          $("#log").append("<tr "+ colorlingClass +"><td>"+time.getHours() + ":" + time.getMinutes() +"</td><td>"+childSnapshot.val().code+"</td><td>"+Math.floor(elapsedTime / 60) + "分" + Math.floor(elapsedTime % 60)+"秒</td></tr>");
        })
        $("#summary").append("<li class='list-group-item'>最初の正解までの時間："+ Math.floor(successTime / 60) +"分" +  Math.floor(successTime%60) +"秒</li>");
        $("#summary").append("<li class='list-group-item'>成功回数："+successCount+"</li>");
        $("#summary").append("<li class='list-group-item'>失敗回数："+failureCount+"</li>");
        $("#summary").append("<li class='list-group-item'>操作回数："+count+"</li>");
        

      });
    }
  }

  function showNetwork() {
    nodes = new vis.DataSet([
      {id:(Math.random() * 1e7).toString(32),
      color:"#9013FE",
      label:"ENTRY POINT",
      type: ObjectKind.EntryPoint,
      edgeIds: []
      }]);
    edges = new vis.DataSet([]);
  
    // provide the data in the vis format
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
      autoResize: true,
      height: '400px',
      width: '100%',
      layout:{
        hierarchical: {
          sortMethod: "directed"
        }
      },
      edges: {
        arrows: {to: true}
      }
    };
  
    // initialize your network!
    network = new vis.Network(document.getElementById('network'), data, options);
  
  }

  function addToNodes(node,parent,edgeType) {
    let newId = addObject(node.link,node.isCondition);
    let edgeToParentId = addToEdges(parent,newId,edgeType);
    nodes._data[parent].edgeIds.push(edgeToParentId);
    if(node.yes) nodes._data[newId][EdgeType.Yes] = addToNodes(node.yes,newId,EdgeType.Yes);
    if(node.no) nodes._data[newId][EdgeType.No] = addToNodes(node.no,newId,EdgeType.No);
    return edgeToParentId;
  }


function addToEdges(from, to, type) {
	let edgeId = (Math.random() * 1e7).toString(32);
	edges.add({
		from: from,
		to: to,
		type: type,
		id: edgeId,
		label: type,
	});
	nodes._data[to].edgeIds.push(edgeId);
	return edgeId;
}

function addObject(item,isCondition){
	network.addNodeMode();
	let id = (Math.random() * 1e7).toString(32)
	if(isCondition)
	{
		nodes.add({
		id: id,
		label:conditions[item].text,
		color: "#ED9A5D",
		type: ObjectKind.Condition,
		link: conditions[item].id,
		isCondition: true,
		edgeIds: []
		});
	}else {
		nodes.add({
		id: id,
		shape: 'image',
		image: "../yattoko/asset/" + targets[item].id + ".png",
		color:"#4A90E2",
		type: ObjectKind.Target,
		link: targets[item].id,
		isCondition: false,
		edgeIds: []
		});
	}
	network.disableEditMode();
	return id;
}