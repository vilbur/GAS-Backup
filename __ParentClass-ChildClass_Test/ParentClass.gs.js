/*=====================================================================================================================================*/
/*                                                                                                                                     */
	var project_name	= 'ParentClass';
/*                                                                                                                                     */
/*=====================================================================================================================================*/

/*-----------------------------------------------------------------------------------------------------------------*/
/*                                                                                                                 */
/* COMMENT OUT 'Class' declaration in line bellow when script is MERGED to main script of sheet                    */
/*                                                                                                                 */
//var ParentClass = function(){ 
/*-----------------------------------------------------------------------------------------------------------------*/


	var self	= this;

	/**	Project specific onOpen Event
	*/
	this.onOpen = function() {
		var ui = SpreadsheetApp.getUi();
		ui.createMenu('ParentClass')
			.addItem('ParentClassTest', namespace + 'ParentClass_menuFunction')
			.addToUi();

		Browser.msgBox('ParentClass onOpen()');
        importScript('ChildClass', 'onOpen', ['value1', ' value2']);
        importScript('ChildClass_merged', 'onOpen', ['value1', ' value2']);
	};
    
	/**	For working this.onOpen() function must be onOpen() must be declared.
	*/
    this.onEdit = function(e) {
		Browser.msgBox('ParentClass onEdit() '+ e.value);
		importScript('ChildClass', 'onEdit', e);
		importScript('ChildClass_merged', 'onEdit', e);
	};

	/**	Each function called from menu must has it`s own call function
	 *	Call function name format: {project_name}_{functionName}()
	 */
	this.menuFunction = function() {
		Browser.msgBox('ParentClassTest()');
	};

	/**	Native events must be declared for working this.onOpen() & this.onEdit()
	*/
    function onOpen(){}
    function onEdit(){}

	
	
	
	

/*-----------------------------------------------------------------------------------------------------------------*/
/*                                                                                                                 */
/* COMMENT OUT 'Class' declaration in lines bellow when script is MERGED to main script of sheet                   */
/*                                                                                                                 */
//	return this;
//}; // end of ParentClass  // COMMENT OUT 'Class' declaration if script is MERGED to main script of sheet
/*-----------------------------------------------------------------------------------------------------------------*/
/**
 *
*/
function ParentClassNew(){
	return typeof ParentClass === 'undefined' ? self : new ParentClass();
}
/* ================================================================= */
/*	MENU FUNCTIONS                                                   */
/* ================================================================= */
/**
 */
function ParentClass_menuFunction() {
	ParentClassNew().menuFunction();
}


/**
 */
function ChildClass_SubClassFunction() {
	ChildClassNew().ChildClassSubClass().SubClassFunction();
}
