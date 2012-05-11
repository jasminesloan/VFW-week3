// Jasmine Sloan
// Week 2 VFW
// 05/07/2012


//Wait until DOM is ready.
window.addEventListener("DOMContentLoaded", function(){


	
	//getElementsById Function
	var $ = function(x){
		var theElement = document.getElementById(x);
		return theElement;
	};

	//create select field element and populate with options.
	var makeCats = function(){
		var formTag = document.getElementsByTagName("form"), //formTag is an array of all the form tags.
			selectLi = $('select'),
			makeSelect = document.createElement('select');
			makeSelect.setAttribute("id","groups");
		for(var i=0, j=mixtapeGenres.length; i<j; i++){
			var makeOption = document.createElement('option');
			var optText = mixtapeGenres[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);	
	};

	//Find value of selected radio button.
	var getSelectedRadio = function(){
		var radios = document.forms[ 0 ].answer;
		for(var i=0; i<radios.length; i++){
			if(radios[i].checked){
				purchaseDate = radios[i].value;
			}
		}
	};

	var getCheckboxValue =  function(){
		if($('yes').checked){
			wishListValue = $('yes').value;
		}else{
			wishListValue = "No";
		}
	};

	var toggleControls = function(n){
		switch(n){
			case "on":
				$('mixtapeForm').style.display = "none";
				$('clear').style.display = "inline";
				$('displayLink').style.display = "none";
				$('addNew').style.display = "inline";
				break;
			case "off":
				$('mixtapeForm').style.display = "block";
				$('clear').style.display = "inline";
				$('displayLink').style.display = "inline";
				$('addNew').style.display = "none";
				$('items').style.display = "none";
				break;
			default:
				return false;
		}
	};
	
	 var storeData = function(key){
		if (!key){
				var id 				=Math.floor(Math.random()*100000001);
		}else{
				var id = key;
		}
		
		//Gather up all our form field values nd store in an object.
		//Object properties contain array with the form label and input values.
		getSelectedRadio();
		getCheckboxValue();
		var item				= {};
			item.group 			= ["Genre:", $('groups').value];
			item.email			= ["Email", $('email').value];
			item.pword 			= ["Password", $('pword').value];
			item.purchase 		= ["Purchase:", purchaseDate];
			item.wishlist 		= ["Added to Wish List", wishListValue];
			item.quantity 		= ["Quantity", $('quantity').value];
			item.suggestions	= ["Suggestions", $('suggestions').value];
		//Save data into Local Storage: Use stringify to convert our object
		localStorage.setItem("id", JSON.stringify(item));
		alert("Contact Saved!");
	};
	
	//Create visiable storage
	 var getData = function(){
	 	console.log("id");
		toggleControls("on");
		if(localStorage.length === 0){
			alert("There is no data in Local Storage.");
		}
		//Write data from local storage to browser
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$('items').style.display = "block";
			for(var i=0, len=localStorage.length; i<len;i++){
			var makeLi = document.createElement('li');
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//Convert the string from the local storage value back to an object by using JSON.parse()
			var obj = JSON.parse(value);
			var makeSubList = document.createElement('ul');
			makeLi.appendChild(makeSubList);
			for(var n in odj){
				var makeSubLi = document.createElement('li');
				makeSubList.appendChild(makeSubLi);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubLi.innerHTML = optSubText;
			}
		}
	};

	var clearLocal = function(){
		if(localStorage.length === 0){
			alert("There is no data to clear.");
		}else{
			localStorage.clear();
			alert("All contacts are deleted!");
			window.location.reload();
			return false;
		}
	};

//Variable defaults, events, and calls
	var mixtapeGenres = ["--Choose A Genre--", "Dirty South", "Gospel", "Hip Hop", "Miami Bass", "Old School", "Oomp Camp Albums", "R&B/Slow Jams", "Reggae"];
	var purchaseDate;
	var	wishListValue = "No";
	makeCats();
	var diplayLink = $('displayLink');
	displayLink.addEventListener("click", getData);
	var clearLink = $('clear');
	clearLink.addEventListener("click", clearLocal); 
	var save = $("save");
	save.addEventListener("click", storeData);
	
});