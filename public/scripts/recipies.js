/* this file is written by Jesse Jaura with changes by Linda Zhang as indicated below in the changed functions*/
/*performs the ajax call to retrieve the recipes that fit the description
of the filters displays them in modal form
@author Jess Jaura with modifiations by Linda Zhang for modal styling and
added error checking and moved Api query to backend*/
function createRecipes(recipes) {
  //remove previous results
  $("#recipeDisplayLocation").empty();
  $("#recipeDisplayLocation").append(
    '<h3 id="recipeTitle" style="text-align: center;"> Your Suggested Recipes:<br> </h3>'
  );

  //for each retrived recipe create and modal to display the recipe
  $.each(recipes, function(i, recipe) {
    var validRecipe = true;
    var recipeUrl = "http://api.yummly.com/v1/api/recipe/" +
      encodeURIComponent(recipe.id) + "?_app_id=" + "&_app_key=";
    //escape special characters / ? & and ^
    recipeUrl = recipeUrl.replace(/\//g, "%2F");
    recipeUrl = recipeUrl.replace(/\?/g, "%3F");
    recipeUrl = recipeUrl.replace(/\&/g, "%26");
    recipeUrl = recipeUrl.replace(/\^/g, "%5E");

    for (var key in curAppliedFilters) {
      if (key == "servingSize") {
        $.ajax({
          type: 'GET',
          url: "/recipes/Retrieve/" + recipeUrl,
          success: function(recipeInfo) {
            if (curAppliedFilters[key] == "1") {
              if (parseInt(recipeInfo.yield, 10) != 1) {
                validRecipe = false;
              }
            } else if (curAppliedFilters[key] == "2") {
              if (parseInt(recipeInfo.yield, 10) != 2) {
                validRecipe = false;
              }
            } else if (curAppliedFilters[key] == "3 - 4") {
              if ((parseInt(recipeInfo.yield, 10) != 3) && (parseInt(
                  recipeInfo.yield, 10) != 4)) {
                validRecipe = false;
              }
            } else if (curAppliedFilters[key] == "5 - 12") {
              if ((parseInt(recipeInfo.yield, 10) < 5) || (parseInt(
                  recipeInfo.yield, 10) > 12)) {
                validRecipe = false;
              }
            } else if (curAppliedFilters[key] == "more than 13") {
              if (parseInt(recipeInfo.yield, 10) < 13) {
                validRecipe = false;
              }
            }
          },
          error: function(err) {
            console.log(err);
            document.getElementById("errorAlert").innerHTML =
              "Sorry. Something went wrong :(";
            $("#alertErrorProfile").css("display", "block");
            //fade alert
            $("#alertErrorProfile").fadeOut(3000);
          }
        });
      }
    }

    if ("percentage" in curAppliedFilters) {
      var countOfHits = 0;
      var countOfIngredients = 0;
      for (var food1 in recipe.ingredients) {
        countOfIngredients++;
        for (food2 in item_list) {
          if ((recipe.ingredients[food1]) == (item_list[food2])) {
            countOfHits++;
            break;
          }
        }
      }

      if ((countOfHits / countOfIngredients) < (curAppliedFilters[
          "percentage"] / 100)) {
        validRecipe = false;
      }
    }

    if (validRecipe) {
      //edit smallImageUrl to display maximum Size
      var fullImgUrl = "";
      fullImgUrl = fullImgUrl + recipe.smallImageUrls;
      var end = fullImgUrl.lastIndexOf("=");
      fullImgUrl = fullImgUrl.substring(0, end) + "=s300";

      var img = $('<img>');
      img.attr('src', fullImgUrl);


      var name = $("<h1></h1>");
      name.text(recipe.recipeName);
      name.attr('style', "text-align: center;");

      var recipeContainer = $('<div></div>');
      recipeContainer.attr('class', "Recipe col-sm-4 col-md-4");
      var modalCount = count();
      var buttonId = "btn_" + modalCount;
      recipeContainer.attr('id', buttonId);

      recipeContainer.append(img);
      recipeContainer.append(name);

      //create modal
      //div 1
      var modalImg = $("<img id='modalInnerImg'>");
      modalImg.attr('src', fullImgUrl);
      //modalImg.attr('style', "-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;float: left;height: 100%;width: auto;");

      var modalImgDiv = $("<div class='col-sm-6'></div>");
      modalImgDiv.append(modalImg);

      //div 2

      var modalCourses = $("<li>Course type: </li>");
      var modalCourse = $("<ul></ul>");
      $.each(recipe.attributes.course, function(j, course) {
        modalCourse.append($("<li></li>").append(course));
      });
      modalCourses.append(modalCourse);
      var modalRating = $("<li></li>");
      modalRating.append("Rating: ".concat(recipe.rating));
      var modalRecipeAttributes = $("<ul></ul");
      modalRecipeAttributes.append(modalRating);
      modalRecipeAttributes.append(modalCourses);
      var modalRecipeAttributesDiv = $(
        "<div id='recipeAttributes' class='container col-sm-6'></div>");
      //modalRecipeAttributesDiv.attr('style', "width: 90%; height: 50%; float: left; overflow: auto;");
      //modalRecipeAttributesDiv.append(modalName);
      modalRecipeAttributesDiv.append(modalRecipeAttributes);


      //div 3
      var modalIngredientTitle = $("<h3>Ingredients</h3>");
      var modalIngredients = $("<ul></ul>");
      $.each(recipe.ingredients, function(k, ingredient) {
        modalIngredients.append($("<li></li>").append(ingredient));
      });

      var modalIngredientsDiv = $("<div id='ingredientsModal'></div>");
      //modalIngredientsDiv.attr('style', "width: 50%; height: 50%; float: left;");
      modalIngredientsDiv.append(modalIngredientTitle);
      modalIngredientsDiv.append(modalIngredients);

      //div holding all 4 divs
      var modalRecipeInfoOuterDiv = $(
        "<div class='modalBody container col-sm-12'></div>");
      var modalRecipeInfoDiv = $("<div class='row'></div>")
      //modal footer
      var modalFooter = $("<div class='modal-footer'></div>");

      //div 4
      var sourceUrl = recipeUrl;
      $.ajax({
        type: 'GET',
        url: "/recipes/source/" + recipeUrl,
        success: function(recipeInfo) {
          sourceUrl = recipeInfo.source.sourceRecipeUrl;
          var modalSource = $(
            "<a id=sourceBtn class='btn btn-lg'>Redirect to full recipe</a>"
          );
          modalSource.attr('href', sourceUrl);
          var modalSourceDiv = $(
            "<div class='container col-sm-10'></div>");
          modalSourceDiv.append(modalSource);
          modalFooter.append(modalSourceDiv);



        },
        error: function(err) {
          console.log(err);
          document.getElementById("errorAlert").innerHTML =
            "Sorry. Something went wrong :(";
          $("#alertErrorProfile").css("display", "block");
          //fade alert
          $("#alertErrorProfile").fadeOut(3000);
        }

      });

      // continue with div that holds all 4 divs
      modalRecipeInfoDiv.attr('style', "overflow: auto;");
      modalRecipeInfoDiv.append(modalImgDiv);
      modalRecipeInfoDiv.append(modalRecipeAttributesDiv);

      //close button
      var modalClose = $("<span></span>");
      var spanId = "span_" + modalCount;
      modalClose.attr('id', spanId);
      modalClose.attr('class', "close");
      modalClose.append("&times;");

      //title
      var modalName = $("<h3 class='modal-title'></h3>");
      modalName.text(recipe.recipeName);
      var modalHeader = $("<div></div>");
      modalHeader.attr("class", "modal-header");
      modalHeader.append(modalClose);
      modalHeader.append(modalName);

      //modal content div
      var modalContent = $("<div></div>");
      modalContent.attr('class', "modal-content");
      modalContent.attr('style', "overflow: auto;");
      modalContent.append(modalHeader);
      modalRecipeInfoOuterDiv.append(modalRecipeInfoDiv);
      modalRecipeInfoOuterDiv.append(modalIngredientsDiv);
      modalContent.append(modalRecipeInfoOuterDiv);
      modalContent.append(modalFooter);

      //modal dialog
      var modalDialog = $("<div></div>");
      modalDialog.attr("class", "modal-dialog");
      modalDialog.append(modalContent)
      //main modal div
      var modalMain = $("<div></div>");
      var modalId = "modal_" + modalCount;
      modalMain.attr('id', modalId);
      modalMain.attr('class', "modal");
      modalMain.append(modalDialog);


      //add recipe modals to display location
      $("#recipeDisplayLocation").append(recipeContainer);
      $("#recipeDisplayLocation").append(modalMain);

      //scroll to recipes
      $('html, body').animate({
        scrollTop: $("#recipeDisplayLocation").offset().top
      }, 400);

      // Get the modal
      var modal = document.getElementById(modalId);

      // Get the button that opens the modal
      var btn = document.getElementById(buttonId);

      // Get the <span> element that closes the modal
      var span = document.getElementById(spanId);

      // When the user clicks on the button, open the modal
      btn.onclick = function() {
        //$("#".concat(modalId)).css("display", "block");
        modal.style.display = "block";
      }

      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        //$("#".concat(modalId)).css("display", "none");
        modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target.className == "modal") {
          //modal.style.display = "none";
          event.target.style.display = "none";
        }
      }
    }

  });

}

function counter() {
  var currentCount = 0;
  return function() {
    return currentCount++;
  }
}
var count = counter();

/* update the dropdown filter value in curAppliedFilters by filterId*/
function checkDropdownfilterSelected(filterId) {
  var clean = filterId.replace("#", '');
  if ($(filterId).val() !== "Dropdown to select") {
    curAppliedFilters[clean] = $(filterId).val();
  } else {
    delete curAppliedFilters[clean]
  }
}

/* Search and filter recipes for users from the Yummly API
 @author Jesse Jaura Changes made by linda to populate dropdown filters, moved
 yummly api query to route, added randomization to the retrieved results*/

function clicked() {
  //populate the curAppliedFilters with the drop down filter values
  checkDropdownfilterSelected("#time");
  checkDropdownfilterSelected("#course");
  checkDropdownfilterSelected("#cuisine");
  checkDropdownfilterSelected("#diet");
  checkDropdownfilterSelected("#servingSize");

  //Query Yummly API
  var yummlyQuery =
    "http:%2F%2Fapi.yummly.com%2Fv1%2Fapi%2Frecipes%3F_app_id%3D" +
    "&_app_key%3D";

  for (var key in curAppliedFilters) {
    if (key == "course") {
      if (curAppliedFilters[key] == "Main Dishes") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCourse[]=course^course-Main Dishes");
      } else if (curAppliedFilters[key] == "Desserts") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCourse[]=course^course-Desserts");
      } else if (curAppliedFilters[key] == "Side Dishes") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCourse[]=course^course-Side Dishes");
      } else if (curAppliedFilters[key] == "Lunch and Snacks") {
        yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Lunch");
      } else if (curAppliedFilters[key] == "Appetizers") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCourse[]=course^course-Appetizers");
      } else if (curAppliedFilters[key] == "Salads") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCourse[]=course^course-Salads");
      } else if (curAppliedFilters[key] == "Breads") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCourse[]=course^course-Breads");
      } else if (curAppliedFilters[key] == "Breakfast and Brunch") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCourse[]=course^course-Breakfast and Brunch");
      } else if (curAppliedFilters[key] == "Soups") {
        yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Soups");
      } else if (curAppliedFilters[key] == "Beverages") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCourse[]=course^course-Beverages");
      } else if (curAppliedFilters[key] == "Condiments and Sauces") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCourse[]=course^course-Condiments and Sauces");
      } else if (curAppliedFilters[key] == "Cocktails") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCourse[]=course^course-Cocktails");
      }
    } else if (key == "cuisine") {
      if (curAppliedFilters[key] == "American") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-american");
      } else if (curAppliedFilters[key] == "Italian") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-italian");
      } else if (curAppliedFilters[key] == "Asian") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-asian");
      } else if (curAppliedFilters[key] == "Mexican") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-mexican");
      } else if (curAppliedFilters[key] == "French") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-french");
      } else if (curAppliedFilters[key] == "Southwestern") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-southwestern");
      } else if (curAppliedFilters[key] == "Barbecue") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-barbecue-bbq");
      } else if (curAppliedFilters[key] == "Indian") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-indian");
      } else if (curAppliedFilters[key] == "Chinese") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-chinese");
      } else if (curAppliedFilters[key] == "Mediterranean") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-mediterranean");
      } else if (curAppliedFilters[key] == "Greek") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-greek");
      } else if (curAppliedFilters[key] == "Spanish") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-spanish");
      } else if (curAppliedFilters[key] == "Thai") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-thai");
      } else if (curAppliedFilters[key] == "Cuban") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedCuisine[]=cuisine^cuisine-cuban");
      }
    } else if (key == "diet") {
      if (curAppliedFilters[key] == "Lacto vegetarian") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedDiet[]=388^Lacto%20vegetarian");
      } else if (curAppliedFilters[key] == "Ovo vegetarian") {
        yummlyQuery = yummlyQuery.concat("&allowedDiet[]=389^Ovo%20vegetarian");
      } else if (curAppliedFilters[key] == "Pescetarian") {
        yummlyQuery = yummlyQuery.concat("&allowedDiet[]=390^Pescetarian");
      } else if (curAppliedFilters[key] == "Vegan") {
        yummlyQuery = yummlyQuery.concat("&allowedDiet[]=386^Vegan");
      } else if (curAppliedFilters[key] == "Vegetarian") {
        yummlyQuery = yummlyQuery.concat(
          "&allowedDiet[]=387^Lacto-ovo%20vegetarian");
      }
    } else if (key == "time") {
      if (curAppliedFilters[key] == "20 and under") {
        yummlyQuery = yummlyQuery.concat("&maxTotalTimeInSeconds=1200");
      } else if (curAppliedFilters[key] == "40 and under") {
        yummlyQuery = yummlyQuery.concat("&maxTotalTimeInSeconds=2400");
      } else if (curAppliedFilters[key] == "60 and under") {
        yummlyQuery = yummlyQuery.concat("&maxTotalTimeInSeconds=3600");
      } else if (curAppliedFilters[key] == "90 and under") {
        yummlyQuery = yummlyQuery.concat("&maxTotalTimeInSeconds=5400");
      } else if (curAppliedFilters[key] == "180 and under") {
        yummlyQuery = yummlyQuery.concat("&maxTotalTimeInSeconds=10800");
      }
    } else if (key == "allergies") {
      for (var foodAllergy in curAppliedFilters[key]) {
        if (curAppliedFilters[key][foodAllergy] == "Dairy") {
          yummlyQuery = yummlyQuery.concat("&allowedAllergy[]=396^Dairy-Free");
        } else if (curAppliedFilters[key][foodAllergy] == "Egg") {
          yummlyQuery = yummlyQuery.concat("&allowedAllergy[]=397^Egg-Free");
        } else if (curAppliedFilters[key][foodAllergy] == "Gluten") {
          yummlyQuery = yummlyQuery.concat("&allowedAllergy[]=393^Gluten-Free");
        } else if (curAppliedFilters[key][foodAllergy] == "Seafood") {
          yummlyQuery = yummlyQuery.concat("&allowedAllergy[]=398^Seafood-Free");
        } else if (curAppliedFilters[key][foodAllergy] == "Sesame") {
          yummlyQuery = yummlyQuery.concat("&allowedAllergy[]=399^Sesame-Free");
        } else if (curAppliedFilters[key][foodAllergy] == "Soy") {
          yummlyQuery = yummlyQuery.concat("&allowedAllergy[]=400^Soy-Free");
        } else if (curAppliedFilters[key][foodAllergy] == "Sulfite") {
          yummlyQuery = yummlyQuery.concat("&allowedAllergy[]=401^Sulfite-Free");
        } else if (curAppliedFilters[key][foodAllergy] == "Tree Nut") {
          yummlyQuery = yummlyQuery.concat(
            "&allowedAllergy[]=395^Tree Nut-Free");
        } else if (curAppliedFilters[key][foodAllergy] == "Wheat") {
          yummlyQuery = yummlyQuery.concat("&allowedAllergy[]=392^Wheat-Free");
        }
      }
    } else if (key == "ingredientsToExclude") {
      for (var ingredientsExclude in curAppliedFilters[key]) {
        yummlyQuery = yummlyQuery.concat("&excludedIngredient[]=" +
          encodeURIComponent((curAppliedFilters[key][ingredientsExclude]).trim())
        );
      }
    } else if (key == "ingredientsToInclude") {
      for (var ingredientsInclude in curAppliedFilters[key]) {
        yummlyQuery = yummlyQuery.concat("&allowedIngredient[]=" +
          encodeURIComponent(curAppliedFilters[key][ingredientsInclude].trim())
        );
      }
    }
  }
  //maxResult = the number of recipes per page (num recipies retrieved)
  //start = the number of recipe to start retrieving
  yummlyQuery = yummlyQuery.concat("&maxResult=10&start=");
  //only query once if percentage filter is not specified
  var start = "&start=" + Math.floor(Math.random() * 200);
  yummlyQuery = yummlyQuery.replace("&start=", start);
  //escape special characters / ? & and ^
  yummlyQuery = yummlyQuery.replace(/\//g, "%2F");
  yummlyQuery = yummlyQuery.replace(/\?/g, "%3F");
  yummlyQuery = yummlyQuery.replace(/\&/g, "%26");
  yummlyQuery = yummlyQuery.replace(/\^/g, "%5E");

  $.ajax({
    type: 'GET',
    url: "/recipes/Query/" + yummlyQuery,
    success: function(data) {
      createRecipes(data.matches);
    },
    failure: function(error) {
      console.log(error);
      document.getElementById("errorAlert").innerHTML =
        "Sorry. Something went wrong :(";
      $("#alertErrorProfile").css("display", "block");
      //fade alert
      $("#alertErrorProfile").fadeOut(3000);
    }
  });
}
