/*===========================================================================================================================================*/
/*                                                                                                                                           */
/* FUNCTIONS FOR SMOOTH INTEGRATION OF LIBRARY SCRIPTS OR MERGED SCRIPTS                                                                     */
/* INSTANCE OF THIS FILE SHOULD BE PLACED IN EVERY PROJECT of Google App Scripts.                                                            */
/*                                                                                                                                           */
/* Scripts can be executed in one of three following modes                                                                                   */
/*	1. STANDALONE // main script in sheet              - whole project works as SINGLE object                                                */
/*	2. LIBRARY    // called to main script via library - project is wrapped into LIBRARY object                                              */
/*	3. MERGED     // merged into main script           - scripts of each project are MERGED and wrapped to objects of their project names    */
/*                                                                                                                                           */
/*                                                                                                                                           */
/*===========================================================================================================================================*/
/** Reference to project itself
 */
var project = this;

/** Global variable for current script.
 *  String added before functions if script used via library
 *  namespace is modified automatically via call() function
 */
var namespace	= '';

/*-----------------------------------------------------------------------------------------------------------------*/
/** Call functions of LIBRARY or MERGED scripts with one function
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
/** Call functions of this script via library.
 *  Set global namespace for this project if used via library
 *
 * Run this function like FooClass.call(namespace, 'fooFunction') // pass namespace as global variable! it allows auto chaining of namepsaces
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
    setNamespace(namespace);
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







