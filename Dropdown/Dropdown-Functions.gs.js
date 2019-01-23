	var help_text_prefix	= 'Dropdown';
	var _NamedRanges;
	var spread	= SpreadsheetApp.getActiveSpreadsheet();
	var sheet	= spread.getActiveSheet();
	var range_active	= spread.getActiveRange();

	/** insertToActiveRange
	*/
	this.insertToActiveRange = function(range, value){
		Logger.log('insertToActiveRange('+value+')');

		if(!range) // range is undefined if function is triggered via menu
          range = range_active;
		range.activate();

		if( typeof value === 'undefined' ) // value is undefined if function is triggered via menu
			value = range.getValue();
	
		if( value ==='' || value.match(/(\s+|^\s*dd\s*$)/gi))
			DropdownDialogChoiceGet();
		else
			this.setToRange(range_active, value);
	};
	/**
	 */
	this.setToRange = function(range, nrange_prefix ){
		Logger.log('setToRange('+range+', '+nrange_prefix+')');
		setNamedRanges();
		nrange_prefix = nrange_prefix.toLowerCase().replace(/[\r\n\s]*dd=/gi, ''); // remove 'dd=' if inserted via cell
		
		/* IF nrange_prefix IS FOUND IN ALL PREFIXES */
		if (_NamedRanges.getPrefixes().indexOf(nrange_prefix)> -1){
			var nranges_range	=  _NamedRanges.getRanges(nrange_prefix).toArray();
			var nranges_length	= nranges_range.length;
			//Logger.log('nranges range =' + JSON.stringify(nranges_range));
			//Logger.log('nranges_length=' + JSON.stringify(nranges_length));
			//if(nranges_length === 0) return;
			var Dropdown_values	= nranges_length === 1 ? nranges_range[0] : sort_unique(flatternMatrrix( _NamedRanges.getValues(nrange_prefix).toArray())).sort();			
			//Browser.msgBox('Dropdown_values=' + JSON.stringify(Dropdown_values));
			DataValidationSet(nrange_prefix, range, Dropdown_values, true );
		} else 
          DropdownDialogChoiceGet();  
	};

	/** updateDropdowns
	*/
	this.updateDropdowns = function(e){
		Logger.log('updateDropdowns()');
		setNamedRanges();
		var nranges	= _NamedRanges.findSharedNamedRanges(e.range);
		
		if (Object.keys(nranges.get()).length <= 1 )
			return; 
		//Browser.msgBox("nranges= "+JSON.stringify(nranges.get()) );
		var nranges_values	= nranges.getValues().get();
		/* RETURN If cell is not in NamedRanges */
		if(nranges_values===null)
			return;
		var nranges_prefixes = Object.keys(nranges_values);
		//Browser.msgBox("nranges= "+JSON.stringify(nranges ) );
		//Browser.msgBox("nranges_prefixes= "+JSON.stringify(nranges_prefixes ) );
		//Browser.msgBox("nranges_values= "+JSON.stringify(nranges_values ) );				
		/* Loop prefixes */
		for(var r=0; r<nranges_prefixes.length;r++) {
			var nrange_prefix	= nranges_prefixes[r];
			Logger.log("updateDropdowns() nrange_prefix= "+JSON.stringify(nrange_prefix) );
			/* RETURN If NamedRanges are not used in any Dropdown */
			var ranges_Dropdowns	= ValueFinder.find( 'Dropdown\\s('+nrange_prefix+')', 'RULE_HELP' ).getRanges();
			//Browser.msgBox("ranges_Dropdowns= "+JSON.stringify(ranges_Dropdowns) );
			if(ranges_Dropdowns.length > 0 ){
				var Dropdown_values	= sort_unique(flatternMatrrix( nranges_values[nrange_prefix] ));
				//Browser.msgBox("Dropdown_values= "+JSON.stringify(Dropdown_values) );
				DataValidationSet(nrange_prefix, ranges_Dropdowns, Dropdown_values );
			}
		}
		//Browser.msgBox("named_ranges_found= "+JSON.stringify(named_ranges_found) );
	};
	/** DropdownR
	*/
	this.removeFromActiveRange = function(){
		//var range	= spread.getActiveRange();
		//var ui	= SpreadsheetApp.getUi();
		//var response	= ui.alert('Remove Dropdown in range '+range.getA1Notation()+' ?', ui.ButtonSet.YES_NO);
		//if (response == ui.Button.YES) 
		range_active.setDataValidation(null);	
	}; 	
	/** getHelpText
	 */
	var getHelpText = function(name) {
		return help_text_prefix +' '+ name;
	}; 
	/** Set Dropdowns to ranges
	 *  @param {NamedRangePrefix:[Range]} ranges to create\update datavalidations
	 *  @
	 */
	var DataValidationSet = function(Dropdown_name, ranges, values, set_value) {
		Logger.log('DataValidationSet('+Dropdown_name+', '+ranges+', '+values+')');
		if( values.length === 0 )return;
		var Dropdown_type = Array.isArray(values) ? 'LIST' : 'RANGE';
		/** getStValue
		 */
		var getStValue = function() {
			if(typeof set_value==='boolean' && set_value!==false)
				return Dropdown_type === 'RANGE' ? SpreadsheetApp.getActive().getRange( values.getA1Notation() ).getValue() : values[0];
			return false;
		};
		set_value = getStValue();
		//Logger.log('set_value=' + set_value);			
		//var help_text = getHelpText(Dropdown_name);
		var DaraValidation	= SpreadsheetApp.newDataValidation();
	  	if (!Array.isArray(ranges)) ranges = [ranges];
		/* Set RANGE or VALUE LIST */
		var rule = (!Array.isArray(values)) ? DaraValidation.requireValueInRange(values) : DaraValidation.requireValueInList(flatternMatrrix(values));
		rule.setHelpText(getHelpText(Dropdown_name)).build();
		
		for(var r=0; r<ranges.length;r++) {
			ranges[r].setDataValidation(rule);
			if(set_value)
				ranges[r].setValue(set_value);
		}
	};
	/** setNamedRanges
	 */
	var setNamedRanges = function() {
		if( typeof _NamedRanges === 'undefined' );
			_NamedRanges = NamedRanges;
	};
	
	
	/** flatternRanges
	*/
	var flatternMatrrix = function (matrix){
		var matrix_filered = matrix.filter(function(value){if (value !== null) return value; });
		//var matrix_filered = [].concat.apply([], matrix_filered);
		return [].concat.apply([], [].concat.apply([], matrix_filered));
	};
	/*
	 *
	 */
	var sort_unique = function(arr) {
		return arr.sort().filter(function(el,i,a) {
			return (i==a.indexOf(el));
		});
	};