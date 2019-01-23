/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  SnippetorSetSheetName                                                                                                              */
/*  Checkex if current sheet name if is valid for language, change if if not E.G: fooClass TO fooClass.js                              */
/*  Get new sheet name via user input dialogs                                                                                          */
/*                                                                                                                                     */
/*                                                                                                                                     */
/*=====================================================================================================================================*/
/* SnippetorSetSheetName
*	@(new SnippetorSetSheetName).getNewSheetName() getSheetNameValidateOrRename()  Checkex if current sheet name if is valid for language, change if if not E.G: fooClass TO fooClass.js 
*	@method getNewSheetName() string new sheet valid name
*
*/
var SnippetorSetSheetName = function() {
	var langs	= [ 'ahk', 'php', 'js', 'css', 'scss', 'less',  ];
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var sheet	= spread.getActiveSheet();
	var sheet_name;
	var sheet_name_old;
	
	/** getNewSheetName
	 */
	this.getSheetNameValidateOrRename = function() {
		sheet_name	= sheet.getName();
		sheet_name_old	= sheet_name;
		if (!validateSheetName())
			replaceSheetExtension();
		
		if (validateSheetName()){
			renameSheet();
			return sheet_name;
		}
		
		return false;
	};
	
	/** renameSheet
	 */
	var renameSheet = function() {
		var sheet_exists = spread.getSheetByName(sheet_name);
		if(!sheet_exists)
			sheet.setName(sheet_name);
	};
	
	/** getNewSheetName
	 */
	this.getNewSheetName = function() {
		sheet_name = getInputDialog('New sheet name', 'Insert Sheet Name');
		if(!sheet_name) return false;
		if (!validateSheetName())
			replaceSheetExtension();
		return (validateSheetName()) ? sheet_name : false;
	};

	/** validateSheetName
	 */
	var validateSheetName = function() {
		Logger.log('validateSheetName() =' + sheet_name.match(new RegExp( '.*\.('+ langs.join('|')+')$', "gi"))!==null );
		return( sheet_name.match(new RegExp( '.*\.('+ langs.join('|')+')$', "gi"))!==null );
	};
	/** replaceSheetExtension
	 */
	var replaceSheetExtension = function() {
		var sheet_name_ext = getInputDialog('Language extension of sheet name does not match', 'Insert sheet extension '+langs.join(', '));		
		if(!sheet_name_ext) return false;
			sheet_name = sheet_name.replace(/([^\s\.]+)\.*(.*)/,'$1.'+sheet_name_ext.toLowerCase().replace(/^\./,'') );
		Logger.log('replaceSheetExtension() sheet_name = ' + sheet_name );
			
	};
	/** getInputDialog
	*/
	var getInputDialog = function(title, message) {
		var ui	= SpreadsheetApp.getUi(); // Same variations.
		var result	= ui.prompt(title, message, ui.ButtonSet.OK_CANCEL);
		var button	= result.getSelectedButton();
		var input	= result.getResponseText();
		if (button == ui.Button.OK) 
			return input;
		else if (button == ui.Button.CANCEL)
			return false;
		else if (button == ui.Button.CLOSE)
			return null;
	};	


};
/* ================================================================= */
/*	TEST FUNCTIONS                                                   */
/* ================================================================= */
/** validateCurrentSheetName
*/
function getSheetNameValidateOrRename(){
	var sheet_name = (new SnippetorSetSheetName).getSheetNameValidateOrRename();
	Logger.log('sheet_name =' + sheet_name );
}
/** getSheetName
*/
function getNewSheetName(){
	var sheet_name = (new SnippetorSetSheetName).getNewSheetName();
	Logger.log('sheet_name =' + sheet_name );
}
