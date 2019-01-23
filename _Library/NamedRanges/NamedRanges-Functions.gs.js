	var self	= this;
	this.nranges	= {};
	this.nranges_names	= [];	
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var sheet	= spread.getActiveSheet();
	var found	= null;	// store results of find	functions 'findNamedRanges()|findPrefixes()|findAllSharedNamedRanges()'
	var result	= null;	// store results of get	functions 'getRanges()|getA1Notation()|getValues()|getNames()'

	/*======================================================================================*/
	/*  PUBLIC METHODS                                                                      */
	/*======================================================================================*/
	/*
		====== FIND NAMEDRANGES ======
	*/
	/** Find NamedRanges for range_search
	 * @param	Range	range_search
	 * @return	this
	*/
	this.findNamedRanges = function(range_search) {
		Logger.log('findNamedRanges('+range_search+')');
		result	= null;
		found	= {};
		if (typeof range_search === "string")
		    range_search	= 	sheet.getActive().getRange(range_search); // get Range object if range_search is A1 notation
		
		var range_pos = {
			row:	range_search.getRow(),
			column:	range_search.getColumn(),
			row_last:	range_search.getLastRow(),
			column_last:	range_search.getLastColumn(),	
		};
		//Browser.msgBox("range_pos= "+JSON.stringify(range_pos, null, 4) );
		for(var prefix in this.nranges){if (this.nranges.hasOwnProperty(prefix)){
			for(var nr=0;nr<this.nranges[prefix].length;nr++){
				var nrange	= this.nranges[prefix][nr];
				var range	= nrange.getRange();				
				//Logger.log('prefix '+prefix+' nrange =' + nrange.getName());
				var nrange_index = {
					row:	range.getRow(),
					column:	range.getColumn(),
					row_last:	range.getLastRow(),
					column_last:	range.getLastColumn()
				};
				//Logger.log(nranges_by_pref[r].getName()+'=' + JSON.stringify(nrange_index, null, 4));
				if( range_pos.column >= nrange_index.column && range_pos.column_last <= nrange_index.column_last )
					if( range_pos.row >= nrange_index.row && range_pos.row_last <= nrange_index.row_last )
						if( typeof found[prefix] === 'undefined' )
							found[prefix] = [nrange];
						else
							found[prefix].push(nrange);
					
			}
		}}
		//Logger.log('findNamedRanges() found =' + JSON.stringify(found));
		return this;
	};
	/** Find prefixes of NamedRanges for range_search
	 * @param	Range	Range object or A1notation
	 * @return	this
	 */
	this.findPrefixes = function(range_search){
		//Logger.log('findPrefixes('+range_search+')');
		this.findNamedRanges(range_search);
		result=null;
		found = Object.keys(found);
		//Logger.log('findPrefixes() found =' + JSON.stringify(found));
		return this;
	};
	/* Find NamedRanges sharing same prefixes as range_search
	 * @param	string	nrange_prefix
	 * @return	this
	 */	
	this.findAllSharedNamedRanges = function (range_search){
		Logger.log('findAllSharedNamedRanges('+range_search+')');
		this.findNamedRanges(range_search);
		var prefixes	= Object.keys(found);
		result	= null;
		found	= {};
		 /* get NamedRanges by names */
		for(var p=0; p<prefixes.length;p++) {
			found[prefixes[p]]=this.nranges[prefixes[p]];
		}
		//Logger.log('findAllSharedNamedRanges() found =' + JSON.stringify(found));
		return this;
	};


	/*
		====== MUTATE FOUND NAMED RANGES ======
	*/

	/**	Get all prefixes
	 *	return [NamedRangePrefix]|null	array of prefixes for given range, return all prefixes if range is undefined, or null if range has not NamedRanges
	 */
	this.getPrefixes = function(range_search){
		Logger.log('getPrefixes('+range_search+')');
		result	= null;
		if( typeof range_search !== 'undefined' ) // find ranges if range is defined
			this.findNamedRanges(range_search);
		Logger.log('getPrefixes() this.get() =' + JSON.stringify(this.get()));
		result = this.get();
		return result ? Object.keys(result) : result; // return prefixes, or return null if given range does not has any NamedRanges
	};
	
	
	/**	Get Range objects of NamedRanges
	 *	return 
	 */
	this.getRanges = function(range_name){
		setToResult('ranges', range_name);
		return this;
	};
	/**	Get getA1Notation of NamedRanges
	 *	return 
	 */
	this.getA1Notation = function(range_name){
		setToResult('A1Notation', range_name);
		return this;
	};
	/**	Get values of NamedRanges
	 *	return 
	 */
	this.getValues = function(range_name){
		setToResult('values', range_name);
		return this;
	};
	/**	Get names of NamedRanges
	 *	Result of previous function is used if undefined, or this.nranges if result is undefined
	 *	return [NamedRangeNames] 
	 */
	this.getNames = function(range_name){
		setToResult('names', range_name);
		//result = this.toArray();
		return this;
	};
	/*
		====== GET RESULT ======
	*/
	/**	Get Result or this.nranges
	 *	return array|object
	 */
	this.get = function(){
		//return typeof result !== 'undefined' ? result : this.nranges;
		var result_final = this.nranges;
		
		if(result)
			result_final = result;
		else if(found)
			result_final = found;

		if(Object.keys(result_final).length===0) return null;
			return result_final;

	};
	/**	Convert result to array 
	 *	return [NamedRange|NamedRangeName|Rage|A1Notation]
	 */
	this.toArray = function(){
		//var result = this.get();
		var to_array	= this.get();
		var result_array	= [];
		if (to_array ===null ||Array.isArray(to_array)) return to_array;

		for(var key in to_array){if (to_array.hasOwnProperty(key)){
			//if (!Array.isArray(to_array[key]))
			var to_array_item = to_array[key];
			
			if ( typeof to_array_item !== 'object')
				result_array.push(to_array_item);
			else
				for(var i=0;i<to_array_item.length;i++){
					result_array.push(to_array_item[i]);
				}
		}}
		return result_array;
	};
	/*======================================================================================*/
	/*  PRIVATE METHODS                                                                     */
	/*======================================================================================*/
	
	/**	set nranges object
	*	@return	void 
	*/
	var setNamedRanges = function(){
		Logger.log('setNamedRanges()');
		self.nranges = {};
		Logger.log('START self.nranges='+JSON.stringify(self.nranges));		
		var nranges = spread.getNamedRanges();
		//var nranges_names = Object.keys(self.nranges);
		for(var nr=0; nr<nranges.length;nr++) {
			var nrange	= nranges[nr];
			var nrange_name	= nrange.getName().toLowerCase();
			var prefix	= nrange_name.split('_').shift();
			if( typeof self.nranges[prefix] === 'undefined' )
				self.nranges[prefix] = [nrange];
			else
				self.nranges[prefix].push(nrange);
			self.nranges_names.push(nrange_name);
		}
		Logger.log('self.nranges='+JSON.stringify(self.nranges));		
	};
	

	/** convert result to desired output
	 * @param string fn_name output function name 'getA1Notation'
	 */
	var setToResult = function(fn_name, range_name) {
		result	= {};

		/** getNamedRange
		 */
		var getNamedRangesForResult = function() {
			var _nranges	= found ? found : self.nranges;
			var _nranges_found	= {};
			if( typeof range_name !== 'undefined' && typeof _nranges[range_name] !== 'undefined' )
				_nranges_found[range_name] = _nranges[range_name];				
			
			return _nranges_found[range_name] ? _nranges_found : _nranges;
		};
	
		var nranges	= getNamedRangesForResult();
		Logger.log('setToResult() nranges =' + JSON.stringify(nranges));
		
		this.ranges = function(nrange){
			return nrange.getRange();
		};
		this.A1Notation = function(nrange){
			return nrange.getRange().getA1Notation();
		};
		this.values = function(nrange){
			return nrange.getRange().getValues();
		};
		this.names = function(nrange){
			return nrange.getName();
		};
		/* Loop NamedRanges and convert to result format */
		for(var prefix in nranges){if (nranges.hasOwnProperty(prefix)){
			for(var nr=0;nr<nranges[prefix].length;nr++){
				
				var _result = this[fn_name](nranges[prefix][nr]);
				if( typeof result[prefix] === 'undefined' )
					result[prefix] = [_result];
				else
					result[prefix].push(_result);
			//result[nrange_name] = this[fn_name](self.nranges[prefix][nr]);
		}}}
		
	};
	/*======================================================================================*/
	/*  INIT METHODS                                                                        */
	/*======================================================================================*/	
	setNamedRanges();
	