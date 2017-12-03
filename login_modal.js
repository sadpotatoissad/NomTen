    var userID;

    $(document).ready(function(){
        $("#loginBtn").click(function(){
            var input = document.getElementById("user").value;
            console.log("input = " + input);

            if(input != "") {
                console.log("in here and input is = " + input);
                var modal_view = document.getElementById("id01");
                var corousel_view = document.getElementsByClassName("myCarousel");
                myCarousel.setAttribute("style", "visibility: visible");
                modal_view.setAttribute("style", "visibility: hidden");

                document.getElementById("UserNameDisplay").textContent = " Logout User: " + input;
                userID = input;

                $.post('http://localhost:3000/user_login', 
                    {"user":userID}, 
                    function(data, status){
                        console.log("Data from server after add user: " + data + "\nStatus: " + status);
                });
            } else {

                alert("Username is invalid!");

            }
        });

    });



    function logout() {
        location.reload();
    }