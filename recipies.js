


	function createRecipes(recipes) {
		$("body").append('<h3 id="recipeTitle" style="text-align: center;"> Recipes </h3>');
		
		$.each(recipes, function (i, recipe) {
			var validRecipe = true;
			var recipeUrl = "http://api.yummly.com/v1/api/recipe/" + encodeURIComponent(recipe.id) + "?_app_id=786bc228&_app_key=3ea220e1feb77f31ef0ab36fcf8accd4";
			for (var key in curAppliedFilters){
				if (key == "servingSize") {
			        $.ajax({
			            type:'GET',
			            url: recipeUrl,
			            success:function(recipeInfo){
			            	if (curAppliedFilters[key] == "1") {
			            		if (parseInt(recipeInfo.yield, 10) != 1) {
			            			validRecipe = false;
			            		}
			            	} else if (curAppliedFilters[key] == "2") {
			            		if (parseInt(recipeInfo.yield, 10) != 2) {
			            			validRecipe = false;
			            		}
			            	} else if (curAppliedFilters[key] == "3 - 4") {
			            		if ((parseInt(recipeInfo.yield, 10) != 3) && (parseInt(recipeInfo.yield, 10) != 4)) {
			            			validRecipe = false;
			            		}
			            	} else if (curAppliedFilters[key] == "5 - 12") {
			            		if ((parseInt(recipeInfo.yield, 10) < 5) || (parseInt(recipeInfo.yield, 10) > 12)) {
			            			validRecipe = false;
			            		}
			            	} else if (curAppliedFilters[key] == "more than 13") {
			            		if (parseInt(recipeInfo.yield, 10) < 13) {
			            			validRecipe = false;
			            		}
			            	}
			            }
			        });
				}
			}

			if ("percentage" in curAppliedFilters) {
				var countOfHits = 0;
				var countOfIngredients= 0;
				for (var food1 in recipe.ingredients){
					countOfIngredients++;
					for (food2 in item_list) {
						if ((recipe.ingredients[food1]) == (item_list[food2])) {
							countOfHits++;
							break;
						}
					}
				}

				if ((countOfHits/countOfIngredients) < (curAppliedFilters["percentage"]/100)) {
					validRecipe = false;
				}
			}

			if (validRecipe) {

				var img = $('<img>');
				img.attr('src', recipe.smallImageUrls);
				img.attr('width', "100");
				img.attr('height', "100");
				img.attr('style', "-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;float: left;height: 100%;width: auto;");

				var name = $("<h1></h1>");
				name.text(recipe.recipeName);
				name.attr('style', "text-align: center;");

				var recipeContainer = $('<div></div>');
				recipeContainer.attr('class', "Recipe");
				var modalCount = count();
				var buttonId = "btn_" + modalCount;
				recipeContainer.attr('id', buttonId);

				recipeContainer.append(img);
				recipeContainer.append(name);

				//create modal
				//div 1
				var modalImg = $('<img>');
				modalImg.attr('src', recipe.smallImageUrls);
				modalImg.attr('width', "100");
				modalImg.attr('height', "100");
				modalImg.attr('style', "-webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;float: left;height: 100%;width: auto;");

				var modalImgDiv = $("<div></div>");
				modalImgDiv.attr('style', "width: 10%; height: 50%; float: left;");
				modalImgDiv.append(modalImg);

				//div 2
				var modalName = $("<h3></h3>");
				modalName.text(recipe.recipeName);
				var modalCourses = $("<li>Course(s) </li>");
				var modalCourse = $("<ul></ul>");
				$.each(recipe.attributes.course, function (j, course) {
					//TODO: THIS MIGHT NOT WORK
					modalCourse.append($("<li></li>").append(course));
				});
				modalCourses.append(modalCourse);
				var modalRating = $("<li></li>");
				modalRating.append("Rating: ".concat(recipe.rating));
				var modalRecipeAttributes = $("<ul></ul");
				modalRecipeAttributes.append(modalRating);
				modalRecipeAttributes.append(modalCourses);
				var modalRecipeAttributesDiv = $("<div></div>");
				modalRecipeAttributesDiv.attr('style', "width: 90%; height: 50%; float: left; overflow: auto;");
				modalRecipeAttributesDiv.append(modalName);
				modalRecipeAttributesDiv.append(modalRecipeAttributes);

				//div 3
				var modalIngredientTitle = $("<h3>Ingredients</h3>");
				var modalIngredients = $("<ul></ul>");
				$.each(recipe.ingredients, function (k, ingredient) {
					//TODO: THIS MIGHT NOT WORK
					modalIngredients.append($("<li></li>").append(ingredient));
				});
				var modalIngredientsDiv = $("<div></div>");
				modalIngredientsDiv.attr('style', "width: 50%; height: 50%; float: left;");
				modalIngredientsDiv.append(modalIngredientTitle);
				modalIngredientsDiv.append(modalIngredients);

				//div holding all 4 divs
				var modalRecipeInfoDiv = $("<div></div>");

				//div 4
				var sourceUrl = recipeUrl;
			    $.ajax({
			        type:'GET',
			        url: recipeUrl,
			        success:function(recipeInfo){
			        	sourceUrl = recipeInfo.source.sourceRecipeUrl; //TODO what if this fails?
						var modalSource = $("<a>Source</a>");
						modalSource.attr('href', sourceUrl);
						var modalSourceDiv = $("<div></div>");
						modalSourceDiv.attr('style', "width: 50%; height: 50%; float: left;");
						modalSourceDiv.append(modalSource);
						modalRecipeInfoDiv.append(modalSourceDiv);

			        }
			    });

				// continue with div that holds all 4 divs
				modalRecipeInfoDiv.attr('style', "overflow: auto; min-width: 600px");
				modalRecipeInfoDiv.append(modalImgDiv);
				modalRecipeInfoDiv.append(modalRecipeAttributesDiv);
				//TODO: Add <hr> tag for line
				modalRecipeInfoDiv.append(modalIngredientsDiv);

				//close button
				var modalClose = $("<span></span>");
				var spanId = "span_" + modalCount;
				modalClose.attr('id', spanId);
				modalClose.attr('class', "close");
				modalClose.append("&times;");

				//modal content div
				var modalContent = $("<div></div>");
				modalContent.attr('class', "modal-content");
				modalContent.attr('style', "overflow: auto;");
				modalContent.append(modalClose);
				modalContent.append(modalRecipeInfoDiv);

				//main modal div
				var modalMain = $("<div></div>");
				var modalId = "modal_" + modalCount;
				modalMain.attr('id', modalId);
				modalMain.attr('class', "modal");
				modalMain.append(modalContent);


				$("body").append(recipeContainer);
				$("body").append(modalMain);

				//TODO Double scroll wheel when ingredients too long on modal



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
					console.log("window");
					console.log(event.target);
					console.log(modal);
				    if (event.target.className == "modal") {
				        //$("#".concat(modalId)).css("display", "none");
				        console.log("close");
				        //TODO: BUG var modal is last modal here so this line wont work
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
		
	function clicked() {
		$("#myCarousel").remove();
		$("#recipeTitle").remove();
		$(".Recipe").remove();
		$("#filtercontent").collapse('hide');

		
	var yummlyQuery = "http://api.yummly.com/v1/api/recipes?_app_id=786bc228&_app_key=3ea220e1feb77f31ef0ab36fcf8accd4";
		
	for (var key in curAppliedFilters){
		console.log(key);
		console.log(curAppliedFilters[key]);
		console.log(curAppliedFilters[key] == "Beverages");
		if (key == "course") {
			if (curAppliedFilters[key] == "Main Dishes") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Main Dishes");
			} else if (curAppliedFilters[key] == "Desserts") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Desserts");
			} else if (curAppliedFilters[key] == "Side Dishes") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Side Dishes");
			} else if (curAppliedFilters[key] == "Lunch and Snacks") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Lunch");
			} else if (curAppliedFilters[key] == "Appetizers") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Appetizers");
			} else if (curAppliedFilters[key] == "Salads") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Salads");
			} else if (curAppliedFilters[key] == "Breads") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Breads");
			} else if (curAppliedFilters[key] == "Breakfast and Brunch") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Breakfast and Brunch");
			} else if (curAppliedFilters[key] == "Soups") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Soups");
			} else if (curAppliedFilters[key] == "Beverages") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Beverages");
			} else if (curAppliedFilters[key] == "Condiments and Sauces") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Condiments and Sauces");
			} else if (curAppliedFilters[key] == "Cocktails") {
				yummlyQuery = yummlyQuery.concat("&allowedCourse[]=course^course-Cocktails");
			}
		} else if (key == "cuisine") {
			if (curAppliedFilters[key] == "American") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-american");
			} else if (curAppliedFilters[key] == "Italian") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-italian");
			} else if (curAppliedFilters[key] == "Asian") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-asian");
			} else if (curAppliedFilters[key] == "Mexican") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-mexican");
			} else if (curAppliedFilters[key] == "French") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-french");
			} else if (curAppliedFilters[key] == "Southwestern") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-southwestern");
			} else if (curAppliedFilters[key] == "Barbecue") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-barbecue-bbq");
			} else if (curAppliedFilters[key] == "Indian") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-indian");
			} else if (curAppliedFilters[key] == "Chinese") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-chinese");
			} else if (curAppliedFilters[key] == "Mediterranean") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-mediterranean");
			} else if (curAppliedFilters[key] == "Greek") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-greek");
			} else if (curAppliedFilters[key] == "Spanish") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-spanish");
			} else if (curAppliedFilters[key] == "Thai") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-thai");
			} else if (curAppliedFilters[key] == "Cuban") {
				yummlyQuery = yummlyQuery.concat("&allowedCuisine[]=cuisine^cuisine-cuban");
			}
		} else if (key == "diet") {
			if (curAppliedFilters[key] == "Lacto vegetarian") {
				yummlyQuery = yummlyQuery.concat("&allowedDiet[]=388^Lacto%20vegetarian");
			} else if (curAppliedFilters[key] == "Ovo vegetarian") {
				yummlyQuery = yummlyQuery.concat("&allowedDiet[]=389^Ovo%20vegetarian");
			} else if (curAppliedFilters[key] == "Pescetarian") {
				yummlyQuery = yummlyQuery.concat("&allowedDiet[]=390^Pescetarian");
			} else if (curAppliedFilters[key] == "Vegan") {
				yummlyQuery = yummlyQuery.concat("&allowedDiet[]=386^Vegan");
			} else if (curAppliedFilters[key] == "Vegetarian") {
				yummlyQuery = yummlyQuery.concat("&allowedDiet[]=387^Lacto-ovo%20vegetarian");
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
				console.log(curAppliedFilters[key][foodAllergy]);
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
					yummlyQuery = yummlyQuery.concat("&allowedAllergy[]=395^Tree Nut-Free");
				} else if (curAppliedFilters[key][foodAllergy] == "Wheat") {
					yummlyQuery = yummlyQuery.concat("&allowedAllergy[]=392^Wheat-Free");
				}
			}
		} else if (key == "ingredientsToExclude") { //TODO fix strings after filters are implemented
			for (var ingredientsExclude in curAppliedFilters[key]) {
				yummlyQuery = yummlyQuery.concat("&excludedIngredient[]=" + encodeURIComponent((curAppliedFilters[key][ingredientsExclude]).trim()));
			}
		} else if (key == "ingredientsToInclude") { //TODO fix strings after filters are implemented
			for (var ingredientsInclude in curAppliedFilters[key]) {
				yummlyQuery = yummlyQuery.concat("&allowedIngredient[]=" + encodeURIComponent(curAppliedFilters[key][ingredientsInclude].trim()));
			}
		}
	} 
	console.log(yummlyQuery);

        $.ajax({
            type:'GET',
            url: yummlyQuery,
            success:function(data){
            	createRecipes(data.matches);
            }
        });
	}	
