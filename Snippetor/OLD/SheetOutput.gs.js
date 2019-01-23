/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  SheetOutput                                                                                                                          */
/*                                                                                                                                     */
/*=====================================================================================================================================*/

/**
 */
var SheetOutput = function(  ){
	//Browser.msgBox('SheetOutput()');
	/*====== PRIVATE PROPERTIES ======*/
	var self	= this;
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var sheet	= spread.getActiveSheet();
	var all_sheets 	= spread.getSheets();
	var sheet_name	= sheet.getSheetName();	
	var sheet_id	= sheet.getSheetId();
	var sheet_out;
	var sheet_id_out;	
	var _Sheeter	= getSheeter();
	//var cells	= sheet.getDataRange();
	var notation_letters	= ("*ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
	var header_columns;
	var header_columns_output;
	var range	= sheet.getDataRange();		
	var sheet_formulas	= { property:[], method:[] };
	/*====== PUBLIC PROPERTIES ======*/
  
  
	/*======================================================================================*/
	/*  PUBLIC METHODS                                                                      */
	/*======================================================================================*/

     /**
	 */
	this.moveToOutput = function() {
		var formulas	= range.getFormulas();
		var property_name	= 'sheets_pairs';
		//PropertiesService.getDocumentProperties().deleteProperty(property_name);
		var sheets_pairs;
		var sheet_name_out	= sheet_name+'-'+sheet_output_name;
		
		/** sheetsPairsSet
		 */
		var sheetsPairsSet = function() {
			Logger.log('sheet_id = '+sheet_id);
			Logger.log('sheetsPairsSet() '+sheet_out.getSheetId());			
			//sheets_pairs = {};

			sheets_pairs[sheet_id] = sheet_out.getSheetId();
			Logger.log('sheets_pairs '+ JSON.stringify(sheets_pairs));

			PropertiesService.getDocumentProperties().setProperty(property_name, JSON.stringify(sheets_pairs));

		};
		/** sheetsPairsGet
		 */
		var sheetsPairsGet = function() {
			
			var sheets_pairs_prop = PropertiesService.getDocumentProperties().getProperty(property_name);
			Logger.log('sheets_pairs_prop = '+ sheets_pairs_prop);
			Logger.log('sheets_pairs_prop = '+typeof sheets_pairs_prop);
			
			sheets_pairs	= sheets_pairs_prop ?  JSON.parse(sheets_pairs_prop) : {};
			//if(typeof sheet_out_id === 'undefined' )
				//sheets_pairs = {};
			
			Logger.log('sheets_pairs '+ JSON.stringify(sheets_pairs));
			Logger.log(sheet_name_out);

			
			var sheet_out_id = sheets_pairs[sheet_id];
			Logger.log('sheet_out_id='+sheet_out_id);
			/* Find sheet if saved, or create new */
			sheet_out = getSheetById(sheet_out_id);			
			/* if saved sheet does not exist, then create new */			
			if(!sheet_out)
				sheet_out = spread.insertSheet(sheet_name_out);
			
			sheetsPairsSet();
			//sheet_out.activate()

		};		
		
		
		/** setSheetFormulas
		 */
		var setSheetFormulas = function() {
			for(var r=0; r<formulas.length;r++) {
				//var formulas = formulas[r];
				for(var c=0; c<formulas[r].length;c++) {
					//var formulas[r] = formulas[r][c];
					var match_formula = /=get(property|method)/gi.exec(formulas[r][c]);
					if (match_formula) {
						sheet_formulas[match_formula.pop().toLowerCase()].push(['INDEX('+sheet_name+'!'+notation_letters[c+1]+(r+1)+':'+notation_letters[c+2]+(r+1)+')']);
					}
					//=INDEX(Test.js!E2:F2)
				}
			}
		};
		/** setToOutputSheet
		 * 
		 */
		var setToOutputSheet = function() {
				
			_Sheeter.setSheet(sheet_out).setRows(2);
			
			if(sheet_formulas.property.length>0)
				sheet_out.getRange(2,1,sheet_formulas.property.length, 1 ).setFormulas( sheet_formulas.property );
			
			if(sheet_formulas.method.length>0)
				sheet_out.getRange(2,3,sheet_formulas.method.length, 1 ).setFormulas( sheet_formulas.method );
		};
		
		
		sheetsPairsGet();				
		setHeaderColumns();
		setSheetFormulas();
		setToOutputSheet();
	};
  
	/*======================================================================================*/
	/*  PRIVATE METHODS                                                                     */
	/*======================================================================================*/
	/** arrayFlattern
	 */
	var arrayFlattern = function(arr) {
		return [].concat.apply([], arr);
	};
  
	/*======================================================================================*/
	/*  INIT METHODS                                                                        */
	/*======================================================================================*/	
	/** setHeaderColumns
	 */
	var setHeaderColumns = function() {
		header_columns	= arrayFlattern(sheet.getRange(1,1,1,sheet.getMaxColumns()).getValues()).map(function(label){return label.toLowerCase();});
		header_columns_output	= arrayFlattern(sheet_out.getRange(1,1,1,sheet.getMaxColumns()).getValues()).map(function(label){return label.toLowerCase();});		
		//header_columns = header_columns.map(function(label){return label.toLowerCase();});
	};
    /** getSheetById
	 */
	var getSheetById = function(_sheet_id) {
		
		if(typeof _sheet_id !== 'undefined'){
			all_sheets_ids = all_sheets.map(function(sheet){
				return sheet.getSheetId();
			});
			Logger.log(all_sheets_ids);
			return all_sheets[all_sheets_ids.indexOf(_sheet_id)];
		}
	};
	
	//if(!sheet_out)
	//	sheet_out = (new SnippetorSheetCreator()).createOutputSheet();
    
	
    return this;
};




