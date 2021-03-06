/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  SheetOutputFinder                                                                                                              */
/*                                                                                                                                     */
/*=====================================================================================================================================*/
/* 
 */

var SheetOutputFinder = function() {
	/*====== PRIVATE PROPERTIES ======*/
	var self	= this;
	var sheet;	
	var sheet_id;		
	var _Sheeter	= getSheeter();
	var _SheetName	= new SheetName();
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var all_sheets 	= spread.getSheets();
	var all_sheets_ids	= all_sheets.map(function(sheet){return sheet.getSheetId();});
	var all_input_sheets	= {};
	var sheet_pairs_props	= {};
	var sheet_out_suffix	= '-out';
	var property_name	= 'sheets_pairs';
	
	
	/*======================================================================================*/
	/*  PUBLIC METHODS                                                                      */
	/*======================================================================================*/

	/** getOutputForAllSheets
	 *
	 * @return[{input_sheet:Sheet, output_sheet:Sheet}] array of objects with input and output pairs
	 */
	this.getOutputForAllSheets = function(){
		var all_sheets_pairs	= [];

		for(var _sheet_id in all_input_sheets){if (all_input_sheets.hasOwnProperty(_sheet_id)){
			var input_sheet = all_input_sheets[_sheet_id];
			//all_sheets_pairs.push(input_sheet.getSheetName());
			all_sheets_pairs.push({
				'input_sheet':	input_sheet,
				'output_sheet':	this.getOutputForSheet(input_sheet)				
			});
		}}
		return all_sheets_pairs;
		
	};	

	/** find or create output sheet for given input_sheet
	 * @param object Sheet input_sheet 
	 * 
	 * return Sheet output pair sheet object
	 */
	this.getOutputForSheet = function(input_sheet){
		sheet	= input_sheet;
		sheet_id	= sheet.getSheetId();		

		if (typeof all_input_sheets[sheet_id]!=='undefined'){
			var sheet_output	= getPropsSheetOutput(sheet_id);
			if(!sheet_output)
				sheet_output = createSheetOutput();
				
			Logger.log('name of sheet_output='+sheet_output.getSheetName());
			setSheetName(sheet_output);
			return sheet_output;
		} else
			Browser.msgBox('SheetOutputFinder.getOutputForSheet() ERROR: Name of current sheet is not valid');
		
	};
	/*======================================================================================*/
	/*  PRIVATE METHODS                                                                     */
	/*======================================================================================*/
	
	/** get output sheet from saved properties
	 *
	 * @return object Sheet if exists
	 */
	var getPropsSheetOutput = function() {
		
		var output_sheet_id = sheet_pairs_props[sheet_id];
		if (typeof output_sheet_id !=='undefined' )
			return getSheetById(output_sheet_id);
		
	};
	
	/** createSheetOutput
	 */
	var createSheetOutput = function() {
		var sheet_output_new	= spread.insertSheet();
		//sheet_pairs_props[sheet_id]	= sheet_output_new.getSheetId();
		sheetPairsPropsSave(sheet_output_new.getSheetId());
		//setSheetName(sheet_output_new);
		(new SheetConfigurator()).configureSheet(sheet_output_new, 'output');
		return sheet_output_new;
	};
	
	/** set name to new output sheet
	 */
	var setSheetName = function(output_sheet) {
		var output_sheet_name	= sheet.getSheetName()+sheet_out_suffix;
		/* Rename outputsheet if not already exists */
		if(!spread.getSheetByName(output_sheet_name))
			output_sheet.setName(output_sheet_name);
			//output_sheet_name = output_sheet_name +'-'+ output_sheet.getSheetId();
	};
	
	/** save {input_id:output_id} pairs to properties
	 */	
	var sheetPairsPropsSave = function(sheet_output_new_id) {
		sheet_pairs_props[sheet_id]	= sheet_output_new_id;
		PropertiesService.getDocumentProperties().setProperty(property_name, JSON.stringify(sheet_pairs_props));
	};
	
    /** find sheet in sheets by id
	 * @return Sheet
	 */
	var getSheetById = function(_sheet_id) {
		if(typeof _sheet_id !== 'undefined'){
			Logger.log('all_sheets_ids='+all_sheets_ids);
			return all_sheets[all_sheets_ids.indexOf(_sheet_id)];
		}
	};
	/*======================================================================================*/
	/*  INIT METHODS                                                                     */
	/*======================================================================================*/
	/** setAllInputSheets
		all_input_sheets:{
		   579835278: test.ahk	// name of input sheet matching 'className.{lang}'	   
		}
	*/
	var setAllInputSheets = function(){
		
		for(var s=0; s<all_sheets.length;s++) {
			var _sheet = all_sheets[s];
			//var sheet_name = _sheet.getSheetName();
			if ( _SheetName.setSheet(_sheet).validateSheetName() )
				all_input_sheets[_sheet.getSheetId()] = _sheet;
			
		}
		Logger.log('all_input_sheets='+JSON.stringify(all_input_sheets));
	
	};
	/** setSheetPairsProps
	 */	
	var setSheetPairsProps = function() {
		var sheet_data_props_tmp	= PropertiesService.getDocumentProperties().getProperty(property_name);
		sheet_pairs_props	= sheet_data_props_tmp ? JSON.parse(sheet_data_props_tmp) : {};
		Logger.log('sheet_pairs_props='+JSON.stringify(sheet_pairs_props));
	};
	
	
	setAllInputSheets();
	setSheetPairsProps();

	return this;
};



/*======================================================================================*/
/* TEST                                                                  */
/*======================================================================================*/

function SheetOutputFinder_getOutputForSheetTest(){
	var sheet_output = (new SheetOutputFinder()).getOutputForSheet( SpreadsheetApp.getActiveSpreadsheet().getActiveSheet() );
	sheet_output.activate();
}
function SheetOutputFinder_getOutputForAllSheetsTest(){
	var all_sheets_pairs = (new SheetOutputFinder()).getOutputForAllSheets();
	Logger.log('all_sheets_pairs='+JSON.stringify(all_sheets_pairs));
}




