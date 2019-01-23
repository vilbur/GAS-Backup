/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  SheetName                                                                                                              */
/*  Checkex if current sheet name if is valid for language, change if if not E.G: fooClass TO fooClass.js                              */
/*  Get new sheet name via user input dialogs                                                                                          */
/*                                                                                                                                     */
/*                                                                                                                                     */
/*=====================================================================================================================================*/


/* SheetName
*	
*
*/
var SheetName = function() {
	var langs	= [ 'ahk', 'php', 'js', 'css', 'scss', 'less',  ];
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var sheet;
	//var sheet	= spread.getActiveSheet();	
	var sheet_name;
	var sheet_name_old;

	/** setSheet
	 */
	this.setSheet = function(_sheet) {
		sheet	= _sheet;
		sheet_name	= sheet.getName();
		sheet_name_old	= sheet_name;
		return this;
	};
	/** sheet Name Validate Or Rename
	 */
	this.validateOrRename = function() {
		
		if (!this.validateSheetName())
			replaceSheetExtension();
		
		if (this.validateSheetName()){
			renameSheet();
			return sheet_name;
		}
		
		return false;
	};

	
	/** getNewSheetName
	 */
	this.getNewSheetName = function() {
		sheet_name = getInputDialog('New sheet name', 'Insert Sheet Name');
		if(!sheet_name) return false;
		if (!this.validateSheetName())
			replaceSheetExtension();
		return (this.validateSheetName()) ? sheet_name : false;
	};
	
	/** this.validateSheetName
	 */
	this.validateSheetName = function() {
		//Logger.log('this.validateSheetName('+_sheet.getName()+')');
		return( sheet_name.match( '.*\.('+ langs.join('|')+')$', 'gi') );
	};
    
 	
	/** renameSheet
	 */
	var renameSheet = function() {
		var sheet_exists = spread.getSheetByName(sheet_name);
		if(!sheet_exists)
			sheet.setName(sheet_name);
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


	return this;
};
/* ================================================================= */
/*	TEST FUNCTIONS                                                   */
/* ================================================================= */
/** validateCurrentSheetName
*/
function SheetName_validateOrRename(){
	
	var sheet_name = (new SheetName()).setSheet( SpreadsheetApp.getActiveSpreadsheet().getActiveSheet() )
										.validateOrRename();
	Logger.log('sheet_name =' + sheet_name );
}
///** getSheetName
//*/
//function getNewSheetName(){
//	var sheet_name = (new SheetName).getNewSheetName();
//	Logger.log('sheet_name =' + sheet_name );
//}
