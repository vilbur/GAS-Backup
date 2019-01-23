/*======================================================================================*/
/* PRIVATE MENU METHODS                                                                 */
/*======================================================================================*/

/** Get items for menu
 */
this.getMenuItems = function(){
	var items = [
		['Help', 'NewScriptDialogHelp'],
	];
	/* Add test items - not shown if called library */
	if(namespace === ''){
		items.push('-',
			{'Test':[
				['Test Function', 'NewScript_menuFunction'],
			]}
		); 
	}
	return items;
};
/** Add menu to UI
 */
this.addMenu = function(){  
  Menu.create(project_name, this.getMenuItems(), namespace);  
};

/*======================================================================================*/
/* PUBLIC MENU METHODS                                                                  */
/* Each method should has global function in file'~!~Menu.gs'                            */
/*                                                                                      */
/*======================================================================================*/
    
/**	Each function called from menu must has it`s own call function
*	Call function name format: {project_name}_{functionName}()
*/
this.menuFunction = function() {
  Browser.msgBox('NewScript().menuFunction()');
};
