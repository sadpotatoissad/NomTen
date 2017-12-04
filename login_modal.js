    var userID;
    var ngrokURL = "http://1f84acff.ngrok.io";

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

            $.get(ngrokURL + '/users/' + userID, function(user_data){
                console.log("the user data is: " + user_data);
                
                var u_id = user_data[0]. user_id;
                var u_proteinList = user_data[0].proteinList;
                var u_carbList = user_data[0].carbList;
                var u_dairyList = user_data[0].dairyList;
                var u_vegList = user_data[0].vegList;
                var u_fruitList = user_data[0].fruitList;
                var u_miscList = user_data[0].miscList;

                reloadFridge('proteinList', u_proteinList);

                reloadFridge('carbList', u_carbList);

                reloadFridge('dairyList', u_dairyList);

                reloadFridge('vegList', u_vegList);

                reloadFridge('fruitList', u_fruitList);

                reloadFridge('miscList', u_miscList);

                });


    } else {
        //$(document).ready(function(){
        $("#loginBtn").click(function(){
            var input = document.getElementById("user").value;

            if(input != "") {
                var modal_view = document.getElementById("id01");
                //var corousel_view = document.getElementsById("myCarousel");
                myCarousel.setAttribute("style", "visibility: visible");
                modal_view.setAttribute("style", "visibility: hidden");

                document.getElementById("UserNameDisplay").textContent = " Logout User: " + input;
                userID = input;


              $.ajax({
                      type:    "POST",
                      url:     ngrokURL + "/user_login",
                      data:    {"user":userID},
                      success: function(data){
                        console.log("Data from server after add user: " + data + "\nStatus: ");

                        $.get(ngrokURL + '/users/' + userID, function(user_data){
                            console.log("the user data is: " + user_data);

                            var u_id = user_data[0]. user_id;
                            var u_proteinList = user_data[0].proteinList;
                            var u_carbList = user_data[0].carbList;
                            var u_dairyList = user_data[0].dairyList;
                            var u_vegList = user_data[0].vegList;
                            var u_fruitList = user_data[0].fruitList;
                            var u_miscList = user_data[0].miscList;

                            reloadFridge('proteinList', u_proteinList);

                            reloadFridge('carbList', u_carbList);

                            reloadFridge('dairyList', u_dairyList);

                            reloadFridge('vegList', u_vegList);

                            reloadFridge('fruitList', u_fruitList);

                            reloadFridge('miscList', u_miscList);

                            });

                        },
                      // vvv---- This is the new bit
                      error:   function() {
                            alert("Error: PUT request didn't work");
                      }
                });



            } else {

                alert("Username is invalid!");

            }
        });

  //  });

}
 });

    function reloadFridge(catagory, list){
        for (var i = 0; i < list.length; i++) {
            var item_name = list[i];

            item_list.push(item_name);

            var div = document.createElement('div');

            div.setAttribute("class","fridgeItem");

            id_counter++;

            // x button to remove item
            var close_x = document.createElement('span');
            close_x.setAttribute("class", "closeX");
            close_x.setAttribute("id","item" + id_counter);
            close_x.setAttribute("title","click to remove");
            close_x.setAttribute("onclick","removeItem(this)");
            close_x.textContent = "x";

            div.appendChild(close_x);

            var name = document.createElement('span');
            var name_id = "ItemId" + id_counter;

            name.setAttribute("id", name_id);

            name.setAttribute("class","theNameOfItem");


            name.setAttribute("onclick", "renameItem(this)");


            name.textContent = item_name;

            div.appendChild(name);


            document.getElementById(catagory).appendChild(div);
            document.getElementById(catagory).style.padding = "10px";

            console.log(item_list);
        }
    }

    function logout() {
        document.cookie = "login_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //sets cookie as past date to remove
        location.reload();
    }

    