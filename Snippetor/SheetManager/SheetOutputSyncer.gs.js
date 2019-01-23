/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  SheetOutputSyncer                                                                                                              */
/*                                                                                                                                     */
/*=====================================================================================================================================*/
/* 
 */

var SheetOutputSyncer = function() {
	/*====== PRIVATE PROPERTIES ======*/
	var self	= this;
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	//var sheet;	// actie sheat where is script working - input|output sheet
	var sheet	= spread.getActiveSheet();
	var sheet_name;
	var notation_letters	= ("*ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
	var _SheetOutputFinder	= new SheetOutputFinder();
	var _Sheeter	= getSheeter();

	/*======================================================================================*/
	/*  PUBLIC METHODS                                                                      */
	/*======================================================================================*/

	/** syncAllSheets
	 */
	this.syncAllSheets = function() {
		var all_sheets_pairs = _SheetOutputFinder.getOutputForAllSheets();
		for(var s=0; s<all_sheets_pairs.length;s++) {
			var sheets_pair = all_sheets_pairs[s];
			syncSheet(sheets_pair.input_sheet, sheets_pair.output_sheet);

		}
	};
	
	/** syncActiveSheet
	 */
	this.syncActiveSheet = function() {
		var sheet_output = _SheetOutputFinder.getOutputForSheet( sheet );
		syncSheet(sheet, sheet_output);
		
	};
	/*======================================================================================*/
	/*  PRIVATE METHODS                                                                     */
	/*======================================================================================*/
	/** set output sheet after input sheet
	 */
	var sortSheets = function(input_sheet, output_sheet){
		var sheet_active	= spread.getActiveSheet();
		var input_index	= input_sheet.getIndex();
		var output_index 	= output_sheet.getIndex();				
		
		Logger.log('\ninput_sheet='+input_sheet.getSheetName());

		Logger.log('input_index='+input_index);
		Logger.log('output_index='+output_index);		
		
		if(input_index !== (output_index-1)){
			
			var index_new = input_index < output_index ? input_index+1 : input_index;
			output_sheet.activate();
			//SpreadsheetApp.flush();								
			spread.moveActiveSheet(index_new);
			//SpreadsheetApp.flush();
			sheet_active.activate();
		}
	};
	/** syncSheet
	 */
	var syncSheet = function(input_sheet, output_sheet) {
		sortSheets(input_sheet, output_sheet);
		
		sheet_name	= input_sheet.getSheetName();
		var range	= input_sheet.getDataRange();		
		var formulas	= range.getFormulas();
		var formulas_output	= { property:[], method:[] };
		
		/** setFormulasOutput
		 */
		var setFormulasOutput = function() {
			
			/** getFormulOutput
			 */
			var getFormulaOutput = function(formula) {
				var match_formula	= (new RegExp(/=get(Property|Method)\(.*/gi)).exec( formula );																		
				if (match_formula){
					var formula_type	= match_formula[1].toLowerCase(); // PropertyUML|PropertyDefinition|MethodUML|MethodDefinition
					/** index_formula
					 */
					var index_formula = (function() {
						var formula_index	= sheet_name+'!'+notation_letters[c+1]+(r+1);
						var range_length	= ':'+notation_letters[c+2]+(r+1);
						
						return ['INDEX('+formula_index+range_length+')'];
					})();
					
					formulas_output[formula_type].push( index_formula );
				}
			};
			
			/** iterateFormulasInRow
			 */
			var iterateFormulasInRow = function(formulas_in_row) {
				for( c=0; c<formulas_in_row.length;c++) {
					var formula = formulas_in_row[c];
					if(formula)
						getFormulaOutput(formula);
				}
			};
			
			/* ITERATE ROWS */
			for( r=0; r<formulas.length;r++) {
				iterateFormulasInRow( formulas[r] );
			}
			
			
		};
		/** setToOutputSheet
		 * 
		 */
		var setToOutputSheet = function() {
				
			var range_output = output_sheet.getRange(2, 1, 1, output_sheet.getMaxColumns() );		
			/* reset rows */
			_Sheeter.setSheet(output_sheet).setRows(2);
			/* clear rows content */			
			range_output.clearContent();	
			
			/* SET PROPERTY FORMULAS */
			if(formulas_output.property.length>0)
				output_sheet.getRange(2,1,formulas_output.property.length, 1 ).setFormulas( formulas_output.property );
			
			/* SET METHODS FORMULAS */			
			if(formulas_output.method.length>0)
				output_sheet.getRange(2,3,formulas_output.method.length, 1 ).setFormulas( formulas_output.method );
			
			SpreadsheetApp.flush();
			
			/* Set columns widths 'auto' */
			_Sheeter.setRangeOptions(range_output, 'width', 'auto');
			
			
		};
		setFormulasOutput();
		setToOutputSheet();
		
	};
	
	return this;
};



/*======================================================================================*/
/* TEST                                                                  */
/*======================================================================================*/
