/*=====================================================================================================================================*/
/*                                                                                                                                     
/*  Lucidchart                                                                                                                         
/*                                                                                                                                     
/*  Quickly save link to LucidChart diagrams
/*                                                                                                                                     
/*  TODO: 
/*    Add multiple sheets maybe                                                                                                                                  
/*    Add OPEN\EDIT BUTTON                                                                                                                               
/*    Add abilyty to save only id part of Lucidchart link  EG: instedad of '...lucidchart.com/documents/edit/e638f408-e1fa-4a70-b460-c3b6a0a8eaed/0' SAVE ONLY'e638f408-e1fa-4a70-b460-c3b6a0a8eaed'                                                                                                                             
/*                                                                                                                                     
/*                                                                                                                                     
/*                                                                                                                                    
/*=====================================================================================================================================*/

/* SET PROJECT NAME */
var project_name	= 'Lucidchart';
/** Dialog for save or open link to Lucidchart diagram
 *
 */
var Lucidchart = function(){

	var property_name = 'Lucidchart_link';
	
	/**
	 */
	this.linkSave = function(lucidchart_link) {
		//var lucidchart_link = showPrompt('Insert Lucidchart link', 'Insert Url to linked diagram.');
		if(lucidchart_link)
			PropertiesService.getDocumentProperties().setProperty(property_name, lucidchart_link);
	};
	/**
	 */
	this.linkOpen = function() {
		PropertiesService.getDocumentProperties().setProperty(property_name, lucidchart_link);
	};
	/**
	 */
	this.linkRemove = function(lucidchart_link) {
		PropertiesService.getDocumentProperties().deleteProperty(property_name);
	};

	/** showLinkDialog
	 */
	this.showLinkDialog = function() {
		var htmlString = '<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">'+
							'<style rel="stylesheet">input[type="button"]{margin-right:16px}</style>'+
							'<div>' + 
								'<input type="text" id="lucidchart-link" value="'+getLink()+'" style="width:100%" /><br><br>' +
								'<input type="button" value="Open" onclick="google.script.run.LucidchartlinkSave_post(document.getElementById(\'lucidchart-link\').value);window.open(document.getElementById(\'lucidchart-link\').value);google.script.host.close();" class="green" />' +							
								'<input type="button" value="Save" onclick="google.script.run.LucidchartlinkSave_post(document.getElementById(\'lucidchart-link\').value);google.script.host.close();" />' +
								'<input type="button" value="Remove" onclick="google.script.run.LucidchartlinkRemove_post();google.script.host.close();" />' +
							'</div>';
					  
		var htmlOutput = HtmlService
			.createHtmlOutput(htmlString)
			.setSandboxMode(HtmlService.SandboxMode.IFRAME)
			.setHeight(96);
	  
		SpreadsheetApp
			.getUi()
		 	.showModalDialog(htmlOutput, 'Link to diagram');  
	};
	/**
	 */
	var getLink = function() {
		var lucidchart_link = PropertiesService.getDocumentProperties().getProperty(property_name);
		return lucidchart_link ? lucidchart_link : '';
	};
		
    return this;
};



/*======================================================================================*/
/*  Lucidchart FUNCTIONS                                                                */
/*======================================================================================*/
/**
 */
function LucidchartlinkSave_post(lucidchart_link) {
	getLucidchart().linkSave(lucidchart_link);
	getLucidchart().linkOpen();
}
/**
 */
function LucidchartlinkRemove_post() {
	getLucidchart().linkRemove();
}



