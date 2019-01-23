/*=====================================================================================================================================*/
/*                                                                                                                                     */
/*  getNamedRanges - MENU FUNCTIONS                                                                                                    */
/*  Contetn of this file has to be in scope of MAIN SCRIPT                                                                             */
/*                                                                                                                                     */
/*=====================================================================================================================================*/
/** Get Object if script is imported from Library or Main class of project
 * Used for smooth launching from Library or main script 
 */
function getNamedRanges(){
	return typeof NamedRanges ==='object'? NamedRanges:NamedRanges();
}

/* ================================================================= */
/*	DEFAULT FUNCTIONS                                                */
/* ================================================================= */
/**
 */
function getNamedRangesDialogHelp() {
	getNamedRanges().showDialog('_TemplateDialogHelp.html', project_name + ' Help');
}


/* ================================================ */    
/*					MENU FUNCTIONS					*/      
/* ================================================ */ 

/* ================================================ */    
/*					TEST FUNCTIONS					*/      
/* ================================================ */

/*
====== HELPER FUNCTIONS ======
*/


/** getActiveRange
*/
function getActiveRange(){
	return SpreadsheetApp.getActive().getActiveRange();
	//return SpreadsheetApp.getActive().getRange('A2');
}
function getgetNamedRangesActiveCell(){
	return getNamedRanges().findgetNamedRanges( getActiveRange() );
}

/*
====== MENU TEAT FUNCTIONS ======
*/

/** 
*/
function findgetNamedRangesMenu(){
	var nranges	= getNamedRanges().findgetNamedRanges(getActiveRange()).getNames();
	if(nranges===false)
		Browser.msgBox('Selected range IS NOT in named ranges' );		
	else{
		Browser.msgBox('getNamedRanges of active cell: '+JSON.stringify(nranges.get()));
		Browser.msgBox('Array of getNamedRanges of active cell: '+JSON.stringify(nranges.toArray()));		
	}
}

/** Test of getNamedRanges.findAllSharedgetNamedRangesMenu()
*/
function findAllSharedgetNamedRangesMenu(){
	var nranges	= getNamedRanges().findAllSharedgetNamedRanges( getActiveRange() ).getNames();
	Browser.msgBox('All getNamedRanges sharing same prefix: '+JSON.stringify( nranges.get() ));
	Browser.msgBox('Array of All getNamedRanges sharing same prefix: '+JSON.stringify( nranges.toArray() ));	
}
/** 
*/
function getPrefixesMenu(){
	//Browser.msgBox('Ranges of getNamedRanges for selected range: '+JSON.stringify( getgetNamedRangesActiveCell().getPrefixes() ));
	Browser.msgBox('Ranges of All getNamedRanges: '+JSON.stringify( getNamedRanges().getPrefixes() ));	
	Browser.msgBox('Ranges of getNamedRanges for selected range: '+JSON.stringify( getNamedRanges().getPrefixes(getActiveRange()) ));	

}

/** 
*/
function findPrefixesMenu(){
	var nranges_prefixes = getNamedRanges().findPrefixes( getActiveRange() ).get()
	Browser.msgBox('Prefixes of getNamedRanges for selected range: '+JSON.stringify( nranges_prefixes ));
}


/*
====== MENU TEAT FUNCTIONS ======
*/

/** 
*/
function getA1NotationMenu(){
	Browser.msgBox('getA1Notations of getNamedRanges for selected range: '+JSON.stringify( getgetNamedRangesActiveCell().getA1Notation().get() ));
	Browser.msgBox('getA1Notations of "names" getNamedRanges: '+JSON.stringify( getNamedRanges().getA1Notation().get() ));	

}
/** 
*/
function getNamesMenu(){
	Browser.msgBox('Names of getNamedRanges for selected range: '+JSON.stringify( getgetNamedRangesActiveCell().getNames().get() ));
	//Browser.msgBox('Names of prefix "names" getNamedRanges: '+JSON.stringify( getNamedRanges().getNames('names').get() ));	
}
/** 
*/
function getRangesMenu(){
	Browser.msgBox('Ranges of getNamedRanges for selected range: '+JSON.stringify( getgetNamedRangesActiveCell().getRanges().get() ));
}
/** 
*/
function getValuesMenu(){
	Browser.msgBox('Ranges of getNamedRanges for selected range: '+JSON.stringify( getgetNamedRangesActiveCell().getValues().get() ));
	//Browser.msgBox('Ranges of "names" getNamedRanges: '+JSON.stringify( getNamedRanges().getValues('names').get() ));	
}






