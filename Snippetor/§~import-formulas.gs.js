/* ================================================================= */
/*	FORMULAS                                                         */
/* ================================================================= */

/*====== PROPERTY ======*/
/**
 */
function getProperty(data){
	var snippetor = getSnippetor().Snippetor(data );
	//return [[ snippetor.getProperty().getUML(), snippetor.getProperty().getDefinition(), snippetor.getProperty().getSnippet()]];
	return [[ 'snippetor.getProperty().getUML()', 'snippetor.getProperty().getDefinition()', 'snippetor.getProperty().getSnippet()']];
}
/**
 */
function getPropertyUML(data){
	var snippetor = getSnippetor().Snippetor(data );
	return snippetor.getProperty().getUML();
}
/**
 */
function getPropertyDefinition(data){
	var snippetor = getSnippetor().Snippetor(data );
	return snippetor.getProperty().getDefinition();
}
/**
 */
function getPropertySnippet(data){
	var snippetor = getSnippetor().Snippetor(data );
	return snippetor.getProperty().getSnippet();
}



/*====== METHOD ======*/
/**
 */
function getMethod(data){
	var snippetor = getSnippetor().Snippetor(data );
	return [[ snippetor.getMethod().getUML(), snippetor.getMethod().getDefinition(), snippetor.getMethod().getSnippet()]];
}


/**
 */
function getMethodUML(data){
	var snippetor = getSnippetor().Snippetor(data );
	return snippetor.getMethod().getUML();
}
/**
 */
function getMethodDefinition(data){
	var snippetor = getSnippetor().Snippetor(data );
	return snippetor.getMethod().getDefinition();
}
/**
 */
function getMethodSnippet(data){
	var snippetor = getSnippetor().Snippetor(data );
	return snippetor.getMethod().getSnippet();
}
