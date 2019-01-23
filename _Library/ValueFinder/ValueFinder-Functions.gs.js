/*=====================================================================================================================================
 There are 3 ways how script can be run
 1. MAIN    // Script is main script in sheet              // scripts are used outside of class
 2. LIBRARY // Script is called via library to main script // for development
 3. MERGED  // Script is merged into main script           // for production, all script are wrapped to main class

/*=====================================================================================================================================*/

/** Project name - name of main class
 *  COMMENT project_name for merging
 */
var project_name = 'ChildClass';
/** Main class of project
 *  Merge all scripts of project into this class for merge to MAIN script
 *  Menu functions MUST be placed in scope of MAIN script
 */
var ChildClass = function(){ 



  return typeof ChildClass !=='object' ? project : this;
}; // end of ChildClass 

