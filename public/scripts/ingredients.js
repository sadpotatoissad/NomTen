/*All the frontend js/query for the fridge and ingredient display*/
var item_list = [];

function ingredientShow(ingredientList, ingredientUlId, userId) {
  $("document").ready(function() {
    ingredientList.forEach(function(ingredient) {
      var ingredientWithQuotes = "\'" + ingredient.toString() + "\'";
      var ingredientListId = $(ingredientUlId).siblings().children()[1].id;
      item_list.push(ingredient);
      $(ingredientUlId).append("<li><span onClick=\"deleteIngredient(" +
        "'" + userId + "'" + "," + "'" + ingredientListId + "'" + "," +
        "'" + ingredientUlId + "'" + "," + ingredientWithQuotes +
        ")\"><i class='fa fa-trash'></i></span> " + ingredient +
        "</li>");
    });
  });
};

function addNewIngredient(user_id, foodList, foodUl) {
  var foodId = "#" + foodList;
  var newfoodItem = $(foodId).val().toString().trim();
  var ingredientWithQuotes = "\'" + newfoodItem + "\'";
  $(foodId).val("");
  if (newfoodItem === "") {
    //display error ingredient input cannot be empty
    document.getElementById("infoAlert").innerHTML =
      "Ingredient input cannot be empty.";
    $("#alertInfoProfile").css("display", "block");
    //fade alert
    $("#alertInfoProfile").fadeOut(3000);
    return;
  }
  $.ajax({
    url: "/users/" + user_id + "/addIngredient",
    type: 'POST',
    data: JSON.stringify({
      data: {
        category: foodList,
        newfoodItem: newfoodItem
      }
    }),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      $(foodUl).append("<li><span onClick=\"deleteIngredient(" + "'" +
        user_id + "'" + "," + "'" + foodList + "'" + "," + "'" + foodUl +
        "'" + "," + ingredientWithQuotes +
        ")\"><i class='fa fa-trash'></i></span> " + newfoodItem +
        "</li>");
        //add ingredient to item_list used for percentage filter
        item_list.push(newfoodItem);
    },
    error: function() {
      console.log("error on POST add ingredient");
      document.getElementById("errorAlert").innerHTML =
        "Error on adding ingredient please try again";
      $("#alertErrorProfile").css("display", "block");
      //fade alert
      $("#alertErrorProfile").fadeOut(3000);
    }
  });
};

//===========================for styling =====================================


function deleteIngredient(user_id, ingredientListId, ingredientUlId, ingredient) {
  var url = "/users/" + user_id + "/removeIngredient";
  $.ajax({
    url: url,
    type: 'DELETE',
    data: JSON.stringify({
      data: {
        category: ingredientListId,
        ingredient: ingredient
      }
    }),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      //delete ingredient from item_list
      var position = item_list.lastIndexOf(ingredient);
      item_list.splice(position, 1);
    },
    error: function(err) {
      console.log(err);
      document.getElementById("errorAlert").innerHTML =
        "Error on deleting ingredient";
      $("#alertErrorProfile").css("display", "block");
      //fade alert
      $("#alertErrorProfile").fadeOut(3000);
    }
  });
};

$("document").ready(function() {
  //add tooltip
  $("[data-toggle=tooltip]").tooltip();

  //remove when trashcan is pressed
  $("ul").on("click", "li span", function(event) {
    $(this).parent().fadeOut(500, function() {
      $(this).remove();
    })
    //stops event bubbling up effect
    event.stopPropagation();
  });
});

$("document").ready(function() {
  //controls ingredient input toggle
  //Veg input
  $("#plusVeg").on("click", function() {
    $("#vegInput").fadeToggle(100).css("display", "inline-flex");
    $("#vegList").focus();
  });
  //Protein input
  $("#plusProtein").on("click", function() {
    $("#proteinInput").fadeToggle(100).css("display", "inline-flex");
    $("#proteinList").focus();
  });
  //Dairy input
  $("#plusDairy").on("click", function() {
    $("#dairyInput").fadeToggle(100).css("display", "inline-flex");
    $("#dairyList").focus();
  });
  //Carbs input
  $("#plusCarb").on("click", function() {
    $("#carbInput").fadeToggle(100).css("display", "inline-flex");
    $("#carbList").focus();
  });
  //Fruit input
  $("#plusFruit").on("click", function() {
    $("#fruitInput").fadeToggle(100).css("display", "inline-flex");
    $("#fruitList").focus();
  });
  //Misc input
  $("#plusMisc").on("click", function() {
    $("#miscInput").fadeToggle(100).css("display", "inline-flex");
    $("#miscList").focus();
  });


});
