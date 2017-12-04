//to display message call below function
//display_msg(msg){
document.ready
$(document).ready(function(){
var msg = {id : 1, message: "message number 1"};//hard coded placeholder for testing
var jumbotron = document.getElementById("jumbo");
console.log(jumbotron);
var x = document.createElement("P");
x.innerHTML = msg.message;
jumbotron.appendChild(x);


/*
var socket = io.connect('http://localhost');

  socket.on('message', function(data){
    //$('#client_count').text(data);
    console.log("Connection");
    var jumbotron = document.getElementById("jumbo");
	//console.log(jumbotron);
	var x = document.createElement("P");
	x.innerHTML = data[0].message;
	jumbotron.appendChild(x);

  });
*/

});




//}
//to remove call this functions
//remove(id){
//}
