/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  SnippetorSheetCreator                                                                                                              */
/*                                                                                                                                     */
/*=====================================================================================================================================*/
/* Create new _Sheeter fitting to purposes of this script
 * Seed sample data
 * Set formula columns auto widths
 * Set formula columns colors
 *
 * @method createNew()	create new sheet
 * @method seedSampleData()	seed Sample Data and set formula columns widths and colors
 * return void
 */

var SnippetorSheetCreator = function() {
	/*====== PRIVATE PROPERTIES ======*/
	var self	= this;
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var sheet;	// actie sheat where is script working - input|output sheet
	var sheet_output_name	= 'Diagram';
	//var sheet	= spread.getActiveSheet();
	var sheets	= {input:spread.getActiveSheet(), output:null};
	var _Sheeter	= getSheeter();
	//var notation_letters	= ("*ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
	var langs_all	= ['ahk','js','php','css'];	// all avaiable languages
	var seed_data	= {};

	/* Columns passed as parameters to formulas */
	//var formula_parameters	= ['Name', 'Access', 'Value', 'Datatype']; // values are keys of header_labels, they will be used as indexes
	/* Definition of columns in sheets COLOR NAMES: http://www.htmlcsscolor.com/#cntMain_pnlList1 */
	var sheets_columns = {
		input:	{ 'Name':{color:'blue',weight:'bold',width:256}, 'Access':{color:'IndianRed',width:128}, 'Datatype':{color:'IndianRed',width:128}, 'Value':{color:'blue',weight:'bold',width:96}, 'UML':{color:'green'}, 'Definition':{color:'RoyalBlue'}, 'Snippet':{color:'DarkCyan'} },
		output:	{'UML-Property':{color:'IndianRed'},'Definition-Property':{}, 'UML-Method':{color:'green'}, 'Definition-Method':{} }
	};
	/* Options for header row */
	var header_options	= {color:'white', background:'#4A86E8', weight:'bold', align:'center'};
	//var header_options_output	= header_options;
	//header_options_output.width	= 256;
	/*======================================================================================*/
	/*  PUBLIC METHODS                                                                      */
	/*======================================================================================*/
	/** createNew
	*/
	this.createNew = function() {
		this.createInputSheet();
		this.createOutputSheet();
		sheets.input.activate();
		SpreadsheetApp.flush();
		if(showConfirm('Seed Sample Data','Do you want seed sample data into current sheet ?'))
			(new SnippetorSheetSeed()).seedSampleData( );
		////this.seedSampleData();
	};

	/** createInputSheet
	 */
	this.createInputSheet = function() {
		var sheet_name = sheets.input.getName().match(new RegExp('('+langs_all.join('|')+')', 'gi')) ? sheets.input.getName() : (new SnippetorSetSheetName()).getNewSheetName();
		if(sheet_name){
			//sheets.input	= sheet.setName(sheet_name);
			sheets.input.setName(sheet_name);			
			_Sheeter.setSheet(sheets.input).setRows(20).setColumns(Object.keys(sheets_columns.input).length);
			self.setHeaders(Object.keys(sheets_columns.input), header_options);
			columnsOptionsSetup(sheets.input, sheets_columns.input);			
		}
	};
	/** createOutputSheet
	 *
	 *  @return object Sheet
	 */
	this.createOutputSheet = function() {
		if(sheets.input){
			var header_options_output	= header_options;
			sheets.output	= spread.getSheetByName(sheet_output_name) ? spread.getSheetByName(sheet_output_name) : spread.insertSheet(sheet_output_name);
			sheet	= sheets.output;	
			_Sheeter.setSheet(sheets.output).setRows(20).setColumns(Object.keys(sheets_columns.output).length);
			
			self.setHeaders(Object.keys(sheets_columns.output), header_options );
			columnsOptionsSetup(sheets.output, sheets_columns.output);
            return sheets.output;
		}
	};
	
	/** setHeaders
	 */
	this.setHeaders = function(header_labels, _header_options) {
		if( typeof header_labels === 'undefined' )header_labels = Object.keys(sheets_columns.input);
		_Sheeter.setHeaders(header_labels, _header_options);		
	};

	/*======================================================================================*/
	/*  PRIVATE METHODS                                                                     */
	/*======================================================================================*/
	/** columnsOptionsSetup
	 */
	var columnsOptionsSetup = function(_sheet, _header_columns) {
		//if(confirmDialog('Set Colors','Set colors to "Snippet" and "UML" columns ?')){

		var columns_keys	= Object.keys(_header_columns);
		_Sheeter.setSheet(_sheet);

		if(_sheet)
			for(var c=0; c<columns_keys.length;c++) {
				//var column	= columns_keys[c];
				var options	= _header_columns[columns_keys[c]];
				var range	= _sheet.getRange(2, c+1, _sheet.getMaxRows()-1);
				var options_keys	= Object.keys(options);
				///* RESET options */
				//range.setFontColor('black');
				//SpreadsheetApp.flush();					
				//range.setFontWeight('normal');
				//SpreadsheetApp.flush();
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


