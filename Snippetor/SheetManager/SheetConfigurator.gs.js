/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  SheetConfigurator                                                                                                              */
/*                                                                                                                                     */
/*=====================================================================================================================================*/
/* Create new _Sheeter fitting to purposes of this script
 * Set formula columns auto widths
 * Set formula columns colors
 *
 */

var SheetConfigurator = function() {
	/*====== PRIVATE PROPERTIES ======*/
	var self	= this;
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var sheet;
	//var sheet_type; // input|output
	//var sheet	= spread.getActiveSheet();
	var _Sheeter	= getSheeter();

	/* Definition of columns in sheets COLOR NAMES: http://www.htmlcsscolor.com/#cntMain_pnlList1 */
	var sheets_columns = {
		input:	{ 'Name':{color:'blue',weight:'bold',width:256}, 'Access':{color:'IndianRed',width:128}, 'Datatype':{color:'IndianRed',width:128}, 'Value':{color:'blue',weight:'bold',width:96}, 'UML':{color:'green'}, 'Definition':{color:'RoyalBlue'}, 'Snippet':{color:'DarkCyan'} },
		output:	{'Property':{color:'IndianRed'},'PropertyDefinition':{}, 'Method':{color:'green'}, 'MethodDefinition':{} }
	};
	var sheet_columns;
	var sheet_columns_names;
	/* Options for header row */
	var header_row_options	= {color:'white', background:'#4A86E8', weight:'bold', align:'center'};
	
	/** configureSheetOutput
	*/
	this.configureSheet = function(_sheet, sheet_type) {
		sheet	= _sheet;
		sheet_columns	= sheets_columns[sheet_type];
		sheet_columns_names	= Object.keys(sheet_columns);
		
		_Sheeter.setSheet(sheet)
			.setRows(2)
			.setColumns(sheet_columns_names.length)
			.setHeaders(sheet_columns_names, header_row_options );
		
		columnsOptionsSetup();
	};

	/*======================================================================================*/
	/*  PRIVATE METHODS                                                                     */
	/*======================================================================================*/
	
	/** columnsOptionsSetup
	 */
	var columnsOptionsSetup = function() {
		
		//Logger.log('sheet_columns '+ JSON.stringify(sheet_columns));
		//Logger.log('sheet_columns_names '+ JSON.stringify(sheet_columns_names));		

			for(var c=0; c<sheet_columns_names.length;c++) {
				//var column	= sheet_columns_names[c];
				var options	= sheet_columns[sheet_columns_names[c]];
				var range	= sheet.getRange(2, c+1, sheet.getMaxRows()-1);
				var options_keys	= Object.keys(options);

				/* SET options */
				for(var o=0; o<options_keys.length;o++) {
					var option	= options_keys[o];
					var value	= options[option];
					Logger.log('columnsOptionsSetup() range='+range +',option='+option +', value='+value );
					_Sheeter.setRangeOptions(range, option, value);
					//switch (option) {
					//	case 'color':	range.setFontColor(value);break;
					//	case 'weight':	range.setFontWeight(value);break;
					//}
					//SpreadsheetApp.flush();					
				}
			}
	};

	return this;
};


/* ================================================================= */
/*	TEST FUNCTIONS                                                   */
/* ================================================================= */

function SheetConfigurator_createInputSheet(){
	var sheet_active = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
	(new SheetName()).setSheet(sheet_active).validateOrRename();
	(new SheetConfigurator()).configureSheet( sheet_active, 'input');

}




