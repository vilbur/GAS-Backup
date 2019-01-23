/* ================================================================= */
/*	EVENTS                                                           */
/* ================================================================= */
/**	Project specific onOpen Event
*	Call via library:	ParentClass.call(namespace, 'onOpen');
*	Call when imported:	new ParentClass().onOpen(); OR ParentClassNew().onOpen();
*/
this.onOpen = function() {
//  Browser.msgBox('NewScript.onOpen()');
	this.addMenu();
	//LibraryName.install();	// show dialog with snippet of necessary functions for library script, set this snippet to MAIN script to make it work
	//LibraryName.call('onOpen');	// import function of object, call from LIBRARY
	//importScript('LibraryName', 'onOpen')	// import function of object, call from LIBRARY even from MAIN SCRIPT
};
/**	Project specific onEdit Event
*	Call via library:	ParentClass.call(namespace, 'onEdit');
*	Call when imported:	new ParentClass().onEdit(); OR ParentClassNew().onOpen();
*/
this.onEdit = function(e) {
//  Browser.msgBox('NewScript onEdit() '+ e.value);
};


/* ================================================================= */
/*	EVENT NATIVE FUNCTIONS                                           */
/* ================================================================= */
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