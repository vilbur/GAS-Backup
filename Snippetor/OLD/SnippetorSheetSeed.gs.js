/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  SnippetorSheetSeed                                                                                                                          */
/*                                                                                                                                     */
/*=====================================================================================================================================*/
/* Create new Sheeter fitting to purposes of this script
 * Seed sample data
 * Set formula columns auto widths
 * Set formula columns colors
 *
 * @method createNew()	create new sheet
 * @method seedSampleData()	seed Sample Data and set formula columns widths and colors
 * return void
 */

var SnippetorSheetSeed = function(_snippet_type, range) {

	var self	= this;
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var sheet	= spread.getActiveSheet();
	var sheet_output_name = 'Snippetor';
	var max_columns	= sheet.getMaxColumns();	
	//var Sheeter	= (new Vilbrary.Sheeter());
	var notation_letters	= ("*ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
	var langs_all	= ['ahk','js','php','css'];	// all avaiable languages
	//var seed_data	= {Property:{},Method:{}};
	var seed_data	= [];	
	var header_columns;
	
	if( typeof range	=== 'undefined' )	range	= sheet.getRange(2,1,2 ,max_columns);
	var snippet_type = typeof _snippet_type	=== 'undefined' ? ['Property', 'Method'] : _snippet_type;
	
	var row_start = range.getRowIndex();
	
	/** seeData
	 */
	this.seedSampleData = function() {
		setSeedData();
		//Browser.msgBox(JSON.stringify(seed_data));
		range.setValues(seed_data);
		SpreadsheetApp.flush();
		autoresizeColumns();
	};
	/** arrayFlattern
	 */
	var arrayFlattern = function(arr) {
		return [].concat.apply([], arr);
	};	
	
	/** setSeedData
	 */
	var setSeedData = function() {
		//Browser.msgBox( 'setSeedData() '+range.getNumRows() );

		if( typeof snippet_type !== 'object' ) snippet_type = [snippet_type];
		/** getRowData
		 */
		var getRowData = function(_snippet_type, row_i) {
			//Browser.msgBox( _snippet_type );
			var row_data	= header_columns.slice(0);
			var snippet_column	= notation_letters[header_columns.indexOf('name')+1]+row_i;
			/** getDataParameters
			 */
			var getDataParameters = function() {
				return notation_letters[header_columns.indexOf('name')+1]+row_i + ':' + notation_letters[header_columns.indexOf('datatype')+1]+row_i;
			};
			
			row_data[header_columns.indexOf('name')]	= 'foo'+_snippet_type+row_i;
			row_data[header_columns.indexOf('uml')]	= '=get'+_snippet_type+'({'+getDataParameters()+','+snippet_column+'})';			
			row_data[header_columns.indexOf('access')]	= 'access-'+_snippet_type.toLowerCase();
			
			row_data[header_columns.indexOf('definition')]	= '';
			row_data[header_columns.indexOf('snippet')]	= '';
			
			return row_data;
		};
		
		for(var r=0; r<range.getNumRows();r++) {
			//Browser.msgBox( r );
			var snippet_type_i = typeof _snippet_type !== 'undefined' ? 0 : r;
			seed_data.push( getRowData(snippet_type[snippet_type_i], row_start+r) );	
		}
		
		
	};
	/** autoresizeColumns
	 */
	var autoresizeColumns = function() {
		for(var c=0; c<header_columns.length;c++) {
			sheet.autoResizeColumn(c + 1);
		}
	};	
	/** autoresizeColumns
	 */
	var autoresizeFormulaColumns = function() {
		var formulas = sheet.getRange(2,1,1,max_columns).getFormulas();
		//Logger.log('formulas =' + JSON.stringify(formulas));		
		for(var r=0; r<formulas.length;r++) {
			for(var c=0; c<formulas[r].length;c++) {
				var formula = formulas[r][c];
				if(formula)
					sheet.autoResizeColumn(c + 1);
			}
		}
	};
	
	/** setHeaderColumns
	 */
	var setHeaderColumns = function() {
		header_columns = arrayFlattern(sheet.getRange(1,1,1,max_columns).getValues()).map(function(label){return label.toLowerCase();});
		//header_columns = header_columns.map(function(label){return label.toLowerCase();});
	};
	setHeaderColumns();
	return this;
};

/* ================================================================= */
/*	MENU FUNCTIONS                                                   */
/* ================================================================= */

/** createNewSheet
*/
function SnippetorSheetSeedSampleData(){
	(new SnippetorSheetSeed()).seedSampleData( );
}
/** createNewSheet
*/
function SnippetorSheetSeedSampleDataProperty(){
	(new SnippetorSheetSeed('Property', SpreadsheetApp.getActiveSpreadsheet().getActiveRange() )).seedSampleData( );
}

/** createNewSheet
*/
function SnippetorSheetSeedSampleDataMethod(){
	(new SnippetorSheetSeed('Method', SpreadsheetApp.getActiveSpreadsheet().getActiveRange() )).seedSampleData( );
}