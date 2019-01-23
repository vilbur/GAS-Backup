
    /*====== PRIVATE PROPERTIES ======*/

	var self	= this;
	var Sheeter	= getSheeter();
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var sheet	= spread.getActiveSheet();
	var parent_counter;
	var parentFolder;
	var counter	= 1.0;
	var counter_folder	= 1.0;
	var hierarchy	= {};
	var parent_counters	= {};

	var row_options	= {color:'white', background:'RoyalBlue', weight:'bold', align:'center', width:128};
	var row_data	= {'Name':{width:256}, 'Employee ID':{},'Supervisor ID':{}, 'Role':{}, 'Image URL':{}};	
	var columns_count	= Object.keys(row_data).length;
	var folders_contents	= {};
	var floders_names	= {};	
	this.sheet_folder_ids	= {};	
	var complete_data	= [];

	var icons = {
		file:	'https://image.flaticon.com/icons/png/128/149/149345.png',	// https://www.flaticon.com/free-icon/file_149345
		folder:	'https://image.flaticon.com/icons/png/128/148/148947.png',	// https://www.flaticon.com/free-icon/folder_148947
		folder_open:	'https://image.flaticon.com/icons/png/128/148/148953.png',	// https://www.flaticon.com/free-icon/folder_148953		
		folder_parent:	'https://image.flaticon.com/icons/png/128/149/149877.png',	// https://www.flaticon.com/free-icon/folder_149877
		document:	'https://image.flaticon.com/icons/png/128/281/281760.png',	// https://www.flaticon.com/free-icon/docs_281760
		spreadsheet:	'https://image.flaticon.com/icons/png/128/281/281761.png',	// https://www.flaticon.com/free-icon/sheets_281761
		slides:	'https://image.flaticon.com/icons/png/128/281/281762.png',	// https://www.flaticon.com/free-icon/slides_281762
		'drive-sdk':	'https://image.flaticon.com/icons/png/128/482/482204.png',	// https://www.flaticon.com/free-icon/document_482204
		//template:	'iconLink',	// https://www.flaticon.com/free-icon/								
		
		
	};
	
	var icons_rx_string = '\.('+Object.keys(icons).join('|')+')';
	/*======================================================================================*/
	/*  PUBLIC METHODS                                                                      */
	/*======================================================================================*/
	
	/* Get First parent folder of current sheet
	 *
	 */
	//function getParentFolderOfSpread() {
	this.getParentFolderOfSpread = function(){
		var parent_folders=[];
		var ss = SpreadsheetApp.getActive(); //current spreadsheet
		var directParents = DriveApp.getFileById(ss.getId()).getParents();
		while( directParents.hasNext() )
		  parent_folders.push(directParents.next());
		  //Logger.log(directParents.next().getName());
		return parent_folders[0];
	};
	/** getFolderOfSheet
	 */
	this.getFolderOfSheet = function(sheet) {
		var sheet_data	= { 'id': '', 'name': ''};
		var sheet_id	= sheet.getSheetId();
		if(this.sheet_folder_ids && this.sheet_folder_ids[sheet_id] ){
			Logger.log('this.sheet_folder_ids='+JSON.stringify(this.sheet_folder_ids, null, 4));
			var folder_id	= this.sheet_folder_ids[sheet_id];
			return { 'id': folder_id, 'name': DriveApp.getFolderById(folder_id).getName()};
		} else
			return sheet_data;
	};
	/*
		====== GENERATE TREE ======
	*/
	/** Get File tree for - Lucidchart Data feed for 'OrgChart' displaying file tree
	 */
	this.generateTree = function(folder_id, spread_or_sheet){
		Logger.log('generateTree( '+folder_id+', '+spread_or_sheet+' )');
		setParentFolder(folder_id);
		this.sheet_folder_ids	= {};
		try {
			//folders_contents[parentFolder.getName()] = [[parentFolder.getName(),counter, '', 'Parent', icons.folder ]];
			setTreeItemsSheet(parentFolder);
			//Sheeter.setRows(2).setColumns(columns_count).setHeaders(row_data, row_options);
			//sheet.getRange(2,1, folders_contents.length, columns_count).setValues(folders_contents);

			Logger.log('folders_contents='+JSON.stringify(folders_contents, null, 4));
			fillSheets(spread_or_sheet);
			//folderIdsSave();

		} catch (e) {
			Logger.log(e.toString());
		}
	};

	/** folderIdsSave
	 */
	var folderIdsSave = function() {
		PropertiesService.getScriptProperties().setProperty('sheet_folder_ids', JSON.stringify(self.sheet_folder_ids));
	};
	
	/** fillSheets
	 */
	var fillSheets = function(spread_or_sheet) {
		var item_names	= Object.keys(folders_contents);
		var sheet_filetree;
		if(spread_or_sheet==='spread'){
			sheet_folder_ids	= {};
			sheet_filetree	= Sheeter.deleteSheets( true, 'FileTree' ).sheet;
		}
		
		//var complete_sheet_name	= 'FileTree'; 
		SpreadsheetApp.flush();
		for(var f=0; f<item_names.length;f++) {
			var folder_id	= item_names[f];
			var contents	= folders_contents[folder_id];
			/* CREATE SHEET */
			sheet	= Sheeter.createOrGetSheet(floders_names[folder_id], 2, columns_count).sheet;
			/* SETUP SHEET */
			Sheeter.setRows(2).setColumns(columns_count).setHeaders(row_data, row_options);
			sheet.getRange(2,1, contents.length, columns_count).setValues(contents);
			/* SET VALUES */
			complete_data	= complete_data.concat(contents);
			/* SAVE SHEET ID & FOLDER ID */
			self.sheet_folder_ids[sheet.getSheetId()] = folder_id;
		}
		folderIdsSave();
				
		if(spread_or_sheet==='spread'){
			Sheeter.setSheeet(sheet_filetree).setRows(2).setColumns(columns_count).setHeaders(row_data, row_options);
			sheet_filetree.getRange(2,1, complete_data.length, columns_count).setValues(complete_data);
			//self.sheet_folder_ids[sheet_filetree.getSheetId()] = self.getParentFolderOfSpread();
		}

		//Logger.log('complete_data='+JSON.stringify(complete_data));
	};
	
	///** getFolderObject
	// */
	//var getFolderObject = function(parent_name, folder_id, id, parent_counter, role, icon) {
	//	var folder_obj = {}
	//	folder_obj[parent_name] = [folder_id, id, parent_id, role, icon];
	//	return folder_obj;
	//};
	
	/** getIconByMimeType
	 */
	var getIconByMimeType = function(mime_type) {

		var match_mime = (new RegExp(icons_rx_string, "gi")).exec(mime_type);
		if (match_mime) {
			return icons[match_mime[1]];
		}
		return icons.file;
		
	};
	
	/* Get First parent folder of current sheet
	 *
	 */
	var setTreeItemsSheet = function(parent){
		var childFolders	= parent.getFolders();
		var files	= parent.getFiles();
		var parent_id	= parent.getId();		
		var parent_counter	= getParentCounter(parent_id);
		var parent_name	= parent.getName();
		
		folders_contents[parent_id]	= [[parent_name, counter, '', 'Parent', icons.folder_open ]];
		floders_names[parent_id]	= parent_name;
		
		while (files.hasNext()) {
			var file	= files.next();
			//var mime_type	= file.getMimeType();
			Logger.log( file.getName() +'='+JSON.stringify(file.getMimeType()));
			counter = counter+0.1;
			folders_contents[parent_id].push( [file.getName(), counter, parent_counter, 'File', getIconByMimeType(file.getMimeType()) ] );
		}
		
		while (childFolders.hasNext()) {
			var childFolder	= childFolders.next();
			var has_children	= childFolder.getFiles().hasNext() || childFolder.getFolders().hasNext();
			counter	= counter+0.1;
			/* ADD FOLDER */
			folders_contents[parent_id].push( [childFolder.getName(), counter, parent_counter, 'Parent', has_children ? icons.folder_parent : icons.folder ] );
			/*  SPLIT BY FOLDER START */
			if(has_children){
				counter = parseInt(counter)+1;
				//folders_contents[parent_name].push( Array(columns_count).join('|').split('|') );
				//folders_contents[parent_name].push( [childFolder.getName(), counter, '', 'clild', icons.folder ] );
				setTreeItemsSheet(childFolder);
			
			}/*  SPLIT BY FOLDER END */			
		}
	};
	/*
		====== GENERATE LIST ======
	*/
	/** Get File tree for - Lucidchart Data feed for 'Mind Map' displaying file tree
	 */
	this.generateList = function(folder_id){
		Logger.log('generateList('+')');
		setParentFolder(folder_id);
		try {
			hierarchy[parentFolder.getName()] = getHierarchy(parentFolder);
			setTreeItemsList(hierarchy, 0);
			Logger.log('folders_contents='+JSON.stringify(folders_contents, null, 4));
			/* Setup Sheeter */
			Sheeter.setRows(2).deleteRows(1,1).setColumns( 1 );
			/* Set values */			
			sheet.getRange(1, 1, folders_contents.length, 1 ).setValues(folders_contents);			

		} catch (e) {
			Logger.log(e.toString());
		}
		
	};
	
	/* Get First parent folder of current sheet
	 *
	 */
	var getHierarchy = function(parent){
		var childFolders	= parent.getFolders();
		var files	= parent.getFiles();
		var hierarchy_sub	= [];


		while (childFolders.hasNext()) {
			var childFolder	= childFolders.next();
			var subfolder	= {};
			subfolder[childFolder.getName()] = getHierarchy(childFolder);
			hierarchy_sub.push( subfolder );
		}	
		while (files.hasNext()) {
			var file	= files.next();
			hierarchy_sub.push( file.getName() );
		}
		return hierarchy_sub;
	};
	/** setParentFolder
	 */
	var setParentFolder = function(folder_id) {
		if( typeof folder_id !== 'undefined' )
			parentFolder = DriveApp.getFolderById(folder_id);
		else
			parentFolder = this.getParentFolderOfSpread(); /* from current sheet parent folder */
	};
	
	/** getParentCounter
	*/
	var getParentCounter = function(get_id){
		parent_counter	= parent_counters[get_id];
		if( typeof parent_counter === 'undefined' ){
			parent_counters[get_id]	= counter;
			parent_counter	= counter;
		}
		return parent_counter;
	};
	/** setTreeItemsList
	*/
	var setTreeItemsList = function(hierarchy, level){
		Logger.log('setTreeItemsList() hierarchy='+JSON.stringify(hierarchy,null,4));
		level++;
		var indentation	= Array(level).join(' ');
		var folder_name	= Object.keys(hierarchy)[0];
		var items	= hierarchy[folder_name];
		folders_contents.push( [indentation + folder_name] );

		for(var i=0; i<items.length;i++) {
			var item	= items[i];
			if (typeof item==='string')
				folders_contents.push( [indentation +' '+ item] );
			else 
				setTreeItemsList(item, level);
			
		}
	};
  
  
	/*======================================================================================*/
	/*  INIT METHODS                                                                        */
	/*======================================================================================*/	
	/** sheetFolderIdsLoad
	 */
	var sheetFolderIdsLoad = function() {
		self.sheet_folder_ids = JSON.parse(PropertiesService.getScriptProperties().getProperty('sheet_folder_ids'));
	};	
	sheetFolderIdsLoad();