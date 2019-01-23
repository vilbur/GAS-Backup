/*=====================================================================================================================================
   Sheeter
/*=====================================================================================================================================*/

/** Project name - name of main class
 *  COMMENT project_name for merging
 */
var project_name	= 'Sheeter';
/** Main class of project
 *  Merge all scripts of project into this class for merge to MAIN script
 *  Menu functions MUST be placed in scope of MAIN script
 */
var Sheeter = function(){ 

	var self	= this;
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	//var sheet	= spread.getActiveSheet();
	this.sheet	= spread.getActiveSheet();
	//var cells	= sheet.getDataRange();
	var max_rows	= this.sheet.getMaxRows();
	var max_columns	= this.sheet.getMaxColumns();

	/** createSheet
	 */
	this.createOrGetSheet = function(sheet_name, rows_count, columns_count) {
		var sheet = spread.getSheetByName(sheet_name);
		if(!sheet){
			this.createSheet(sheet_name, rows_count, columns_count);
		} else
			this.sheet = sheet;
		flushAndUpdateThis();
		return this;
	};
	/** createSheet
	 */
	this.createSheet = function(sheet_name, rows_count, columns_count) {
		//var sheet = spread.getSheetByName(sheet_name);
		//if(!sheet){
		this.sheet = spread.insertSheet(sheet_name);
		flushAndUpdateThis();
		if( typeof rows_count !== 'undefined' )
			this.setRows(rows_count);
		if( typeof columns_count !== 'undefined' )
			this.setColumns(columns_count);
		//} else
		//	this.sheet = sheet;
		flushAndUpdateThis();
		return this;
	};
	/** openSheetFolder
	 */
	this.openSheetFolder = function() {
		var folder_id = getFolderIdOfSheet();
		var htmlString = '<script>window.open("https://drive.google.com/drive/u/0/folders/'+folder_id+'");google.script.host.close();</script>';
		var htmlOutput = HtmlService.createHtmlOutput(htmlString).setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(96);
		SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Opening of current sheet folder');  
	};
	/** getFolderOfSheet
	 */
	var getFolderIdOfSheet = function() {
		var sheet_id	= SpreadsheetApp.getActiveSpreadsheet().getId();
		var file_in_docs	= DriveApp.getFileById(sheet_id);
		var folder_id	= file_in_docs.getParents().next().getId();
		return folder_id;
	};
	/** getObjectValues
	 */
	var getObjectValues = function(obj) {
		var values = [];
		for(var key in obj){if (obj.hasOwnProperty(key)){
			values.push(obj[key]);
		}}
		return values;
	};
	/** setSheeet by names or ids
	 */
	this.setSheet = function(_sheet) {
		_sheet	= this.getSheeetObjects(_sheet);
		var sheet	= _sheet[Object.keys(_sheet)[0]];
		if(_sheet){
			this.sheet = sheet;		
			flushAndUpdateThis();
			return this;	
		} else{
			Logger.log('ERROR - Vilbrary.Sheeter.setSheet(_sheet) - _sheet has not been found');
            return null;
        }
	};
    
	/** get Sheeets by names or ids
	 * @return [Sheet] array of Sheet objets https://developers.google.com/apps-script/reference/spreadsheet/sheet
	 */
	this.getSheeetObjects = function(_sheets) {
		var sheets = [];
		if( !Array.isArray(_sheets))	_sheets = [_sheets];
		for(var s=0; s<_sheets.length;s++) {
			var _sheet	= _sheets[s];
			switch (typeof _sheet) {
				case 'string':	sheetObject = spread.getSheetByName(_sheet);break;
				case 'integer':	sheetObject = spread.getSheetById(_sheet);break;
				case 'object':	sheetObject = _sheet;break;
				default:	sheetObject =  null;
			}
			if(sheetObject)
				sheets.push(sheetObject);
				//sheets[(typeof_sheet === 'string' ? _sheet : sheet.getSheetId())] = sheet;
		}
		return sheets;
	};
	/** getSheeetsNames
	 */
	this.getSheeetsNames = function(_sheets) {
		return _sheets.map(function(sheet){
			return sheet.getSheetName();
		});
	};
	
	/** deleteSheets
	 * @param boolean|[Sheet]|[SheetName]	_delete_sheets Sheet objects or sheet names to delete, Delete all sheets if true
	 * @param string	new_sheet_name name of new sheet if all sheets will be deleted
	 */
	this.deleteSheets = function(_delete_sheets, new_sheet_name) {
		var sheet_new;
		var sheets_all	= spread.getSheets();
		//var sheet_name_random	= Math.floor((Math.random() * 1000) + 1); 
		if( _delete_sheets === true )	_delete_sheets	= sheets_all;
		else if( !Array.isArray(_delete_sheets))	_delete_sheets = [_delete_sheets];

		delete_sheets	= this.getSheeetObjects(_delete_sheets);
		
		/* IF DELETE ALL */
		if(sheets_all.length === delete_sheets.length)
			sheet_new = spread.insertSheet();

		/** get Sheets objects by name */
		for(var s=0; s<delete_sheets.length;s++) {
			spread.deleteSheet(delete_sheets[s]);
		}
	
		if(typeof new_sheet_name === 'undefined')
			new_sheet_name = 'newSheet';

		if(sheet_new){
			if(spread.getSheetByName(new_sheet_name))
				new_sheet_name	= new_sheet_name+'-'+Math.floor((Math.random() * 1000) + 1);
			this.sheet = sheet_new.setName(new_sheet_name);
		}
		
		return this;
	};
	/** setRows
	 * @param integer rows_count required count of rows
	 */
	this.setRows = function(rows_count) {
		if(rows_count!=max_rows)
			if(rows_count<max_rows)
				this.deleteRows(rows_count, max_rows);
			else 
				this.sheet.insertRows(max_rows, rows_count-max_rows);
		flushAndUpdateThis();
		return this;
	};
	/** setColumns
	 * @param integer columns_count required count of columns
	 */
	this.setColumns = function(columns_count) {
		if(columns_count!=max_columns)
			if(columns_count<max_columns)
				this.deleteColumns(columns_count, max_columns);
			else 
				this.sheet.insertColumns(max_columns, columns_count-max_columns);
		flushAndUpdateThis();
		return this;
	};	
	/** set Property to range // row or column
	 * @param Range	range
	 * @param string	property	// color|background|weight|align|width
	 * @param string|int	value	// datatypes according to	values of native functions of range set properties https://developers.google.com/apps-script/reference/spreadsheet/range
	 * 
	 */
	this.setRangeOptions = function(range, property, value) {
		Logger.log('this.setRangeOptions() property='+property +', value='+value );
		/** setProperty_ColumnWidth
		 */
		var setColumnWidth = function() {
			Logger.log('setColumnWidth()' );
			/* Width is set by column */
			var auto_width	= value === 'auto';
			var columns_indexes	= (function(){
			    return [range.getColumn(), range.getLastColumn()];
			})();
			Logger.log('columns_indexes='+columns_indexes );
			for(var c=columns_indexes[0]; c<=columns_indexes[1];c++) {
				if(auto_width)
					self.sheet.autoResizeColumn(c);
				else
					self.sheet.setColumnWidth(c, value);
			}
		};
		switch (property) {
			case 'color':	range.setFontColor(value);break;
			case 'background':	range.setBackground(value);break;
			case 'weight':	range.setFontWeight(value);break;
			case 'align':	range.setHorizontalAlignment(value);break;
			case 'width':	setColumnWidth();break;			
		}
			
		return this;
	};
	/** set Header Row values, color, background color, font weight
	 *  Row is freezed
	 * @param [label]|{label:options_object}	header_data for columns, array of labels OR object where key is column label and options in object value
	 * @param options_object	row_options DEFAULTS:row=1, freeze=true
	 *
	 *	options_object = {
	 *		row:int,	// row number
	 *		freeze:boolean,	// freeze row 
	 *		color:string,	// font color
	 *		background:string,	// background color
	 *		weight:string,	// font weight
	 *		align:string	// 'left|center|right'
	 *		width:int|'auto'	// columns width, in piexels or autoresize by content
	 *	}
	 * 
	 */
	this.setHeaders = function(header_data, row_options) {
		Logger.log('setHeaders() row_data='+ JSON.stringify(header_data));

		//sheet.getRange(1,1,1,columns_count_new).setValues([['test']]);
		if(typeof row_options === 'undefined') row_options = {};
		var header_labels	= Array.isArray(header_data) ? header_data : Object.keys(header_data);
		var row_num	= typeof row_options.row	=== 'undefined' ? 1	: row_options.row;
		var row_freeze	= typeof row_options.freeze	=== 'undefined' ? true	: row_options.freeze;		
		/* Clear row */
		this.sheet.getRange(row_num,1,1,max_columns ).clearContent().clearFormat();
		//SpreadsheetApp.flush();

		/* Set row values */				
		this.sheet.getRange(row_num,1,1,header_labels.length )
				.setValues([ header_labels.map(function(label){return label;})]); // get keys of header_data, set every key to array
		if(row_freeze)
			this.sheet.setFrozenRows(row_num);
			
		/** setHeaderRowOptions
		 */
		var setHeaderRowOptions = function() {
			var row = self.sheet.getRange(row_num,1,1,max_columns );
			for(var property in row_options){if (row_options.hasOwnProperty(property)){
				self.setRangeOptions(row, property, row_options[property]);
			}}
		};
		/** setHeaderColumns
		 */
		var setHeaderColumns = function() {
			for(var c=0; c<header_labels.length;c++) {
				var properties	= header_data[header_labels[c]];
				var column	= self.sheet.getRange(row_num,(c+1),1,1 );
				//Logger.log("column="+header_labels[c]);
				//Logger.log('properties=' + JSON.stringify( properties ));
				for(var property in properties){if (properties.hasOwnProperty(property)){
					self.setRangeOptions(column, property, properties[property]);
				}}
			}
		};
		setHeaderRowOptions();
		setHeaderColumns();
		flushAndUpdateThis();
		return this;
	}; 
	/* Delete rows - Handles with current rows count
	 * Wrapper of https://developers.google.com/apps-script/reference/spreadsheet/sheet#deletecolumnscolumnposition-howmany
	 *
	 * @param	integer	row_position	the position of the first row to delete
	 * @param	integer	how_many	the number of rows to delete
	*/
	this.deleteRows = function(row_position, how_many) {
		var row_end = row_position + how_many;
		if (row_position < max_rows)
			this.sheet.deleteRows(row_position,	row_end < max_rows? how_many : how_many - (row_end - max_rows));
		flushAndUpdateThis();
		return this;
	};
	/* Delete Columns - Handles with current columns count
	 * Wrapper of https://developers.google.com/apps-script/reference/spreadsheet/sheet#deleterowsrowposition-howmany
	 *
	 * @param	integer	columns_position	the position of the first columns to delete
	 * @param	integer	how_many	the number of columns to delete
	*/
	this.deleteColumns = function(column_position, how_many) {
		var columns_end = column_position + how_many;
		if (column_position < max_columns)
			this.sheet.deleteColumns(column_position,	columns_end < max_columns? how_many : how_many - (columns_end - max_columns));
		flushAndUpdateThis();
		return this;
	};
	/** deleteOtherSheets
	 * @param 
	 */
	this.deleteOtherSheets = function(delete_side){
		if( typeof delete_side === 'undefined' ) delete_side='others';
		var active_index	= spread.getActiveSheet().getIndex();
		var sheets	= spread.getSheets();

		/* If no sheetes on left|right side */
		if(sheets.length===1 || (delete_side==='left'&& active_index===0) || (delete_side==='right'&& active_index===sheets.length-1))
			return; 
		
		switch (delete_side) {
			case 'others':	sheets.splice(active_index-1,1);break;
			case 'left':	sheets.splice(active_index-1);break;
			case 'right':	sheets.splice(0, active_index);break;
		}
		/** get Sheets objects by name */
		for(var s=0; s<sheets.length;s++) {
			spread.deleteSheet(sheets[s]);
		}
		
		//Browser.msgBox('this.getSheeetsNames()=' + JSON.stringify(this.getSheeetsNames(sheets_all.map(function(sheet){return sheet.getSHeetName();}))));
		//Browser.msgBox('active_index=' +active_index);
		//Browser.msgBox('sheets =' + JSON.stringify(sheets.map(function(sheet){return sheet.getSheetName();})));		
		////return this; // Causes error 'cannot return cyclic value'
		return this;

	};
	/** setRowsColumnsMaxCount
	 */
	var setRowsColumnsMaxCount = function() {
		max_rows	= self.sheet.getMaxRows();
		max_columns	= self.sheet.getMaxColumns();
		return this;
	};
	/** flush
	 */
	var flushAndUpdateThis = function() {
		SpreadsheetApp.flush();
		setRowsColumnsMaxCount();
		return this;

	};
	return this;	
//	return typeof Sheeter !=='object' ? project : this;
}; // end of Sheeter 

