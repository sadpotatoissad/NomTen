//to display message call below function
//display_msg(msg){
document.ready
$(document).ready(function(){

	var socket = io.connect("http://fc983b8b.ngrok.io");
	socket.on('message', function (data) {
		var jumbotron = document.getElementById("jumbo");
		console.log(jumbotron);
		var x = document.getElementById("msg-holder");
		x.textContent = data.message;
		//jumbotron.appendChild(x);
	});
});




//}
//to remove call this functions
//remove(id){
//}
