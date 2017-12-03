 // class of number so it can be passed as a reference and not a copy
    class Integer{
        constructor(num){
            this.num = num;
        }
    }

    // global variables

    var item_list = [];

    // flags to open each catagory's list of items
    var openProtein = new Integer(0);
    var openCarbs = new Integer(0);
    var openDairy = new Integer(0);
    var openVegs = new Integer(0);
    var openFruits = new Integer(0);
    var openMisc = new Integer(0);

    var currentArrow;
    var toggle;
    var currentSelectedList = "None";

    function openNav() {
        document.getElementById("mySidenav").style.width = "400px";
        document.getElementById("mySidenav").style.visibility= "visible";
        //document.getElementsByClassName("navbar-brand").style.margin= "400px";
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("mySidenav").style.visibility= "hidden";
        //document.getElementsByClassName("container-fluid").style.align= "left";
    }

    // functions of the fridge catagories lists and dropdown
    $(document).ready(function(){

        // dropdown events start------------------------------------------------------------------------------
         $("#dropDownProtein").click(function(){

            //rgba(238,130,238, 0.65) original color
            // change selected catagory to selected color = red
            document.getElementById("protein").style.background= "rgba(238,0,0, 0.65)"; // red with 65% opacity
            // set all the other catagories to unselected color = some purple tone
            document.getElementById("carbs").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("dairy").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("vegs").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("fruits").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("misc").style.background= "rgba(238,130,238, 0.65)";

            document.getElementById("dropButton").innerHTML= "Selected: Protein";
            currentSelectedList = 'proteinList';
            currentArrow = openProtein;
            toggle = '#toggle1';
        });

        $("#dropDownCarbs").click(function(){

            //rgba(238,130,238, 0.65) original color
            // change selected catagory to selected color = red
            document.getElementById("carbs").style.background= "rgba(238,0,0, 0.65)"; // red with 65% opacity
            // set all the other catagories to unselected color = some purple tone
            document.getElementById("protein").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("dairy").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("vegs").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("fruits").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("misc").style.background= "rgba(238,130,238, 0.65)";

            document.getElementById("dropButton").innerHTML= "Selected: Carbs";
            currentSelectedList = 'carbList';
            currentArrow = openCarbs;
            toggle = '#toggle2';
        });


        $("#dropDownDairy").click(function(){

            //rgba(238,130,238, 0.65) original color
            // change selected catagory to selected color = red
            document.getElementById("dairy").style.background= "rgba(238,0,0, 0.65)"; // red with 65% opacity
            // set all the other catagories to unselected color = some purple tone
            document.getElementById("protein").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("carbs").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("vegs").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("fruits").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("misc").style.background= "rgba(238,130,238, 0.65)";

            document.getElementById("dropButton").innerHTML= "Selected: Dairy";
            currentSelectedList = 'dairyList';
            currentArrow = openDairy;
            toggle = '#toggle3';
        });


        $("#dropDownVeg").click(function(){

            //rgba(238,130,238, 0.65) original color
            // change selected catagory to selected color = red
            document.getElementById("vegs").style.background= "rgba(238,0,0, 0.65)"; // red with 65% opacity
            // set all the other catagories to unselected color = some purple tone
            document.getElementById("protein").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("carbs").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("dairy").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("fruits").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("misc").style.background= "rgba(238,130,238, 0.65)";

            document.getElementById("dropButton").innerHTML= "Selected: Vegs";
            currentSelectedList = 'vegList';
            currentArrow = openVegs;
            toggle = '#toggle4';
        });




        $("#dropDownFruits").click(function(){

            //rgba(238,130,238, 0.65) original color
            // change selected catagory to selected color = red
            document.getElementById("fruits").style.background= "rgba(238,0,0, 0.65)"; // red with 65% opacity
            // set all the other catagories to unselected color = some purple tone
            document.getElementById("protein").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("carbs").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("dairy").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("vegs").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("misc").style.background= "rgba(238,130,238, 0.65)";

            document.getElementById("dropButton").innerHTML= "Selected: Fruits";
            currentSelectedList = 'fruitList';
            currentArrow = openFruits;
            toggle = '#toggle5';
        });



        $("#dropDownMisc").click(function(){

            //rgba(238,130,238, 0.65) original color
            // change selected catagory to selected color = red
            document.getElementById("misc").style.background= "rgba(238,0,0, 0.65)"; // red with 65% opacity
            // set all the other catagories to unselected color = some purple tone
            document.getElementById("protein").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("carbs").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("dairy").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("vegs").style.background= "rgba(238,130,238, 0.65)";
            document.getElementById("fruits").style.background= "rgba(238,130,238, 0.65)";

            document.getElementById("dropButton").innerHTML= "Selected: Misc";
            currentSelectedList = 'miscList';
            currentArrow = openMisc;
            toggle = '#toggle6';
        });

        // dropdown events end------------------------------------------------------------------------------


        $("#protein").click(function(){

            if (openProtein.num == 0) {
                $("#proteinList").slideDown("normal");
                $("#toggle1").toggleClass("arrowDown");
                openProtein.num = 1;
            } else {
                $("#proteinList").slideUp("normal");
                $("#toggle1").toggleClass("arrowDown");
                openProtein.num = 0;
            }
        });
        $("#carbs").click(function(){

            if (openCarbs.num == 0) {
                $("#carbList").slideDown("normal");
                $("#toggle2").toggleClass("arrowDown");
                openCarbs.num = 1;
            } else {
                $("#carbList").slideUp("normal");
                $("#toggle2").toggleClass("arrowDown");
                openCarbs.num = 0;
            }
        });
        $("#dairy").click(function(){

            if (openDairy.num == 0) {
                $("#dairyList").slideDown("normal");
                $("#toggle3").toggleClass("arrowDown");
                openDairy.num = 1;
            } else {
                $("#dairyList").slideUp("normal");
                $("#toggle3").toggleClass("arrowDown");
                openDairy.num = 0;
            }
        });
        $("#vegs").click(function(){
            if (openVegs.num == 0) {
                $("#vegList").slideDown("normal");
                $("#toggle4").toggleClass("arrowDown");
                openVegs.num = 1;
            } else {
                $("#vegList").slideUp("normal");
                $("#toggle4").toggleClass("arrowDown");
                openVegs.num = 0;
            }
        });
        $("#fruits").click(function(){
            if (openFruits.num == 0) {
                $("#fruitList").slideDown("normal");
                $("#toggle5").toggleClass("arrowDown");
                openFruits.num = 1;
            } else {
                $("#fruitList").slideUp("normal");
                $("#toggle5").toggleClass("arrowDown");
                openFruits.num = 0;
            }
        });

        $("#misc").click(function(){
            if (openMisc.num == 0) {
                $("#miscList").slideDown("normal");
                $("#toggle6").toggleClass("arrowDown");
                openMisc.num = 1;
            } else {
                $("#miscList").slideUp("normal");
                $("#toggle6").toggleClass("arrowDown");
                openMisc.num = 0;
            }
        });
    });

    // id number for the next item
    var id_counter = 0;

    // add an item to the corresponding ingredient list
    function addItem(){
        var input = document.getElementById("add-ing");
        var item_name = input.value.toLowerCase();

        if (isEmpty(item_name)) {
          alert("Must enter something!");
          return;
        }

        if(currentSelectedList == "None") {
            alert("Must select catagory to put item in");
            return;
        }

        //check is input is already in our list
        if(item_list.indexOf(item_name) != -1){
            alert("Item is already in fridge");
            return;
        }

	    // add item to database
		$.post('http://localhost:3000/add_ingredient', 
			{"user":userID, "category":currentSelectedList, "ingredient":item_name}, 
			function(data, status){
				console.log("Data from server after add: " + data + "\nStatus: " + status);
		});

        // <span id='close' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode); return false;'>x </span>
        item_list.push(item_name);

        var div = document.createElement('div');
        var id_name = "item" + id_counter;
        div.setAttribute("class","fridgeItem");
        //p.setAttribute("onclick","removeItem(this)");
        //p.setAttribute("id","item" + id_counter);
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
        name.setAttribute("class","theNameOfItem");
        name.textContent = item_name;

        div.appendChild(name);

        //p.innerHTML = item_name;
        input.value = "";

        document.getElementById(currentSelectedList).appendChild(div);
        document.getElementById(currentSelectedList).style.padding = "10px";

        if (currentArrow.num == 0) {

            $("#"+currentSelectedList).slideDown("normal");
            $(toggle).toggleClass("arrowDown");

            currentArrow.num = 1;
        }

        console.log(item_list);
    }

    // verifies if the input string is nothing or all whitespaces
    function isEmpty(str){
      return !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
    }


    // remove item from our ingredients list
    function removeItem(e){

        var id = $(e).attr("id");
        // get element that was clicked upon
        var element = document.getElementById(id);
        var item = element.parentNode;
    	var category = item.parentNode.id;
        console.log("category removed is " + category);
    	
    	/*switch(category) {
    	    case 'Protein':
            	category = 'proteinList';
            	break;
    	    case 'Carbs':
    	        category = 'carbList';
    	        break;
    	    case 'Dairy':
    	        category = 'dairyList';
    	        break;
    	    case 'Vegetables':
    	        category = 'vegList';
    	        break;
    	    case 'Fruits':
    	        category = 'fruitList';
    	        break;
    	    case 'Misc':
    	        category = 'miscList';
    	        break;
    	    default:
    	        category = 'ERROR';
    		break;
    	} */
	

        // size of list is 1 before removing last item
        if (item_list.length == 1) {
            // for debugging
            console.log("empty List");
            document.getElementById("proteinList").style.padding = "40px";
            document.getElementById("carbList").style.padding = "40px";
            document.getElementById("dairyList").style.padding = "40px";
            document.getElementById("vegList").style.padding = "40px";
            document.getElementById("fruitList").style.padding = "40px";
            document.getElementById("miscList").style.padding = "40px";
        }

        // remove item from our global item list
	var itemName = item.childNodes[1].innerHTML;
        var index = item_list.indexOf(itemName);
        item_list.splice(index, 1);

        // remove item from our visual list
        item.parentNode.removeChild(item);
	
	// remove item from our database
	$.post('http://localhost:3000/remove_ingredient', 
		{"user":userID, "category":category, "ingredient":itemName}, 
		function(data, status){
			console.log("Data from server after remove: " + data + "\nStatus: " + status);
	});

        // for debugging
        console.log(item_list);
    }
