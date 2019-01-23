/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  Lucidchart                                                                                                                          */
/*                                                                                                                                     */
/*=====================================================================================================================================*/

/** Dialog for save or open link to Lucidchart diagram
 *
 */
var Lucidchart = function(){

	var property_name = 'Lucidchart_link';
	/**
	 */
	this.saveLink = function(lucidchart_link) {
		//var lucidchart_link = showPrompt('Insert Lucidchart link', 'Insert Url to linked diagram.');
		if(lucidchart_link)
			PropertiesService.getDocumentProperties().setProperty(property_name, lucidchart_link);
		
	};
	/**
	 */
	this.getLink = function() {
		var lucidchart_link = PropertiesService.getDocumentProperties().getProperty(property_name);
		return lucidchart_link ? lucidchart_link : '';
	};
		
	/** linkDialog
	 */
	this.linkDialog = function() {
		var htmlString = '<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">'+
						  '<div>' + 
							'<input type="text" id="lucidchart-link" value="'+this.getLink()+'" style="width:100%" /><br><br>' +
							'<input type="button" value="Open" onclick="google.script.run.LucidchartSaveLink(document.getElementById(\'lucidchart-link\').value);window.open(document.getElementById(\'lucidchart-link\').value);google.script.host.close();" />' +
						  '</div>';
					  
		var htmlOutput = HtmlService
			.createHtmlOutput(htmlString)
			.setSandboxMode(HtmlService.SandboxMode.IFRAME)
			.setHeight(96);
	  
		SpreadsheetApp
			.getUi()
		 	showModalDialog(htmlOutput, 'Link to diagram');  
	};
	
    return this;
};



/*======================================================================================*/
/*  Lucidchart FUNCTIONS                                                                */
/*======================================================================================*/
/**
 */
function LucidchartSaveLink(lucidchart_link) {
	(new Lucidchart()).saveLink(lucidchart_link);
}



