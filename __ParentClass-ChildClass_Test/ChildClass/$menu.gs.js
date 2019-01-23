/*======================================================================================*/
/* PRIVATE MENU METHODS                                                                 */
/*======================================================================================*/

function addMenu() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('ChildClass')
  .addItem(namespace+'ChildClassTest', namespace + 'ChildClass_menuFunction')
  .addItem('SubClassFunction', namespace + 'ChildClass_SubClassFunction')
  .addToUi();
  
}

function getMenuItems() {
  
}
/*======================================================================================*/
/* PUBLIC MENU METHODS                                                                  */
/* Each method sould has global function in file'~!~Menu.gs'                            */
/*                                                                                      */
/*======================================================================================*/
    
/**	Each function called from menu must has it`s own call function
*	Call function name format: {project_name}_{functionName}()
*/
this.menuFunction = function() {
  Browser.msgBox('ChildClassTest()');
};


