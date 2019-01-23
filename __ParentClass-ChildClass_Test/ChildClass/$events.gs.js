/* ================================================================= */
/*	EVENTS                                                           */
/* ================================================================= */
/**	Project specific onOpen Event
*	Call via library:	ParentClass.call(namespace, 'onOpen');
*	Call when imported:	new ParentClass().onOpen(); OR ParentClassNew().onOpen();
*/
this.onOpen = function() {
  addMenu();
};
/**	Project specific onEdit Event
*	Call via library:	ParentClass.call(namespace, 'onEdit');
*	Call when imported:	new ParentClass().onEdit(); OR ParentClassNew().onOpen();
*/
this.onEdit = function(e) {
  Browser.msgBox('ChildClass onEdit() '+ e.value);
};

/**	
*/
function onOpen() {
  this.onOpen();
}
/**	
*/
function onEdit(e) {
  this.onEdit(e);
}