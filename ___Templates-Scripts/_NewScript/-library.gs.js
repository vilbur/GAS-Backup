/*===========================================================================================================================================*/
/*                                                                                                                                           */
/* FUNCTIONS FOR SMOOTH INTEGRATION OF LIBRARY SCRIPTS OR MERGED SCRIPTS                                                                     */
/* INSTANCE OF THIS FILE SHOULD BE PLACED IN EVERY PROJECT of Google App Scripts.                                                            */
/*                                                                                                                                           */
/*===========================================================================================================================================*/


/*======================================================================================*/
/*  GLOBAL PROPERTIES                                                                   */
/*======================================================================================*/
/** Reference to project itself
 */
var project = this;

/** Global variable for current script.
 *  String added before functions if script used via library
 *  namespace is modified automatically via call() function
 */
var namespace	= '';


/* ================================================================= */
/*	EVENT NATIVE FUNCTIONS                                           */
/* ================================================================= */
/**	
*/
function onOpen() {
//  Browser.msgBox('function onOpen()');
  new this[project_name]().onOpen();
}
/**	
*/
function onEdit(e) {
  new this[project_name]().onEdit(e);
}

/*======================================================================================*/
/*  LIBRARY METHODS                                                                     */
/*======================================================================================*/

/*-----------------------------------------------------------------------------------------------------------------*/
/** Call functions from LIBRARY or MERGED scripts with one function
 * E.G: importScript('ChildClass', 'onOpen');
 * 
 * @param string	object_name	name of Library or Object
 * @param string	fn_nane	name of called function 
 * @param array	pass_params	parameters passed to called function
 *
 * @return result of function
 */
function importScript(object_name, fn_nane, pass_params){
	return typeof this[object_name] === 'object' ? this[object_name].call(namespace, fn_nane, pass_params) :  this[object_name]()[fn_nane].apply(null,pass_params);
}


/*-----------------------------------------------------------------------------------------------------------------*/
/** Call functions from LIBRARY.
 *  Set global namespace for this project if used via library
 *
 * Run this function like FooClass.call(namespace, 'onOpen') // pass namespace as global variable! it allows auto chaining of namepsaces
 *	
 * E.G: IF library looks like GrandParentClass > ParentClass > ParentClass,
 *			Call from GrandParentClass:    ParentClass.call(namespace, 'onOpen');    // namespace=''
 *			Then in ParentClass menu is:    ParentClass.ParentClass.onOpen();          // namespace='ParentClass.ParentClass.'
 *
 *
 *	@param string	namespace	added to menu functions calls
 *	@param string	fn_name	name of function to execute
 *	@param array	pass_params	to pass to function fn_name()
 *	
 *	@return result of called function
 */
function call(namespace, fn_name, pass_params){
	if( typeof fn_name === 'undefined' )
		Browser.msgBox( 'ERROR - namespace or fn_name PARAMETER IS MISSING: '+project_name+'.call('+namespace+', "undefined")' );			

    setNamespace(namespace);
    Logger.log( project_name+'.call('+fn_name+') namespace='+namespace );			

	if(!Array.isArray(pass_params)) pass_params = [pass_params];
    var return_function = 'return '+fn_name;
    if(typeof pass_params == 'undefined')
        return Function( return_function+'()')();
    else{
		var parameters   = pass_params.map(function(param,i){return 'param'+i;});	// create parameters for each item in parameters	E.G: ['value1', 'value2']
		var fn_construct = return_function+'('+parameters.join(',')+')';	// create string of function call with parameters	E.G: 'return fn_name(param1, param2)'
		parameters.push(fn_construct);	// add function call to apply parameters	E.G: ['value1', 'value2', 'return fn_name(param1, param2)']
		var anonymous_fn = Function.apply(null,parameters);	// create anonymous function which return called function	E.G: function(param1, param2){ return fn_name(param1, param2);} 
		return anonymous_fn.apply(null, pass_params);	// apply pass_params to anonymous function	E.G: function('value1', 'value2')
    }
}

/*-----------------------------------------------------------------------------------------------------------------*/
/** Set namespace to global variable
 * @param string _namespace
 */
function setNamespace(_namespace){
    namespace = getNamespace(_namespace); 
}

/*-----------------------------------------------------------------------------------------------------------------*/
/** Get chain of namespaces for library functions.
 *	
 *	E.G: var project_name = 'FooClass';
 *		 IF namespace=''	THEN return 'FooClass.'
 *		 IF namespace='ParentClass'	THEN return 'ParentClass.FooClass.'
 *	
 *	@param boolean|string namespace
 *	@return string 'Class' return namespace for functions
 */
function getNamespace(_namespace){
    //Logger.log("Sheeter.getNamespace("+_namespace+")");
	var typeof_namespace = typeof _namespace;
    if(typeof_namespace === 'undefined')
      return;
	else if(typeof_namespace === 'string')
		return _namespace.length === 0 ? project_name + '.' : _namespace + project_name + '.';
}


/*======================================================================================*/
/*  LIBRARY METHODS                                                                     */
/*======================================================================================*/
/** Display dialog with snippets of functions which are necessary to run library or merged script
 *
 * HTML IS ALERTED BECAUSE IT CONTAINS JAVASCRIPT, DO NOT USE  HtmlService.createHtmlOutput
 */
function install(){
    //Logger.log( project_name+".install()");
	
	var html = '';
	
	function setHtml_mainHeader(){
		var char_comment = function (){ return '/*'+Array(64).join('=')+'*/';};
		html = char_comment() +'\n/* '+ project_name + '\n'+ char_comment();
	}
	/** get
	*/
	function setHtml_label(label, char_count){
		html += '\n\n/*\n'+Array(char_count).join('=')+' '+ label  +' '+Array(char_count).join('=')+'\n*/';
	}
	/** Add project getter function 
	*/
	function setHtml_projectGetter(){
		var getter_fn = 'get'+project_name;
		if( typeof this[getter_fn] !== 'undefined' ){
			//setHtml_label( getter_fn );
			setHtml_functionsString( getter_fn, ' Getter of script '+project_name);
		}
	}
	/** get Dialog Post Functions
	 * get snippets of all functions with suffix '_post' E.G: function fooDialog_post(){}
	*/
	function setHtml_postFunctions(){
		var post_functions	= [];
		var this_keys	= Object.keys(project);
		for(var k=0; k<this_keys.length;k++) {
			var fn_name	= this_keys[k];
			if (fn_name.match(/.*_post$/gi))
				post_functions.push([fn_name, fn_name]);
		}
		//Logger.log( post_functions );			
		if (post_functions.length > 0 )
			setHtml_object({'Dialog post functions':post_functions});			
	
	}
	/** get
	*/
	function setHtml_functionsString(fn_name, _comment){
		
		var comment	=  _comment ? '\n\n/** '+_comment.replace(/(\s*[A-Z]+)/g, ' $1')  +' */' : '';
		var fn_string	=  typeof this[fn_name] !=='undefined' ? '\n' +this[fn_name].toSource() : '';
		if(comment && fn_string)
			html	+= comment + fn_string;
	}
	/** Get string of functions bodies of menu functions
	*/
	function setHtml_object(_menu_items){

		var menu_labels = Object.keys(_menu_items);
		for(var l=0; l<menu_labels.length;l++) {
			var menu_label	= menu_labels[l];
			var menu_object	= _menu_items[menu_label];
			if (Object.keys(menu_object).length > 0 ){
				if(isNaN(menu_label))
					setHtml_label(menu_label, 6);
				if (typeof menu_object === 'object')
					if(Array.isArray(menu_object) && Array.isArray(menu_object[0]))
						setHtml_object(menu_object);
					else 
						setHtml_functionsString( menu_object[(typeof menu_object[1]!=='undefined' ? 1 : 0)], menu_object[0]);
					
			}
		}
	}
	
	/** setHtml_getFormulas
	*/
	function setHtml_getFormulas(){
		if( typeof new this[project_name]().getFormulas === 'function' ){
			setHtml_label('Formulas', 12);
			setHtml_object(new this[project_name]().getFormulas());
		}
	}
	setHtml_mainHeader();
	setHtml_projectGetter();
	setHtml_postFunctions();
	setHtml_getFormulas();

	/* Show function snippets */
	SpreadsheetApp.getUi().alert( html );
}


/*======================================================================================*/
/*  DEBUG                                                                               */
/*======================================================================================*/
/** Browser message :TODO add toggle to on\off vial lirary call
 */
function msg(message){
	Browser.msgBox(typeof message === 'object' ? message.join(', ') : message );
}
/** Logger message  
 */
function log(data, label){
	
	//var obj_string = '';
	/** getObjectString
	 */
	var getObjectString = function(data) {
		
		var obj_keys = Object.keys(data), i=0,  found = false;
		/** containsObject
		 */
		var contains_object = (function() {
			while ( i < obj_keys.length && !found ) {
				found = typeof data[obj_keys[i]] === 'object';
				i++;
			}
		})();
		
		return !Array.isArray(data) || contains_object ? JSON.stringify(data, null, 4) : function(){
			var array_string = data.join(', ');
			return array_string.length < 100 ? array_string : JSON.stringify(data, null, 4);
		};
	};
	var message	= typeof data === 'object'	? getObjectString(data) : data;	
	var message_label	= typeof data !== 'undefined'	? label + '=' : '';
	Logger.log(message_label+message);	
}




