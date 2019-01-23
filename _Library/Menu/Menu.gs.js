/* 
 * There are 3 ways how script can be run
 * 1. STANDALONE // if script is main script in sheet
 * 2. LIBRARY    // if script is called via library to main script
 * 3. MERGED     // if script is merged into main script // for production is better run directly from main script instead of calling via library
 *
 */

/*=====================================================================================================================================*/
/*                                                                                                                                     */
	var project_name	= 'Menu'; // COMMENT IN this line when script is merged to MAIN SCRIPT of sheet  
/*                                                                                                                                     */
/*=====================================================================================================================================*/

/*-----------------------------------------------------------------------------------------------------------------*/
/*                                                                                                                 */
/* COMMENT OUT 'Class' declaration in line bellow when script is MERGED to main script of sheet                    */
/*                                                                                                                 */
//var Menu = function(){ 
/*-----------------------------------------------------------------------------------------------------------------*/

	/*====== PRIVATE PROPERTIES ======*/
	var self	= this;
	var menu;	
	var title;
	var items;
	var namespace = '';			
	/*====== PUBLIC PROPERTIES ======*/
	
	/*======================================================================================*/
	/* Menu - PUBLIC METHODS */
	/*======================================================================================*/
	/** Create menu
	 *	@param	title	string	title of menu
	 *	@param	items	array	of obejcts to menu
	 */
	this.create = function(title, items, namespace) {
		menu = SpreadsheetApp.getUi().createMenu(title);	
		menuAddItems(menu, items).addToUi();
	};

	/*======================================================================================*/
	/* Menu - PRIVATE METHODS */
	/*======================================================================================*/

	/**
	 *	@param	menu	object menu obejct https://developers.google.com/apps-script/guides/menus
	 *	@param	items	object	of menu objects
	 *	@return object menu
	 */
	var menuAddItems = function(menu, items) {

		var items_keys = Object.keys(items);
		for (var i = 0; i < items_keys.length; i++) {
			var key	= items_keys[i];
			var item	= items[key];
			var type	= getItemType(key, item);
	
			if (type !== 'object')
				menu = menuAddItem(menu, type, key, item);
			else
				menu = menuAddItems(menu, item);
		}
		return menu;
	};
	/** Add item to object
	 *	@param	menu	object menu
	 *	@param	type	string type of menu item @ref getItemType()
	 *	@param	key	int|string	object key from item array
	 *	@param	item	mixin	menu object
	 *	@return object menu
	 */
	var menuAddItem = function(menu, type, key, item) {
		switch (type) {
			case 'array-fn':
				menu.addItem(item[0], namespace+item[1]);
				break;
			case 'submenu':
				menu.addSubMenu(menuCreatesubmenu(key, item));
				break;
			case 'separator':
				menu.addSeparator();
				break;
		}
		return menu;
	
	};
	
	/** Create submenu item
	 *  @param	string	label	of submenu
	 *  @param	items	object	of menu objects
	 *  @return object menu
	 */
	var menuCreatesubmenu = function(label, items) {
		return menuAddItems(SpreadsheetApp.getUi().createMenu(label), items);
	};
	/** get type of given object
	 *	@param	key	int|string	object key from items array
	 *	@param	item	mixin	item object
	 *	@return string type of item object: 'array-fn|object|submenu|separator'
	 */
	var getItemType = function(key, item) {
		var typeof_item = typeof item;
	
		if(Array.isArray(item) && item.length == 2 && typeof item[0]== 'string' )
			return 'array-fn';
		else if (typeof_item === 'object') {

			if (!key.match(/^\d+$/gi))
				return 'submenu';
			else
				return 'object';
	
		} else if (item === '-')
			return 'separator';
	};
	
	/**	get menu items 
	 */
	function getMenuItems(){
		var items = [
			['Help', 'NewScriptDialogHelp'],
		];
		/* Add test items - not shown if called library */
		  if(namespace === ''){
			items.push({'Test':[
				['NewTest', '_new'],
			]}); 
		  }
		return items;
	}
	
	/* ================================================================= */
	/*  EVENTS - Used just for test of this script */
	/* ================================================================= */
	/**	Project specific onOpen Event
	 *	Call via library:	Menu.call(namespace, 'onOpen');
	 *	Call when imported:	new Menu().onOpen(); OR NewScriptNew().onOpen();
	 */
	function onOpen() {
		this.create(project_name, getMenuItems(), namespace);  
	};


	
/*-----------------------------------------------------------------------------------------------------------------*/
/*                                                                                                                 */
/* COMMENT OUT 'Class' declaration in lines bellow when script is MERGED to main script of sheet                   */
/*                                                                                                                 */
//	return this;
//}; // end of Menu  // COMMENT OUT 'Class' declaration if script is MERGED to main script of sheet
/*-----------------------------------------------------------------------------------------------------------------*/


/** Get new instance of script
 * @return self If script is STANDALONE script Else
 * @return new instance when script MERGED in main script
*/
function NewScriptNew(){
	return typeof Menu === 'undefined' ? self : new Menu();
}


