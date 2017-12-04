    var userID;
    var ngrokURL = "http://aa1fd8c8.ngrok.io";
    document.ready
      $(document).ready(function(){
    if(document.cookie != ''){
      //has logged in
      var modal_view = document.getElementById("id01");
      //var corousel_view = document.getElementsByClassName("myCarousel");
      myCarousel.setAttribute("style", "visibility: visible");
      modal_view.setAttribute("style", "visibility: hidden");
      userID = document.cookie.split('=')[1];
      document.getElementById("UserNameDisplay").textContent = " Logout User: " + userID;



    }else{
  //  $(document).ready(function(){
        $("#loginBtn").click(function(){
            var input = document.getElementById("user").value;

            if(input != "") {
                var modal_view = document.getElementById("id01");
                //var corousel_view = document.getElementsById("myCarousel");
                myCarousel.setAttribute("style", "visibility: visible");
                modal_view.setAttribute("style", "visibility: hidden");

                document.getElementById("UserNameDisplay").textContent = " Logout User: " + input;
                userID = input;

                /*
                $.post('http://localhost:3000/user_login',
                    {"user":userID},
                    function(data){
                        console.log("Data from server after add user: " + data + "\nStatus: ");

                        $.get('http://localhost:3000/users/:' + userID, function(user_data){
                            console.log("the user data is: " + user_data);
                            console.log("the status is ");

                        });

                });
                */

                $.ajax({
                      type:    "POST",
                      url:     ngrokURL + "/user_login",
                      data:    {"user":userID},
                      success: function(data){
                        console.log("Data from server after add user: " + data + "\nStatus: ");

                        $.get(ngrokURL + '/users/' + userID, function(user_data){
                            console.log("the user data is: " + user_data);
                            console.log("the status is ");
                            });

                        },
                      // vvv---- This is the new bit
                      error:   function() {
                            alert("Error: POST request didn't work");
                      }
                });



            } else {

                alert("Username is invalid!");

            }
        });

  //  });

}
 });

    function logout() {
        document.cookie = "login_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //sets cookie as past date to remove
        location.reload();
    }
