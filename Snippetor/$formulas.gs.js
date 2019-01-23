/*======================================================================================*/
/* SCRIPT FORMULAS                                                                      */
/*======================================================================================*/

/** Define formulas used in script
 * Array is used for generation of 'Inser formula' dialog and for import scripts informations
 *
 * @return {'formulas header':[['formula button label', 'formulaFunctionName']]}
 */
this.getFormulas = function(){
	var formulas = [
		['getProperty'],
		['getPropertyUML'],
		['getPropertyDefinition'],
		['getPropertySnippet'],
		['getMethod'],
		['getMethodUML'],
		['getMethodDefinition'],
		['getMethodSnippet'],

	];

	return formulas;
};


/*======================================================================================*/
/* SHOW INSERT FORMULA DIALOG                                                           */
/*======================================================================================*/
/**
 */
this.showInsertFormulasDialog = function(){
	var formula_buttons = '<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css">';
	////formula_buttons += '<h3>'+ items_key  +'</h3>';
	/** iterateObject from getFormulas()
	 */
	var iterateObject = function(_items_object) {
		var item_keys = Object.keys(_items_object);
		for(var s=0; s<item_keys.length;s++) {
			//var item_key	= item_keys[s];
			var items	= _items_object[item_keys[s]];
			if (typeof items === 'object' && Array.isArray(items))
				setFormulaButton(items[0], items[1]);				
			else if (typeof items === 'object' ){
				var items_key = Object.keys(items)[0];
				formula_buttons += '<h3>'+ items_key  +'</h3>';
				iterateObject( items[items_key] );
			}
		}	
	};
	
	/** Get string of formulas bodies of menu formulas
	*/
	function setFormulaButtons(_items_object){
		if( Array.isArray(_items_object) && Array.isArray(_items_object[0])){
			iterateObject(_items_object);
		} else if( Array.isArray(_items_object))
			setFormulaButton(_items_object[1], _items_object[0]);				
	}
	/** set <button> HTML string
	*/
	function setFormulaButton(_label, formula_fn){
		formula_buttons += '<button onclick="google.script.run.insertFormula_post(\''+formula_fn+'\');google.script.host.close();">'+_label+'</button><br><br>';
	}
	setFormulaButtons(getFormulas());
	var html = HtmlService.createHtmlOutput(formula_buttons);
	SpreadsheetApp.getUi().showModalDialog(html, 'Insert formula');

};






