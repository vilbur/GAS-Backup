/*======================================================================================*/
/* PRIVATE MENU METHODS                                                                 */
/*======================================================================================*/

/**
 */
this.getMenuItems = function(){
	var items = [
		['Help', 'NewScriptDialogHelp'],
		'-',
		{'Sheets':[
			['Convert sheet to Snippetor', 'SnippetorSheetCreatorCreateNewSheet'],
			['Set Headers', 'SnippetorSheetCreatorSetHeaders'],
		]},
		{'Seed':[

			['Seed Sample Data to sheet', 'SnippetorSheetSeedSampleData'],
			['Seed Sample Property to selected row', 'SnippetorSheetSeedSampleDataProperty'],
			['Seed Sample Method to selected row', 'SnippetorSheetSeedSampleDataMethod'],
		]},
        {'Insert Dropdowns':[
			['Datatype', 'dropdownDatatype'],
			['Access Variable', 'dropdownAccessVariable'],
			['Access Function', 'dropdownAccessFunction'],
           
		]},
        '-',
        ['Move to output', 'SheetOutputMoveToOutput'],
        '-',
   
        ['Lucidchart Link', 'LucidchartLinkDialog'],
		
	];
	/* Add test items - not shown if called library */
	if(namespace === ''){
		items.push('-',
			{'Test':[
//			{SheetNameChecker:[
				['SheetNameChecker_setProperties', 'SheetNameChecker_setProperties'],
				['SheetNameChecker_getProperties', 'SheetNameChecker_getProperties'],
				['SheetNameChecker_getRenamedSheets', 'SheetNameChecker_getRenamedSheets'],
//			]},
//			{SnippetorDropdown:[
				['checkDropdowns', 'checkDropdowns'],
//			]},
//			{SnippetorSetSheetName:[
				['getSheetNameValidateOrRename', 'getSheetNameValidateOrRename'],
				['getSheetName', 'getNewSheetName']
//			]},
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
/*======================================================================================*/
    
/**	Each function called from menu must has it`s own call function
*	Call function name format: {project_name}_{functionName}()
*/
this.menuFunction = function() {
  Browser.msgBox('NewScript().menuFunction()');
};
