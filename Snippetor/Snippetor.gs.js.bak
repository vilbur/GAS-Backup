/*=====================================================================================================================================
   Snippetor
/*=====================================================================================================================================*/

/* SET PROJECT NAME */
var project_name	= 'Snippetor';
var sheet_output_name = 'Diagram';
/*
 * VARIABLE:	Snippetor("variable",	"public", "var_name",	"value", "snippet_data.datatype")
 * FUNCTION:	 Snippetor("function",	"public", "methodName",	"value", "snippet_data.datatype")
 *
 */
var Snippetor = function() {
	Logger.log('Snippetor() INIT');
	/*====== PRIVATE PROPERTIES ======*/
	var self	= this;
	var data;
	var values;	
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var sheet	= spread.getActiveSheet();

	//var row;	
	//var header_columns;
	var snippet_data = {
		'name':	'',
		'access':	'',
		'datatype':	'',
	};
	/**
	 */
	var sheet_data = {
		id:	'',
		lang:	'',		
		name:	'',		
		syntax:	{},
	};
	var syntax = {
		_default:{
			eol:	';',
			equal:	'=',
			var_identifier:	'',
		},
		ahk:{
			eol:	'',
			equal:	':=',
			var_identifier:	'$',
		},		
		php:{
			var_identifier:	'$',
		},
		js:{},
	};

	/*====== PUBLIC PROPERTIES ======*/
	//this.test = 'testVariable';
	/*======================================================================================*/
	/*  PUBLIC METHODS                                                                      */
	/*======================================================================================*/
	/** set data variable
	 */
	this.setData = function(_data) {
		data = _data;
		flatternData();
		setSheetData();
		setSnippetData();
		setValues();
		return this;
	};
	 /**
	 */
	this.getProperty = function() {
		/*====== GET PROPERTY UML ======*/
		/** getUML
		 */
		this.getUML = function() {
		return ( new UML( "variable", sheet_data, snippet_data, getValuesString() )).getProperty();
			//return 'getUML';
		};
		/*====== GET PROPERTY DEFINITION ======*/
		/** getDefinition
		 */
		this.getDefinition = function() {
			return snippet_data.datatype + ' ' +  getSyntax("var_identifier") + snippet_data.name;
			//return 'getDefinition';
		};
		/*====== GET PROPERTY SNIPPET ======*/
		/** getSnippet
		 */
		this.getSnippet = function() {
			/**
			 */
			var getPropertyName = function() {
				/* get Acces by lang */
				var access = snippet_data.access;
				switch (sheet_data.lang) {
					case 'js':	access_by_lang = access == "public" ? "this." : "var ";break;
					case 'ahk':	access_by_lang = access == "public" ? "this." : "";break;	
					case 'php':	access_by_lang = access.match(/public|private|protected|global/gi) ? access + " " : "";break;
					default:	access_by_lang = access + " ";
				}
				/* get variable identifier by lang */
				//var identifier = (sheet_data.lang == "ahk" && access == "public") ? "" : getSyntax("var_identifier"); // Exception for "public" if "ahk" language 
				return access_by_lang + getSyntax("var_identifier") + snippet_data.name;
			};	

			/*
			 */
			return getPropertyName() + " " + getSyntax("equal") + " " + getValuesString() + getSyntax("eol");
			//return 'getSnippet';
		};
		
		return this;		
	};
	
	/*====== METHOD ======*/
	/**
	 */
	this.getMethod = function() {
		
		var method_params;
		/** get definition for class
		 * if name==project_name
		 */
		var getString_class = function() {
			switch (sheet_data.lang) {
				case 'js':	return project_name + " = function()";
				case 'ahk':	return "Class " + project_name;
				default:	return "Class " + project_name + "(" + joinArray(values) + ")";
			}
		};		/*  get method definition
		 */
		/** getMethodName
		 */
		var getMethodName = function() {
			//return sheet_data.lang;
			//var access_by_lang = '';
			var access_def = '';		
			/* get definition for Init function
			 * if name=="init|construct|new"
			 */
			var getDefinition_methodInit = function() {
				switch (sheet_data.lang) {
					case 'js':	return "function " + project_name;
					case 'php':	return "__construct";
					case 'ahk':	return "__New";
					default:	return name;
				}
			};
			/** getMethod_php
			 */
			var getMethod_php = function() {
				var	access_by_lang = snippet_data.access.match(/public|private|protected|global/gi) ? snippet_data.access + " function " : "function ";
				return access_by_lang + snippet_data.name;
			};
			/** getMethod_js
			 */
			var getMethod_js = function() {
				//return snippet_data.access;
				//return access_def = project_name + ".prototype.";
				switch (snippet_data.access.toLowerCase()) {
					case 'public':	access_def = "this.";break;
					case 'private':	access_def = "var ";break;
					case 'prototype':	access_def = project_name + ".prototype.";break;
					default:
						return "function " + snippet_data.name;
				}
				return access_def + snippet_data.name + " = function";
			};
			
			
			if (snippet_data.name.toLowerCase().match(/(init|construct|new)$/gi))
				return getDefinition_methodInit();
			else {
				switch (sheet_data.lang) {
					case 'js':	return getMethod_js();
					case 'php':	return getMethod_php();
					default:	return snippet_data.name;
					//default:	access_by_lang = "";						
				}
				//return access_by_lang + snippet_data.name;
			}
		};
		/**
		 */
		var getMethodReturn = function() {
			//////var equal = ' '; // '\n' & '\t' add "EXTRA QUOTES" around cell content when copy from spreedsheet, TODO: need to be resolwed via AUTOHOTKEY 
			//////	return equal + "return " + snippet_data.datatype + getSyntax("eol") + equal;
			if (typeof snippet_data.datatype !== 'undefined' && snippet_data.datatype !== '')
				return '{ return ' + snippet_data.datatype + getSyntax('eol') +' }';
			
			return '{}';
		};	
		/* Get string of method parameters
		 * 
		 * @return string of values
		 */
		var getMethodParams = function() {
			//return 'getMethodParams';
			if( typeof method_params !== 'undefined' )return method_params;
			var params;
			if ( values.join('').match(/^$|^\s+$/) )
				return '()';
			else
				params = values.map(function(val){
					//if (val !== '') return val;
					if (val !== '') return convertToString(val);					
				}).join(', ');
			method_params = '( ' + params+ ' )';
			return method_params;
		};	
		
		/*====== GET METHOD UML ======*/
		/** getUML
		 */
		this.getUML = function() {
			if (data === '#REF!' ) return valuesException();
			return ( new UML( "function", sheet_data, snippet_data, values )).getMethod();
		};
		/*====== GET METHOD DEFINITION ======*/
		/** getDefinition
		 */
		this.getDefinition = function() {
			//Logger.log('getDefinition() data='+JSON.stringify(data));
			if (data === '#REF!' ) return valuesException();
			//return 'getDefinition';
			return snippet_data.name + getMethodParams();
			//return snippet_data.name + '()';
		};
		/*====== GET METHOD SNIPPET ======*/
		/** getSnippet
		 */
		this.getSnippet = function() {
			if (data === '#REF!' ) return valuesException();
			return  getMethodName() + getMethodParams() + getMethodReturn() + getSyntax("eol");
		};
		
		return this;		
		//return JSON.stringify(snippet_data);
	};


	/* Add variable identifier on variable start if not yet E.G: var -> $var
	 */
	/*======================================================================================*/
	/*  PRIVATE METHODS                                                                     */
	/*======================================================================================*/
	/** valuesException
	 */
	var valuesException = function() {
		return 'Values are passed as range';
	};
	
	/**
	 */
	var getSyntax = function(syntax_key) {
		return sheet_data.syntax[syntax_key];
	};
	//var rx_datatypes = 'string|integer|array|object|boolean|true|false|number|null';
	/** arrayFlattern
	 */
	var arrayFlattern = function(arr) {
		
		if( typeof arr === 'object' )
			return [].concat.apply([], arr);
		return arr;

	};
	/** Wrap to quotes if does not match to variable definition or object|array string
	 *
	 *		object
	 *		Integer
	 *		string
	 *		array
	 *		
	 *		object   TestObject
	 *		Integer 9999
	 *		string $fooString
	 *		array $fooArray
	 *		['item', 'item2']
	 *		{key:'string'}
	 *  
	 */
	var convertToString = function(_values) {
		//return 'convertToString';
		if(typeof _values === 'object')_values = _values.join(' ');
		//return (isNaN(_values) && !_values.match(/true|false|null/gi)) ? _values.replace(/^\s*['"]*(.*)['"]*\s*$/gi, "'$1'") : _values;
		//return (isNaN(_values) && !_values.match( /^(string|integer|array|object|boolean|true|false|number|null)(\s+.+)*/gi)) ? _values.replace(/^\s*['"]*(.*)['"]*\s*$/gi, "XXX'$1'") : _values;
		return (isNaN(_values) && !_values.match( /^(string|integer|array|object|boolean|true|false|number|null|[\[{].+)($|\s+\S+$|\s+[\[{].*)/gi)) ? _values.replace(/^\s*['"]*(.*)['"]*\s*$/gi, '"$1"') : _values;		
	};
	/**
	 */
	var getValuesString = function() {
		
		/* RETURN Datatype if empty */
		if ( values.join('').match(/^$|^\s+$/) )
			return snippet_data.datatype;					
		///** convertToString
		// */
		//var convertToString = function(_values) {
		//	//return 'convertToString';
		//	if(typeof _values === 'object')_values = _values.join(' ');
		//	return (isNaN(_values) && !_values.match(/true|false|null/gi)) ? _values.replace(/^\s*['"]*(.*)['"]*\s*$/gi, "'$1'") : _values;
		//};
		/** convertObject
		 */
		var convertToObject = function() {
			var brackets = snippet_data.datatype === 'array' ? ['[',']'] : ['{','}'];
			values_object_string = values.map(function(value){
				//if( typeof value === 'string' && !value.match(/true|false|null/gi)) // IF NUMBER OR STRING BUT NOT BOOLEAN
					return isNaN(value) ? convertToString(value) : Number(value);	    // CONVERT TO STRING OR NUMBER
				//return value;
			}).join(', ');
			/* WRAP TO BRACKETS */
			values_object_string = values_object_string.replace(/^\s*[\[{]*([^\]}]+)[\]}]*\s*$/gi, brackets[0]+'$1'+ brackets[1]);
			return values_object_string;
		};
		
		/* IF datatype === 'object|array' */
		if( snippet_data.datatype.match('object|array','gi') )
			return convertToObject();
		
		if( snippet_data.datatype==='string')
			return convertToString(values);
		
		else if( snippet_data.datatype==='number')
			return	Number(values);
		
		else if( snippet_data.datatype==='integer')
			return	parseInt(values);	

		return values;
	};
	/*======================================================================================*/
	/*  INIT METHODS                                                                        */
	/*======================================================================================*/	
	/** flatternData
	 */
	var flatternData = function() {
		data	= arrayFlattern(data);
	};
	/*  FOR REVISION
	 */
	var setSheetData = function(){
		
		/*
		 */
		var getSyntaxData = function(lang){
			var syntax_keys	= Object.keys(syntax._default);
			var syntax_data	= syntax._default;
			if( typeof syntax[lang] !== 'undefined' )
				for(k=0; k<syntax_keys.length;k++) {
					var key = syntax_keys[k];
					if( typeof syntax[lang][key] !== 'undefined' )
						syntax_data[key] = syntax[lang][key]; 
				}
			return syntax_data;
		};
		
		sheet_data.name	= sheet.getName();
		sheet_data.lang	= sheet_data.name.split('.').pop();
		sheet_data.syntax	= getSyntaxData(sheet_data.lang);
		sheet_data.max_columns	= sheet.getMaxColumns();
		//PropertiesService.getScriptProperties().setProperty( id, JSON.stringify(sheet_data) );
	};
	/** setSnippetData
	 */
	var setSnippetData = function() {
		snippet_data.name	= data[0];
		snippet_data.access	= data[1] ? data[1].toLowerCase() : '';
		snippet_data.datatype	= data[2] ? data[2].toLowerCase() : '';		
	};
	/** setValues
	 */
	var setValues = function() {
		values = data.slice(3);
	};
	

    return this;

};

//msg(typeof this.Snippetor)
