/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  Sheeter - MENU FUNCTIONS                                                                                                         */
/*  Contetn of this file has to be in scope of MAIN SCRIPT                                                                             */
/*                                                                                                                                     */
/*=====================================================================================================================================*/
/* ================================================================= */
/*	HELP DIALOG                                                      */
/* ================================================================= */
/**
 */
function NewScriptDialogHelp() {
	getNewScript().showDialog('Sheeter-DialogHelp.html', project_name + ' Help');
}




/* ================================================================= */
/*	MENU FUNCTIONS                                                   */
/* ================================================================= */
/*
====== DELETE SHEETS ======
*/
/**
 */
function deleteAllSheets() {
	var new_sheet_name =  showPrompt('Delete all sheets ?','You can set new sheet name');
	if(new_sheet_name!==false && new_sheet_name!==null)
		Sheeter().deleteSheets(true, new_sheet_name!=='' ? new_sheet_name : 'New Sheet');
}
/*
/**
 */
function deleteOtherSheetsCall() {
	Sheeter().deleteOtherSheets();
}
/**
 */
function deleteOtherSheetsLeft() {
	Sheeter().deleteOtherSheets('left');
}
/**
 */
function deleteOtherSheetsRight() {
	Sheeter().deleteOtherSheets('right');
}
/** Refresh Sheet
 * Dirty refresh of formulas by adding and removing if row
 */
function refreshSheet() {
	SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().insertRows(1);
	SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().deleteRow(1);
}
/*
====== SET SHEET ======
*/
/**
 */
function setRowsCount() {
	var row_count =  parseInt(showPrompt('Set Count Of Rows ?','Set number of rows'));
	if(!isNaN(row_count) && row_count > 0 )
		Sheeter().setRows(row_count);
}
/**
 */
function setColumnsCount() {
	var columns_count = parseInt(showPrompt('Set Count Of Columns ?','Set number of columns'));
	if(!isNaN(columns_count) && columns_count > 0 )
		Sheeter().setColumns(columns_count);
}




/* ================================================================= */
/*	TEST FUNCTIONS                                                   */
/* ================================================================= */
/*
====== Sheeter-Test ======
*/
/**
 */
function createSheet() {
	Sheeter().createSheet('newSheet', 20, 5);
}
/**
 */
function deleteSheets( ) {
	Sheeter().deleteSheets( true );
}
/**
 */
function setHeaders() {
	/* header_data object */
	var header_data	= {'Black & White':{color:'black',background:'white'}, 'Auto width column':{width:'auto'},'Third Column':{}};
	/* header_data array */
	//var header_data	= ['First column', 'Second column','Third Column'];

	var row_options	= {row:1, freeze:true, width:128 , color:'white', background:'RoyalBlue', weight:'bold', align:'center'};
	Sheeter().setHeaders(header_data, row_options);
	//Sheeter().setHeaders(header_data);	
}
/**
 */
function deleteRows() {
	Sheeter().deleteRows(20,15);
}
/**
 */
function deleteColumns() {
	Sheeter().deleteColumns(3,5);
}
/*
====== setRangeOptions ======
*/

/** setRangeOptions_colors
*/
function setRangeOptions_colors(){
	var range = 	SpreadsheetApp.getActiveSpreadsheet().getActiveRange();
	Sheeter().setRangeOptions(range, 'color', 'red');
}

/** setRangeOptions_width
*/
function setRangeOptions_width(){
	var range = 	SpreadsheetApp.getActiveSpreadsheet().getActiveRange();
	Sheeter().setRangeOptions(range, 'width', 128);
}








































