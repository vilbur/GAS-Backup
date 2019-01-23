/*======================================================================================*/
/* PRIVATE MENU METHODS                                                                 */
/*======================================================================================*/

/**
 */
this.getMenuItems = function(){
	var items = [
		['Help', 'NamedRangesDialogHelp'],
	];
	/* Add test items - not shown if called library */
	if(namespace === ''){
		items.push('-',
//			{'Test':[
				['findNamedRanges(activeRange)', 'findNamedRangesMenu'],
				['findAllSharedNamedRanges()', 'findAllSharedNamedRangesMenu'],
                '-',
				['getPrefixes()  - Get all prefixes', 'getPrefixesMenu'],	
				['findPrefixes() - Get all prefixes for active range', 'findPrefixesMenu'],								
                '-',
				['getA1Notation() - For active range', 'getA1NotationMenu'],
				['getNames()      - For active range', 'getNamesMenu'],
				['getRanges()     - For active range', 'getRangesMenu'],
				['getValues()     - For active range', 'getValuesMenu']	                
//			]}
		); 
	}
	return items;
};
/**
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
  Browser.msgBox('NamedRanges().menuFunction()');
};
