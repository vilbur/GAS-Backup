/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  NewScript - MENU FUNCTIONS                                                                                                         */
/*  Contetn of this file has to be in scope of MAIN SCRIPT                                                                             */
/*                                                                                                                                     */
/*=====================================================================================================================================*/
/** Get Object if script is imported from Library or Main class of project
 * Used for smooth launching from Library or main script 
 */
function getNewScript(){
  return typeof NewScript ==='object'? NewScript:NewScript();
}
/* ================================================================= */
/*	DEFAULT FUNCTIONS                                                */
/* ================================================================= */
/**
 */
function NewScriptDialogHelp() {
	NewScript().showDialog('_TemplateDialogHelp.html', project_name + ' Help');
}



/* ================================================================= */
/*	MENU FUNCTIONS                                                   */
/* ================================================================= */
/**
 */
function NewScript_menuFunction() {
	NewScript().menuFunction();
}


/* ================================================================= */
/*	TEST FUNCTIONS                                                   */
/* ================================================================= */