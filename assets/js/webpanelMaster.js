// WebpanelMaster.js rewrite

window.onload = function(){

	// Executes when complete page is fully loaded, including all frames, objects and images

	pageIndex = window.location.pathname.split("/").pop();

	if (pageIndex == "WebsiteManager.html"){

		console.log("LOADING Website Manager 2.0");

		initFunctions();

		activateStaticContentPanels();
		activateDynamicContentPanels();
		activateUploadModule();

		console.log("Website Manager 2.0 Loaded");
	}

}

function initFunctions(){

	function initYearDropdowns(dropdownClassName){

		var dateObject = new Date();
		var currentYear = dateObject.getFullYear();

		$(dropdownClassName).empty();
		$(dropdownClassName).each(function(){

			$(this).val(currentYear);

			for (var year = currentYear; year >= 2014; year--){
				$(this).append($("<option></option>").val(year).html(year));
			}

			
		})

	}

	initYearDropdowns(".dropdownYearInput");
	initYearDropdowns(".dropdownYearInput2");

}

// Neccessary methods

function flipButton(button, text, status, special){

	console.log("Flipping Button:" + button + " | " + text + ", " + status);

	button.text(text);

	if (status == "danger"){
		button.removeClass("btn-success");
		if (special){
			$(button).append('<i class="fa fa-user-times spacedIcon"></i>');
		} else {
			$(button).append('<i class="fa fa-remove spacedIcon"></i>');
		}
		
	} else {
		button.removeClass("btn-danger");
		if (special){
			$(button).append('<i class="fa fa-user-plus spacedIcon"></i>');
		} else {
			$(button).append('<i class="fa fa-plus spacedIcon"></i>');
		}
		
	}

	button.addClass("btn-" + status);
	
}

function generateId(){
	return Math.random().toString(36).substring(7);
}

function checkFields(inputFields){

	for (inputFieldIndex = 0; inputFieldIndex < inputFields.length - 1; inputFieldIndex++){

		var inputField = inputFields[inputFieldIndex];

		var fieldValue = (inputField.val() != null) ? inputField.val() : "";

		if (fieldValue.replace(/ /g, "") == ""){
			return false;
		}
	
	}

	return true;
	
}

// Actual work

function activateStaticContentPanels(){

	//
	$("#teamHistorySelector").empty();

	var dateObject = new Date();

	var queryYear = dateObject.getFullYear();

	var baseObject = document.createElement("optgroup");
	baseObject.label = "History";
	$(baseObject).appendTo($("#teamHistorySelector"));

	for (var year = dateObject.getFullYear(); year >= 2014; year--){
		$(baseObject).append($("<option></option>").val(year).html("Season " + year));
	}

	$("#teamHistorySelector").val(queryYear);

	//
	var py0 = $("#form_People_yearJoined");
	var py1 = $("#form_People_yearGraduated");

	py0.change(function(){
		if (py0.val() > py1.val()){
			alert("The year this person joined the team cannot be after the year they left.");
		}
	})

	py1.change(function(){
		if (py0.val() > py1.val()){
			alert("The year this person left the team cannot be before the year they joined.");
		}
	})

	//
	$("#btn_AddPeopleTitle").click(function(){

		console.log("Adding Title to Person");

		createPeopleTitle();

	})


	//
	var btn_changeView = $("#btn_ChangePersonView");

	btn_changeView.click(function(){

		if (btn_changeView.text() == "View Mentors"){
			btn_changeView.text("View Leaders");
		} else {
			btn_changeView.text("View Mentors");
		}

		console.log("Switching view to " + btn_changeView.text());

		$("#panel_PeopleOrder").empty();

		// Load people
	})

	//
	$("#btn_AddRobotPlaylist").click(function(){

		console.log("Adding robot competition and playlist");

		var titleBox = $("#robotPlaylistBar-Template").clone();

		$(titleBox).children("#robotPlaylistDelete").click(function(){
			titleBox.remove();
		})

		$(titleBox).attr("id", "");

		$(titleBox).appendTo($("#robotPlaylistFieldBox"));

	})
}

// Helpers

function createPeopleTitle(existingData){

	var titleBox = $("#personTitleBar-Template").clone();

	var titleInput = $(titleBox).children("#personTitleInput");
	var y0 = $(titleBox).children("#personTitleY0Input");
	var y1 = $(titleBox).children("#personTitleY1Input");
	var py0 = $("#form_People_yearJoined");

	if (existingData){
		titleInput.val(existingData.title);
		y0.val(existingData.startYear);
		y1.val(existingData.endYear);
	}

	y0.change(function(){

		console.log("Year changed.");

		if (y0.val() > y1.val()){
			y0.val(y1.val());
			alert("Your start year cannot occur after your end year!");
		}

		if (y0.val() < py0.val()){
			alert("A person should not have a title before the year they were on the team.")
		}
	})

	y1.change(function(){

		console.log("Year changed.");

		if (y0.val() > y1.val()){
			y1.val(y0.val());
			alert("Your end year cannot occur before your start year!");
		}
	})


	$(titleBox).children("#personTitleDelete").click(function(){
		titleBox.remove();
	})

	$(titleBox).attr("id", "");

	$(titleBox).appendTo($("#personTitleFieldBox"));
}


//

function activateDynamicContentPanels(){

	var formPanelNames = ["Contact", "Sponsor", "Robot", "People"];

	var dataType = {};

	function loadPanelItems(panelName){

		var formPanelName = (panelName != "People") ? panelName + "s" : "People";

		console.log("Loading " + formPanelName + " of " + panelName);

		dataType[panelName].panelPanel.empty();

		for (item in dataType[panelName].panelItems) {
			dataType[panelName].panelPanel.append('<button class="btn btn-default SortableDisplayButton" value="' + item + '" type="button">' + dataType[panelName].panelItems[item].name + '</button>');
		}

		sortable(dataType[panelName].panelPanel, {
			forcePlaceholderSize: true,
			placeholderClass: "placeholderClass"
		})

		dataType[panelName].panelPanel.children().click(function(){

			dataType[panelName].selectedPanelButton = $(this);
			dataType[panelName].selectedPanelMode = "Destroy";

			console.log("Selected a " + panelName);

			dataType[panelName].panelForm.removeClass("panelNotActive");

			console.log("Val: " + $(this).val());

			var itemObject = dataType[panelName].panelItems[$(this).val()];

			switch(panelName){
				case "Contact":
					//
					$("#form_Contact_name").val(itemObject.name);
					$("#form_Contact_information").val(itemObject.contact);

					break;
				case "Sponsor":
					//
					$("#form_Sponsor_name").val(itemObject.name);
					$("#form_Sponsor_link").val(itemObject.link);
					// Logo

					break;
				case "Robot":
					//
					$("#form_Robot_name").val(itemObject.name);
					$("#form_Robot_seasonYear").val(itemObject.seasonYear);
					$("#form_Robot_description").val(itemObject.description);
					$("#form_Robot_videos").val(itemObject.videos);
					$("#form_Robot_matchPlaylists").val(itemObject.matchPlaylists);
					$("#form_Robot_CADiFrame").val(itemObject.CADiFrame);

					break;
				case "People":
					//
					$("#form_People_name").val(itemObject.name);
					$("#form_People_yearJoined").val(itemObject.yearJoined);
					$("#form_People_yearGraduated").val(itemObject.yearGraduated);
					// Logo

					// Titles
					for (index in itemObject.titles){
						createPeopleTitle(itemObject.titles[index]);
					}

					break;
			}

			flipButton(dataType[panelName].panelUseButton, "Delete " + ((panelName != "People") ? panelName : "Person") , "danger");
			dataType[panelName].panelUpdateButton.removeClass("VisibilityHidden");

		});

	}

	function btn_useCallback(){

		var panelName = $(this).attr("id").replace("Btn_Use", "");

		if (dataType[panelName].selectedPanelMode == "Add"){

			console.log("Adding " + panelName);

			saveSelectedItem(panelName);

		} else if (dataType[panelName].selectedPanelMode == "Destroy"){

			console.log("Removing " + panelName);

			delete dataType[panelName].panelItems[dataType[panelName].selectedPanelButton.attr("value")];

		} else {
			console.log("Invalid Panel Management Mode for '" + panelName + "' --> " + dataType[panelName].selectedPanelMode);
		}

		dataType[panelName].panelForm.addClass("panelNotActive");

		loadPanelItems(panelName);

	}

	function btn_updateCallback(){

		var panelName = $(this).attr("id").replace("Btn_Update", "");

		console.log("Updating " + panelName);

		saveSelectedItem(panelName, true);

	}

	function btn_addCallback(){

		var panelName = $(this).attr("id").replace("Btn_Add", "");

		console.log("Adding at " + panelName);

		switch(panelName){
			case "Contact":
				//
				$("#form_Contact_name").val("");
				$("#form_Contact_information").val("");

				break;
			case "Sponsor":
				//
				$("#form_Sponsor_name").val("");
				$("#form_Sponsor_link").val("");

				break;
			case "Robot":
				//
				$("#form_Robot_name").val("");
				$("#form_Robot_seasonYear").val("");
				$("#form_Robot_description").val("");
				$("#form_Robot_videos").val("");
				$("#form_Robot_matchPlaylists").val("");
				$("#form_Robot_CADiFrame").val("");

				break;
			case "People":
				//
				$("#form_People_name").val("");
				$("#form_People_yearJoined").val("");
				$("#form_People_yearGraduated").val("");

				break;
		}

		flipButton(dataType[panelName].panelUseButton, "Add " + ((panelName != "People") ? panelName : "Person"), "success");
		dataType[panelName].panelUpdateButton.addClass("VisibilityHidden");

		dataType[panelName].selectedPanelMode = "Add";

		dataType[panelName].panelForm.removeClass("panelNotActive");

	}

	function saveSelectedItem(panelName, isUpdate){

		console.log("Saving item(s) at " + panelName);

		var proceed = true;

		switch(panelName){
			case "Contact":

				proceed = checkFields(
					$("#form_Contact_name"),
					$("#form_Contact_information")
				);

				break;
			case "Sponsor":
				
				proceed = checkFields(
					$("#form_Sponsor_name"),
					$("#form_Sponsor_link")
				);

				break;
			case "Robot":
				
				proceed = checkFields(
					$("#form_Robot_name"),
					$("#form_Robot_description"),
					$("#form_Robot_videos"),
					($("#form_Robot_matchPlaylists")),
					$("#form_Robot_CADiFrame")
				);

				break;
			case "People":
				
				proceed = checkFields(
					$("#form_People_name"),
					$("#form_People_yearJoined"),
					$("#form_People_yearGraduated")
				);

				break;
		}

		if (!proceed){
			alert("A field in the " + panelName + " section has not been filled out. Please do not leave any blanks.");
			return;
		}

		var itemId = (isUpdate) ? dataType[panelName].selectedPanelButton.attr("value") : generateId();

		var saveObject = {}

		switch(panelName){
			case "Contact":
				//
				saveObject = {
					name: $("#form_Contact_name").val(),
					contact: $("#form_Contact_information").val()
				};

				break;
			case "Sponsor":
				//
				saveObject = {
					name: $("#form_Sponsor_name").val(),
					link: $("#form_Sponsor_link").val(),
					logo: ""
				};

				break;
			case "Robot":

				saveObject = {

					name : $("#form_Robot_name").val(),
					seasonYear : $("#form_Robot_seasonYear").val(),
					description : $("#form_Robot_description").val(),

					videos : $("#form_Robot_videos").val(),
					type : $("#robotType").val(),

					matchPlaylists : [],
				};

				$("#robotPlaylistFieldBox").children("div").each(function(){

					var compTitle = $(this).children("#robotPlaylistInput-comp");
					var compPlaylist = $(this).children("#robotPlaylistInput-url");

					if (compTitle.val().replace(/ /g, "") != ""){

						var compTitleObject = {
							title: compTitle.val().trim(),
							playlist: compPlaylist.val().trim()
						};

						saveObject.matchPlaylists.push(compTitleObject);
					}

				})

				break;
			case "People":
				
				saveObject = {
					name : $("#form_People_name").val(),
					yearJoined : $("#form_People_yearJoined").val(),
					yearGraduated : $("#form_People_yearGraduated").val(),
					headshot : "",
					titles : []
				};

				$("#personTitleFieldBox").children("div").each(function(){

					var titleName = $(this).children("#personTitleInput");
					var titleY0 = $(this).children("#personTitleY0Input");
					var titleY1 = $(this).children("#personTitleY1Input");

					if (titleName.val().replace(/ /g, "") != ""){

						var titleObject = {
							title : titleName.val(),
							startYear : titleY0.val(),
							endYear : titleY1.val()
						}

						saveObject.titles.push(titleObject);
					}
				})

				break;
		}

		dataType[panelName].panelItems[itemId] = saveObject;

	}

	function btn_saveCallback(){

		var panelName = $(this).attr("id").replace("Btn_Save", "");

		console.log("Saving " + panelName);

		$(this).addClass("disabled");

		// Saving

		$.ajax({
			type: "POST",
			url: "assets/php/setPageData.php",
			data: {request : panelName, objectData : JSON.stringify(dataType[panelName].panelItems)},
			success: function(response) {

				// update
				alert(response);
				$(this).removeClass("disabled");
			}
		});
	}


	for (formPanelNameIndex = 0; formPanelNameIndex < formPanelNames.length; formPanelNameIndex++){

		// Get variation of variable names
		var panelName = formPanelNames[formPanelNameIndex];
		var formPanelName = (panelName != "People") ? panelName + "s" : "People";
		
		// Get the buttons and divs
		var panelForm = $("#form_" + formPanelName);
		var panelPanel = $("#panel_" + formPanelName);

		var panelUseButton = $("#Btn_Use"+panelName);
		var panelUpdateButton = $("#Btn_Update"+panelName);
		var panelAddButton = $("#Btn_Add"+panelName);

		var panelSaveButton = $("#Btn_Save"+formPanelName);

		dataType[panelName] = {};

		dataType[panelName].panelForm = panelForm;
		dataType[panelName].panelPanel = panelPanel;

		dataType[panelName].panelUseButton = panelUseButton;
		dataType[panelName].panelUpdateButton = panelUpdateButton;
		dataType[panelName].panelAddButton = panelAddButton;

		dataType[panelName].panelSaveButton = panelSaveButton;

		console.log("Use:" + panelUseButton + ", Update:" + panelUpdateButton + ", Add:" + panelAddButton + ", Save:" + panelSaveButton);

		// Variables

		dataType[panelName].selectedPanelButton;
		dataType[panelName].selectedPanelMode = "";


		// Load via php

		var requestFromPanelName = {
			"Contact" 	: "contactData",
			"Sponsor" 	: "sponsorData",
			"Robot" 	: "robotData",
			"People" 	: "teamData"
		};

		$.ajax({
			type: "POST",
			url: "assets/php/getPageData.php",
			data: {request : requestFromPanelName[panelName]},
			success: function(response) {

				console.log("LOAD RESPONSE: " + response);

				if (response == false){
					alert("An error has occured. Consider reloading the page.");
					return;
				}

				var dataObject = JSON.parse(response);

				dataType[panelName].panelItems = dataObject;

				// Bind functions to buttons

				panelForm.addClass("panelNotActive");

				panelAddButton.click(btn_addCallback);

				panelUpdateButton.click(btn_updateCallback);

				panelUseButton.click(btn_useCallback);

				panelSaveButton.click(btn_saveCallback);

				loadPanelItems(panelName);
			}
		});

		

	}

}

function activateUploadModule(){

	// Uploading Files

	var imageSelectorModal = $("#ImageSelectorModal");
	var dropdownToggle = $("#ImageSelectorModalDirectoryDropdown");

	var directories = ["Headshots", "SplashHeaders", "SponsorLogos", "OtherImages"];


	var selectedImageUrl = "";
	var currentUploadFileBox;

	$(".uploadFileButton").click(function(){

		currentUploadFileBox = $(this).parent();

		imageSelectorModal.modal("show");

		// Set the working directory
		loadFilesInDirectory();

	});

	$("#imageSelectorModalDropdownMenu").children().click(function(){
		$("#imageSelectorModalDropdownSelected").text($(this).text());
		loadFilesInDirectory();
	});

	function deselectSelected(){
		$(".imageSelectorPreviewActive").each(function(){

			$(this).removeClass("imageSelectorPreviewActive");

		});
	}

	function prepareSelectEvents(){

		$(".imageSelectorPreview").each(function(){

			deselectSelected();

			$(this).click(function(){
				console.log("Selected " + $(this).attr("src"));
				$(this).addClass("imageSelectorPreviewActive");
				selectedImageUrl = $(this).attr("src");
			})

		});
	}

	$("#imageSelectorModalUploadPreviewActual").click(function(){
		deselectSelected();
		$(this).addClass("imageSelectorPreviewActive");
		selectedImageUrl = "Upload";
	})

	function loadFilesInDirectory(){
	    
	    $(".imageSelectorModalImages").empty();

		var directory = "/assets/img" + $("#imageSelectorModalDropdownSelected").text();

		if (window.location.href.indexOf("192.168") != -1){
			directory = $("#imageSelectorModalDropdownSelected").text();
		}

		console.log("directory: " + directory);
		
		$.ajax({
            url : directory,
            success: function (data) {
                $(data).find("a").attr("href", function (i, fileName) {
                    if( fileName.match(/\.(jpe?g|png|gif)$/) ) {
                        $(".imageSelectorModalImages").append("<img id='" + fileName + "' class='imageSelectorPreview' src='" + directory + "/" + fileName + "'>");
                    } 
                });
                prepareSelectEvents();
            },
            error : function(e){
            	console.log("An error has occured");
            	console.log(e);
            	$(".imageSelectorModalImages").append("<br><p>Failed to grab images from directory. Try again?</p>");
            }
        });
        
	}

	$("#imageSelectorModalSelectButton").change(function(){

		console.log("Upload detected");

		var reader = new FileReader();
		reader.onload = function(){
			$("#imageSelectorModalUploadPreviewActual").attr("src", reader.result);
		}
		
		var file = $("#imageSelectorModalSelectButton")[0].files[0];
		reader.readAsDataURL(file);

	});

	function doUpload(){

		var file = $("#imageSelectorModalSelectButton")[0].files[0];

		// Ensure it's an image
	    if(file.type.match(/image.*/)) {
	        console.log('An image has been loaded');

	        // Load the image
	        var reader = new FileReader();
	        reader.onload = function (readerEvent) {
	            var image = new Image();
	            image.onload = function (imageEvent) {

	                // Resize the image
	                var canvas = document.createElement('canvas'),
	                    max_height = 1920,
	                    max_width = 1080,
	                    width = image.width,
	                    height = image.height;
	                if (width > height) {
	                    if (width > max_width) {
	                        height *= max_width / width;
	                        width = max_width;
	                    }
	                } else {
	                    if (height > max_height) {
	                        width *= max_height / height;
	                        height = max_height;
	                    }
	                }
	                canvas.width = width;
	                canvas.height = height;
	                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
	                var dataUrl = canvas.toDataURL('image/jpeg');
	                var resizedImage = dataURLToBlob(dataUrl);
	                /*
	                $.event.trigger({
	                    type: "imageResized",
	                    blob: resizedImage,
	                    url: dataUrl
	                });
	                */
	            }
	            image.src = readerEvent.target.result;
	        }
	        reader.readAsDataURL(file);
	    }

	};

	$("#imageSelectorModalUploadButton").click(function(){

		$(this).addClass("disabled");
		$("#imageSelectorModalUploadBar").removeClass("VisibilityHidden");
		$("#imageSelectorModalUploadBar").attr('aria-valuenow', 10);

		deselectSelected();
		$("#imageSelectorModalUploadPreviewActual").addClass("imageSelectorPreviewActive");
		selectedImageUrl = "Upload";

		doUpload();

	})
}

/* Utility function to convert a canvas to a BLOB */
var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}
/* End Utility function to convert a canvas to a BLOB      */