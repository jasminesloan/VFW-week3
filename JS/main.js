// Jasmine Sloan
// Week 3 VFW
// 05/14/2012


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
		for(var i=0; i < radios.length; i++){
			if(radios[i].checked){
				purchaseDate = radios[i].value;
			}
		}
	};

	var getCheckboxValue =  function(){
		if($('Yes').checked){
			wishListValue = $('Yes').value;
		}else{
			wishListValue = "No";
		}
	};

	var toggleControls = function(n){
		switch(n){
			case "on":
				$('searchForm').style.display = "none";
				$('clear').style.display = "inline";
				$('displayLink').style.display = "none";
				$('addNew').style.display = "inline";
				break;
			case "off":
				$('searchForm').style.display = "block";
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
	 	//If there is no key, this is a brand new item and we need a new key.
		if (!key){
				var id 				=Math.floor(Math.random()*100000001);
		}else{
			//Set the id to the existing key we're editing so that it will save our data.
			//The key is the same that's been passed along from the editSubmit event handler
			//to the validate function, and the passed here, into the storeData function.
			id = key;
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
			item.date 			= ["Date", $('date').value];
			item.quantity 		= ["Quantity", $('quantity').value];
			item.suggestions	= ["Suggestions", $('suggestions').value];
		//Save data into Local Storage: Use stringify to convert our object
		localStorage.setItem(id, JSON.stringify(item));
		alert("Mixtape Saved!");
	};
	
	//Create visiable storage
	 var getData = function(){
	 	//console.log("id");
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
			var linksLi = document.createElement('li');
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//Convert the string from the local storage value back to an object by using JSON.parse()
			var obj = JSON.parse(value);
			var makeSubList = document.createElement('ul');
			makeLi.appendChild(makeSubList);
			for(var n in obj){
				var makeSubLi = document.createElement('li');
				makeSubList.appendChild(makeSubLi);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubLi.innerHTML = optSubText;
				makeSubLi.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi); //Create our edit and delete buttons/link for each item in local storage.
		}
	};


	//Make Item Links
	//Create the edit and delete links for each stored item when displayed.
	function makeItemLinks(key, linksLi){
		//add edit single item link
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Mixtape";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);


		//add line break
		var breakTag = document.createElement('br');
		linksLi.appendChild(breakTag);

		//Add a delete single item link
		var deleteLink = document.createElement('a');
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Mixtape";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	};

	function editItem(){
		//Grab the data from our item from Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		//Show the form
		toggleControls("off");
		//populate the form fields with current localStorage value.
		$('groups').value = item.group[1];
		$('email').value = item.email[1];
		$('pword').value = item.pword[1];
		var radios = document.forms[0].answer;
		for(var i=0; i < radios.length; i++){
			if(radios[1].value == "Now" && item.purchaseDate[1] =="Now"){
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "Place in Que" && item.purchase[1] == "Place in Que"){
				radios[i].setAttribute("checked", "checked");
			}
		}
		if(item.wishList[1] == "Yes"){
			$('yes').setAttribute("checked", "checked");
		}
		$('date').value = item.date[1];
		$('quantity').value = item.quantity[1];
		$('suggestions').value = item.suggestions[1];

		//Remove the initial listener from the input "save mixtape" button.
		save.removeEventListener("click", storeData);
		//Change submit button value to edit button
		$('save').value = "Edit Mixtape";
		var editSubmit = $('submit');
		//Save the key value established in this function as a property of the editSubmit event
		//so we can use that value when save the data we edited
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
	};

	var clearLocal = function(){
		if(localStorage.length === 0){
			alert("There is no data to clear.");
		}else{
			localStorage.clear();
			alert("All mixtapes are deleted!");
			window.location.reload();
			return false;
		}
	};

	function deleteItem(){
		var ask = confirm("Are you sure you want to delete this mixtape?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Mixtape was deleted!");
			window.location.reload();
		}else{
			alert("Mixtape was not deleted.");
		}
	};

	function validate(e){
		//Define the elements we want to check
		var getGroup = $('groups');
		var getEmail = $('email');
		var getPassword = $('pword');

		//Reset Error Message
		errMsg.innerHTML = "";
		getGroup.style.border = "1px solid black";
		getEmail.style.border = "1px solid black";
		getPassword.style.border = "1px solid black";

		//Get error message
		var messageAry = [];
		//Group Validation
		if(getGroup.value=== "--Choose A Genre--"){
			var groupError = "Please Chose A Genre";
			getGroup.style.border = "1px solid red";
			messageAry.push(groupError);
		}

		//Email Validation
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w)*(\.\w{2,3})+$/;
		if(!(re.exec(getEmail.value))){
			var emailError = "Please enter an Email Address.";
			getEmail.style.border = "1px solid red";
			messageAry.push(emailError);
		}

		//Password Validation
		if(getPassword.value=== ""){
			var passwordError = "Please enter your Password.";
			getPassword.style.border = "1px solid red";
			messageAry.push(passwordError);
		}

		//If there were errors, display them on the screen
		if(messageAry.length >= 1){
			for(var i=0, j=messageAry.length; i < j; i++){
				var txt = document.createElement('li');
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
			e.preventDefault();
			return false;
		}else{
			//If all is Ok, save our data! Send key value which came from the edit data function
			//Remember this key value was passed through the editSubmit eventListener as a property
			storeData(this.key);
		}

		
	};

//Variable defaults, events, and calls
	var mixtapeGenres = ["--Choose A Genre--", "Dirty South", "Gospel", "Hip Hop", "Miami Bass", "Old School", "Oomp Camp Albums", "R&B/Slow Jams", "Reggae"];
	var purchaseDate;
	var	wishListValue = "No";
	var errMsg = $('errors');
	makeCats();
	var diplayLink = $('displayLink');
	displayLink.addEventListener("click", getData);
	var clearLink = $('clear');
	clearLink.addEventListener("click", clearLocal); 
	var save = $("save");
	save.addEventListener("click", validate);
});