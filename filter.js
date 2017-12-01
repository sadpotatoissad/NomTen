//curAppliedFilters stores all the filters that the user has selected
//each key is the filter name and each value is the filter value
//all posible filter keys: "time", "course", "allergies", "cuisine", "diet", "servingSize", "ingredientToExclude", "ingredientsToInclude"
//example {key: value}  : {"time" : "Under 20"}
//curAppliedFilters is updated with any update to filters
var curAppliedFilters = {};

function percentageInFridge(){
  var elem = "InFridge";
  var str = document.getElementById(elem).value;
  curAppliedFilters["percentage"] = str.trim();
  console.log(curAppliedFilters);
}

function myFunction(elem) {
    //TO DO fix display bug that adds a new filter when i just want to update a existing one
    var selection = elem.innerHTML;
    var key = elem.parentNode.parentNode.parentNode.id;
    var name = elem.parentNode.parentNode.parentNode.firstChild.nextSibling.innerHTML;
    console.log(name);
    console.log(key);
    var filterId = 'f' + key;
    var removeId = 'r' + key;
    //var nodelist = document.getElementById("filter-position").childNodes[1].childNodes[0].inne;
    console.log(filterId);

    var i;
    var filter_exists = false; //used for debugging remove later
    var b = curAppliedFilters[key]
    if(typeof b !== "undefined") {
    // filter already exists needs to be updated
          var tmp = document.getElementById(filterId).innerHTML;
          document.getElementById(filterId).innerHTML =tmp.split(":")[0] + ": " + selection;
          curAppliedFilters[key] = selection;
          console.log(curAppliedFilters);
  }else{
  
    document.getElementById("filter-position").innerHTML += "<div><button type=\"buttom\" class=\"btn btn-default btn-sm\" id=" + removeId + " onclick=\"removeClicked(" + key + ")\"> <span class=\"glyphicon glyphicon-remove\"></span><p id=" + filterId + ">" + name + ": </p></button></div>";
    document.getElementById(filterId).innerHTML += selection;
    curAppliedFilters[key] = selection;
    console.log(curAppliedFilters);
  }
}


function removeClicked(key) {
    var id = 'r' + key.id;
    console.log(id);
    var item = document.getElementById(id);
    item.parentNode.parentNode.removeChild(item.parentNode);
    delete curAppliedFilters[key.id];
    console.log(curAppliedFilters);
}

function createlstWant(){
  var input = document.getElementById("iWant").value;
  var lst = input.split(",");
  i = 0;
  var final_lst;
  for (i = 0; i < lst.length; i++){
    lst[i] = lst[i].trim().toLowerCase();
  }
  curAppliedFilters["ingredientsToInclude"] = lst;
  console.log(lst);
  console.log(curAppliedFilters);
}

function createlstDontWant(){
  var input = document.getElementById("dontWant").value;
  var lst = input.split(",");
  i = 0;
  var final_lst;
  for (i = 0; i < lst.length; i++){
    lst[i] = lst[i].trim().toLowerCase();
  }
  curAppliedFilters["ingredientsToExclude"] = lst;
  console.log(lst);
  console.log(curAppliedFilters);
}

function createlstAllergies(){
  var checkedBoxes = document.querySelectorAll('.checkbox-inline input:checked');
  var lst = [];
  var i = 0;
  for (i = 0; i < checkedBoxes.length; i++){
    var str = checkedBoxes[i].parentNode.innerHTML.toString();
    var l = str.split("value=\"\">")[1].trim();
    lst.push(l);
  }
  curAppliedFilters["allergies"] = lst;
  console.log(lst);
}

function jump(h){
    var url = location.href;               //Save down the URL without hash.
    location.href = "#"+h;                 //Go to the target element.
    history.replaceState(null,null,url);   //Don't like hashes. Changing it back.
}
