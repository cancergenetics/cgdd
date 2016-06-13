// Javascript functions for CGDD web interface.

// Good for testing javascript: http://fiddlesalad.com/javascript/strin

// Tips on making javascript faster:
// Tips on making javascript faster:
//   https://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript/
//   https://www.smashingmagazine.com/2012/06/javascript-profiling-chrome-developer-tools/

// Can get table cell contents using: http://stackoverflow.com/questions/3072233/getting-value-from-table-cell-in-javascript-not-jquery
// traversing table with js (but using fragment is faster): https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces
// Using closest() to get immediate parent: http://stackoverflow.com/questions/9085406/passing-this-as-parameter-in-javascript
// Javascript 'this' parameter:  http://stackoverflow.com/questions/14480401/javascript-this-as-parameter
 
// js 'this': http://www.2ality.com/2014/05/this.html


// a simple sprintf() function.
 // For a more comprehensive one, use: https://raw.githubusercontent.com/azatoth/jquery-sprintf/master/jquery.sprintf.js
 // or: http://www.masterdata.se/r/string_format_for_javascript/
 // var msg = 'the department';
 // in doc ready:
 // g: $('#txt').html(sprintf('<span>Teamwork in </span> <strong>%s</strong>', msg));
function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1;

  str = str.replace(/%s/g, function() {
    var arg = args[i++];

    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
};
/* or simpler is:
function sprintf( format )
{
  for( var i=1; i < arguments.length; i++ ) {
    format = format.replace( /%s/, arguments[i] );
  }
  return format;
}
*/

// As Safari 6 and IE 8 don't support performance.now()  From: http://jsfiddle.net/moob/1vw3ncck/
//Date.now() wasn't added to the JavaScript spec until ECMAScript 5 so this is needed for <=IE8
Date.now = Date.now || function() { return +new Date; };
//Good browsers support window.performance but shitsters like IE and Safari do not
window.performance = (window.performance || {
    offset: Date.now(),
    now: function now(){
        return Date.now() - this.offset;
    }
});
// Alternatively see: https://gist.github.com/paulirish/5438650

// Finish this:
function show_message(elem_id, message, waitfor) {
    // elem_id, the span, div, or paragraph to contain the message
    // message: text or html
    // waitfor: in milliseconds: 0 means don't clear message; undefined means clear after 3 seconds.
	var elem = document.getElementById(elem_id);	
	var data_value = elem.getAttribute("data-value"); // so is a button to reset to its original text value
	// Note: If the attribute does not exist, the return value is null or an empty string ("")
console.log(elem_id,data_value);
	if ((data_value !== null) && (data_value !== "")) {elem.value = message;} // for an input button.
	else {elem.innerHTML = message;}


	// *** Do I need to pass elem and starttime as the optional parameters - but optonal params not supported in IE9 and earlier!!  - so if not defined then don't clear message in IE9 ?? 
    // otherwise could maybe use the timer ID returned by setTimer to set the data-counter?? - if set time can get its own id?     		
    var timerid = "0"; // to set id to zero if no time out specified, so that any pending setTimeout won't clear this message.
	if (typeof waitfor == "undefined") {waitfor = 3000;} // default 3 seconds.	
	if (waitfor > 0) {
        // Only clear message if was set by this call, as may ave subsequently been set by a second click of same button by user.		
        // Use an anonymous function, which works in all browsers (whereas extra parameters for timeout only work in IE9+)		
		timerid = setTimeout(function(){
 console.log("settimeout timerid:",timerid);
    	    if (elem.getAttribute("data-timerid") == timerid) {  // so only clears messages set by this particular show_message() call.
				var data_value = elem.getAttribute("data-value"); // so is a button to reset to its original text value
				if ((data_value !== null) && (data_value!=="")) {elem.value = data_value;}
				else {elem.innerHTML="";}
				}
		}, waitfor);
	  };
    elem.setAttribute("data-timerid",timerid);
	console.log("timerid:",timerid)
  }
	  
	  

// The study_info() function is part of the main "index.html" template as it needs each study from the database Study table.
function study_url(study_pmid) {
    if (study_pmid.substring(0,7) === 'Pending') {href = global_url_for_mystudy.replace('mystudy', study_pmid);} // was: '/gendep/study/'+study_pmid+'/';
    else {href = 'http://www.ncbi.nlm.nih.gov/pubmed/' + study_pmid;}
    return href
}


function study_weblink(study_pmid, study) {
//	if (typeof study === 'undefined') {
		return sprintf('<a href="%s" target="_blank">%s</a>', study_url(study_pmid),study[ishortname]);
		// not displaying this now: study = study_info(study_pmid); 	// returns: short_name, experiment_type, summary, "title, authors, journal, s.pub_date"
//        }
//    return sprintf('<a class="tipright" href="%s" target="_blank">%s<span>%s</span></a>', study_url(click()), study[0], study[3] );
}	

function gene_external_links(id, div, all) {
  // id is a dictionary returned by ajax from: view.py : gene_ids_as_dictionary()
  // if 'all' is false, then shows just those links to be displayed below the boxplot images.
  // gene is a row in the Gene table
  // was previously in 'models.py'
  // Note the above sprinf() returns empty string if variable is undefined.
  //console.log("external_links ids=",id)
//  links  = '<a class="tip" href="http://www.genecards.org/cgi-bin/carddisp.pl?gene='+id['gene_name']+'" target="_blank">GeneCards<span>Genecards: '+id['gene_name']+'</span></a> ';
  links  = '<a href="http://www.genecards.org/cgi-bin/carddisp.pl?gene='+id['gene_name']+'" target="_blank" title="Genecards: '+id['gene_name']+'">GeneCards</a> ';
  if (id['entrez_id'] != '') {links += div+' <a class="tip" href="http://www.ncbi.nlm.nih.gov/gene/'+id['entrez_id']+'" target="_blank">Entrez<span>Entrez Gene at NCBI: '+id['entrez_id']+'</span></a> ';}
  if (id['ensembl_id'] != '') {links += div + sprintf(' <a class="tip" href="http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=%s" target="_blank">Ensembl<span>Ensembl Gene: %s</span></a> ', id['ensembl_id'], id['ensembl_id']);}
    // Ensembl_protein not needed now: if (all && (id['ensembl_protein_id'] != '')) {links += div + sprintf(' <a class="tip" href="http://www.ensembl.org/Homo_sapiens/protview?peptide=%s" target="_blank">Ensembl_protein<span>Ensembl Protein: %s</span></a> ', id['ensembl_protein_id'],id['ensembl_protein_id']);}
  if (id['hgnc_id'] != '') {links += div + sprintf(' <a class="tip" href="http://www.genenames.org/cgi-bin/gene_symbol_report?hgnc_id=%s" target="_blank">HGNC<span>HUGO Gene Nomenclature Committee: %s</span></a> ', id['hgnc_id'], id['hgnc_id']);}
  if (all) {
    // No loner showing VEGA: if (id['vega_id'] != '') {links += div + sprintf(' <a class="tip" href="http://vega.sanger.ac.uk/Homo_sapiens/Gene/Summary?g=%s" target="_blank">Vega<span>Vertebrate Genome Annotation: %s</span></a> ', id['vega_id'], id['vega_id']);}
    if (id['omim_id'] != '') {links += div + sprintf(' <a class="tip" href="http://www.omim.org/entry/%s" target="_blank">OMIM<span>Online Mendelian Inheritance in Man: %s</span></a> ', id['omim_id'], id['omim_id']);}
    links += div + sprintf(' <a class="tip" href="http://www.cancerrxgene.org/translation/Search?query=%s" target="_blank">CancerRxGene<span>CancerRxGene search: %s</span></a> ', id['gene_name'],id['gene_name']);
	}
  links += div + sprintf(' <a class="tip" href="http://www.cbioportal.org/ln?q=%s" target="_blank">cBioPortal<span>cBioPortal for Cancer Genomics: %s</span></a> ', id['gene_name'],id['gene_name']);
  if (id['cosmic_id'] != '') {links += div + sprintf(' <a class="tip" href="http://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=%s" target="_blank">COSMIC<span>Catalogue of Somatic Mutations in Cancer: %s</span></a> ', id['cosmic_id'],id['cosmic_id']);}
  if (id['uniprot_id'] != '') {links += div + sprintf(' <a class="tip" href="https://cansar.icr.ac.uk/cansar/molecular-targets/%s/" target="_blank">CanSAR<span>CanSAR: %s</span></a> ', id['uniprot_id'],id['uniprot_id']);}  // CanSAR uses UniProt ids
  if (all && (id['uniprot_id'] != '')) {links += div + sprintf(' <a class="tip" href="http://www.uniprot.org/uniprot/%s" target="_blank">UniProtKB<span>UniProtKB: %s</span></a> ', id['uniprot_id'],id['uniprot_id']);}
  // Added this GenomeRNAi to boxplot in May 2016:
  if (id['entrez_id'] != '') {links += div + ' <a class="tip" href=" http://www.genomernai.org/v15/gene' + ( id['entrez_id']=='' ?  'Search/'+id['gene_name'] : 'details/'+id['entrez_id'] ) + '" target="_blank">GenomeRNAi<span>GenomeRNAi - phenotypes from RNA interference</span></a>';}  // as links are eg:  http://www.genomernai.org/v15/geneSearch/ERBB2 and http://www.genomernai.org/v15/genedetails/2064 
   
  return links;
}

//function string(driver,target) {
			
	//var driver_protein = ['ensembl_protein_id'];
	//var target_protein = ['ensembl_protein_id'];
	
	//var url = "http://string-db.org/api/image/network?identifiers=" driver_protein + "%0D" + target_protein + "&required_score=400&limit=20";
	
// From: http://string-db.org/help/index.jsp?topic=/org.string-db.docs/api.html
// Example: http://string-db.org/api/image/network?identifiers= 4932.YML115C  %0D  4932.YJR075W  %0D  4932.YEL036C  %20 &required_score=400 &limit=20

// Format is:
// http://[database]/[access]/[format]/[request]?[parameter]=[value]
// database:  'string-db.org'
// access:    'api
// format:    'image'
// request:   'network'

// parameter: 'identifiers':  "required parameter for multiple items, e.g.DRD1_HUMAN%0DDRD2_HUMAN"  (where %0D is carraiage return, and %20 is space)
// value:     '  
// &required_score=400   "Threshold of significance to include a interaction, a number between 0 and 1000"
// &limit=20             "Maximum number of nodes to return, e.g 10." (10 is default)

// &species=  "Taxon identifiers (e.g. Human 9606, see: http://www.uniprot.org/taxonomy)"

// From website:
// find out which proteins match the description "ADD" in human:
//	http://string-db.org/api/tsv/resolve?identifier=ADD&species=9606 
//			
//Returns bare IDs that you could pipe into other STRING API-functions: 
//	http://string-db.org/api/tsv-no-header/resolve?identifier=YOL086C&format=only-ids			
//			
// To get the 20 highest scoring interactors above score 400 for a list of queries. 
//	http://string-db.org/api/tsv-no-header/interactorsList 
//		?identifiers=4932.YML115C%0D4932.YJR075W%0D4932.YEL036C 
//		&required_score=400&limit=20 
// etc...

// My test:
// http://string-db.org/api/image/network?identifiers=DRD1_HUMAN%0DDRD2_HUMAN&required_score=400&limit=20
// http://string-db.org/api/image/network?identifiers=ENSP00000354859%0DENSP00000288309&required_score=400&limit=20

/*
My API request:
http://string-db.org/api/image/networkList?network_flavor=confidence&required_score=700&identifiers=
9606.ENSP00000388648
9606.ENSP00000283109
9606.ENSP00000402084
9606.ENSP00000423665
9606.ENSP00000373574


Interactive String db:

<textarea name="multiple_input_items" id="multiple_identifiers" rows="5" cols="40" style="width:95%;height:6em;"></textarea>
<input style="width:280px;height:1.5em;" type="text" name="species_text" id="species_text" value="auto-detect" onfocus="onFocusCheckEntry(this,'auto-detect',false);" onblur="onBlurCheckEntry(this,'auto-detect',false);" autocomplete="off">
<form id="protein_mode_form" action="http://string-db.org/newstring_cgi/show_input_page.pl" method="post">
<div><input name="targetmode" type="hidden" value="proteins">
<input name="UserId" type="hidden" value="031PLk08ktVZ">
<input name="sessionId" type="hidden" value="mO1ejnRv9HM3">
<input name="input_query_species" type="hidden">
<input name="identifier" type="hidden">
<input name="sequence" type="hidden">
<input name="input_page_type" type="hidden" value="multiple_identifiers">
</div></form>

From chrome dev tools:

------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="flash"

21
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="required_score"

400
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="empty"


------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="UserId"

031PLk08ktVZ
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="sessionId"

mO1ejnRv9HM3
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="have_user_input"

2
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="multi_input"

1
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="multiple_input_items"

9606.ENSP00000388648
9606.ENSP00000283109
9606.ENSP00000402084
9606.ENSP00000423665
9606.ENSP00000373574
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="multiple_input_type"

multi_identifier
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="advanced_menu"

yes
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="limit"

0
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="multiple_input_uploaded_file"; filename=""
Content-Type: application/octet-stream


------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="species_text"

auto-detect
------WebKitFormBoundary84EnaJKpl1u4qBtC
Content-Disposition: form-data; name="input_query_species"

auto_detect
------WebKitFormBoundary84EnaJKpl1u4qBtC--

http://string-db.org/newstring_cgi/show_network_section.pl?taskId=QybRp3rYXqXH&interactive=yes&advanced_menu=yes&network_flavor=evidence
//}
*/


function show_search_info(data) {
  var qi = data['query_info']; // best to test if this exists in the query
  //console.log(qi);
  var search_by = qi['search_by'];
  $("#gene_search_by").html(search_by=='target' ? 'Target' : 'Driver');
  var gene = qi['gene_name'];

  if (gene != global_selected_gene) {alert("ERROR: query returned search by gene("+gene+") != global_selected_gene("+global_selected_gene+")")}
  $("#gene_name").html(gene);
  $("#gene_synonyms").html(qi['gene_synonyms']);
  $("#gene_full_name").html(qi['gene_full_name']);
  // was: $("#gene_weblinks").html(qi['gene_weblinks']);

  global_selected_gene_info = data['gene_ids'];
  if (!(gene_name in gene_info_cache)) {gene_info_cache[gene_name] = data['gene_ids'];} // Store for later.
  
  $("#gene_weblinks").html(gene_external_links(data['gene_ids'], '|', true));

  var histotype_name = qi['histotype_name'];
  var histotype_formatted = (histotype_name=="ALL_HISTOTYPES") ? "<b>"+histotype_display(histotype_name)+"All tissues</b>" : "tissue type <b>"+histotype_display(histotype_name)+"</b>";
  
  $("#result_info").html( "For "+ search_by +" gene <b>" + gene + "</b>, a total of <b>" + qi['dependency_count'] + " dependencies</b> were found in " + histotype_formatted + " in " + study_info(qi['study_pmid'])[idetails]);  
  
  var download_csv_url = global_url_for_download_csv.replace('mysearchby',search_by).replace('mygene',gene).replace('myhistotype',qi['histotype_name']).replace('mystudy',qi['study_pmid']);
  
  var download_excel_url = global_url_for_download_excel.replace('mysearchby',search_by).replace('mygene',gene).replace('myhistotype',qi['histotype_name']).replace('mystudy',qi['study_pmid']);
  
  //$("download_csv_button").html("Download as CSV file"); // reset as could have been set to "Downloading CSV file".
  // console.log("download_url: ",download_csv_url);
  //var button_event = "window.open('" + download_url + "');"
  //console.log(button_event)
  // $("#download_csv")  .click( button_event );
  
    // ******
   // Better to use the form:
   // $("#download_csv_form").action(function() { ......	? return false;
   // http://stackoverflow.com/questions/11620698/how-to-trigger-a-file-download-when-clicking-an-html-button-or-javascript
   
   // eg: or put a button inside a link: <a href="file.doc"><button>Download!</button></a>
   //Link. Then it'll work fine  without JavaScript available. It also offers more of the traditional affordances users might expect from a download link, such as right-click-save-as, or drag-and-drop.

   // But maybe is a Chrome problem:
   // "The headers are correct, express sets them properly automatically, it works in other browsers as indicated, putting html 5 'download' attribute does not resolve, what did resolve it is going into the chrome advanced settings and checking the box "Ask where to save each file before downloading".
   // After that there was no "Resource interpreted as document...." error reported as in the title of this issue so it appears that our server code is correct, it's Chrome that is incorrectly reporting that error in the console when it's set to save files to a location automatically."


   // $("#download_csv_form").attr("action", download_csv_url);
   $("#download_csv_form")
     .attr("action", download_csv_url)
     .submit(function( event ) {	
		show_message("download_csv_button", "Downloading CSV file...");
	//return true;
   });


   // $("#download_excel_form").attr("action", download_excel_url);
   $("#download_excel_form")
     .attr("action", download_excel_url)
     .submit(function( event ) {	
		show_message("download_excel_button", "Downloading Excel file...");
	//return true;
   });

   
/*  
  $("#download_csv_button").click(function() {
	  $("#download_csv").html('Downloading CSV file.');
	  // window.location = download_csv_url; // provided the server sets Content-Disposition: attachment!
	  // or: window.open(download_csv_url); // which briefly open a new browser tab for the download.
	  //$("#download_csv").html('File downloaded'); // but updates text before file is downloaded.
	  // Using the above "window.location = ..." causes Chrome to give warning in console about: 
	  //   "cgdd_functions.js:109 Resource interpreted as Document but transferred with MIME type text/csv: ...."
	  // So use a link instead, or can use a hidden link on the page, eg: <a href="fileLink" download="filename">Download</a>, or a form ....
	  var downloadLink = document.createElement('a');
	  downloadLink.href = download_csv_url;
	  downloadLink.download = download_csv_url; // but this 'download' attribute is html5 so limited browser support possibly
	  document.body.appendChild(downloadLink);  // as link has to be on the document.
	  downloadLink.click();	  
	  }); 
*/	  
}





function setup_qtips() {
// ideas: filter: http://stackoverflow.com/questions/22262325/how-to-create-a-tooltip-for-the-filter-widget-of-the-jquery-tablesorter-plugin

// qtip Examples: http://stackoverflow.com/questions/2950004/how-to-use-jquery-qtip-simple-example-please
// examples inside a html table: http://jsfiddle.net/qTip2/T9GHJ/
// https://forum.jquery.com/topic/apply-tooltip-to-each-cells-for-a-particular-table
//  http://jsfiddle.net/qTip2/qcwV4/
//  http://qtip2.com/demos#positioning-zindex

//dataTable({
//    bLengthChange: false,
//    bFilter: false
//  })
  console.log("Adding qtips to table")
// selector was:  'tr[data-browser]'
	// set up the qtips
  $('#result_table_tbody td')
  .on('mouseenter', null, function (event) {
    //var browser = $(this).data('browser');
    var browser = 'Hello';
	
    $(this).qtip({
        overwrite: false,
        content: 'Test', // '<img src="http://media1.juggledesign.com/qtip2/images/browsers/64-' + browser + '.png" alt="' + browser + '"/>',
        position: {
            my: 'right center',
            at: 'left center',
            target: $('td:eq(1)', this),
            // viewport: $('#datatables')
        },
        show: {
            event: event.type,
            ready: true
        },
        hide: {
            fixed: true
        }
    }, event); // Note we passed the event as the second argument. Always do this when binding within an event handler!
   // =================================== end of qtips setup ===================
   
   // http://stackoverflow.com/questions/16059315/tooltip-on-hover-of-elements-generated-by-ajax-request
   // $(document).on('hover', '.best-item-option', function(){        
   // $('.best-item-option').tooltipster();
   // $('.best-item-option').tooltipster('show');
   //});
   
});
}


function dict_to_string(dict,div) {
	var str = '';
	var count = 0;
	for (key in dict)
	{
		if (str != '') {str += div;}
		str += key
		count++;
	}
	console.log("dict_to_string_and_count",count,str)
	return str;
}

function count_char(s,c) {
	var count = 0;
    for(var i=0; i < s.length; i++){
        if (s.charAt(i) == c) {count++;}
		}
	return count;
}

function get_id_list_for_depenedencies(div, idtype) {
	// returns string with proteins separated by div, and the count of number of proteins in the string
	// if idtype is undefined, set it to ='protein'
	// could add a parameter in future: max_number_to_get
	
	// The following works:
	//console.log("\nUsing standard javascript:");
    // var list_of_proteins ='';
	var protein_dict = {}; // Need to use a dictionary as if tissue is 'All tissues' then each protein can appear several times in dependency table (just with different tissue each time).
	
	var gene_dict = {}; // Need to use a dictionary as if tissue is 'All tissues' then each protein can appear several times in dependency table (just with different tissue each time).
	
	var protein_count = 0;

// http://stackoverflow.com/questions/3065342/how-do-i-iterate-through-table-rows-and-cells-in-javascript
// To get all the filtered cells in the table, use: 	
	/*	
	var table_tbody = document.getElementById("result_table").tBodies[0]; // only is one tbody in this table. console.log("tbodies:",table.tBodies.length);
	for (var i = 1, row; row = table_tbody.rows[i]; i++) { // skip row 0, (which is class 'tablesorter-ignoreRow') as its the table filter widget input row
	console.log(i,row.style);
	    // This 'none' doesn't work - better to check if class is 'filtered'
        if (row.className == "filtered") {continue;}  // class="filtered" for hidden rows, style.display == 'none' doesn't work.
	    var protein_id = row.cells[0].getAttribute("epid"); // ensembl_protein_id
	    // innerText for IE, textContent for other browsers:
	    // console.log(i, (cell.innerText || cell.textContent)); // although text() would be better than html
        console.log(i,row); // ensembl protein id
		if (protein_id != '') {
		  if (list_of_proteins=='') {list_of_proteins += protein_id;}
		  else {list_of_proteins += '%0D'+protein_id;} // The return character is the separator between names.
		}
    }
*/	

    // If
	// 353 is the maximum number of protein id that can be send on the GET line, otherwisse stringdb server reports: 
	// Request-URI Too Long The requested URL's length exceeds the capacity limit for this server.
	// This url of corresponds to 8216 characters (see example in file: max_stringdb_url.txt)
    //console.log('first-child:')

    var getProtein = false, getGene = false;
	switch (idtype) {
		case 'protein':      getProtein=true; break;
	    case 'gene':         getGene=true; break;
		case 'protein-gene': getProtein=true; getGene=true; break;
		default: alert("Invalid idtype: "+idtype); // maybe should default to 'protein'.
	}
	

//    $('#result_table tbody tr:visible td:first-child').each(function(index) {
	// In order to catch the 'remove-me' class of the space <tr> used for the scroller, need to loop through the rows
	// "remove-me": https://github.com/Mottie/tablesorter/issues/1143
	// which is the "tablesorter-scroller-spacer" row.
	
    $('#result_table tbody tr:visible').each(function(index) {
		if ($(this).hasClass("remove-me")) {console.log("Skipping 'remove-me'",index); return true;} // in the each() loop returning 'true' is same effect as 'continue' in a for(..) loop
		//var cell = ., $(this)
		
// first-child selector: http://stackoverflow.com/questions/1045926/jquery-selector-for-every-row-except-the-first-on-every-table-except-first		
// https://github.com/Mottie/tablesorter/wiki/Summary
// https://mottie.github.io/tablesorter/docs/index.html#selectorremove

//		console.log(index," : ",gene_id," : ",protein_id);
        //if (index>0) { // skip row 0, (which is class 'tablesorter-ignoreRow') as its the table filter widget input row
		// continue doesn't work with each(...)

		if (protein_count >= global_max_stringdb_proteins_ids) {return false;} // return false to end the ".each()" loop early. like 'break' in a for() loop. Alternatively return true skips to the next iteration (like 'continue' in a normal loop).
		
	    var first_td = $("td:first-child", $(this));
		
        if (getProtein) {
		    var protein_id = first_td.attr("data-epid");
            if ((protein_id != '') && !(protein_id in protein_dict)) {
                if (getGene) { // getting the gene and protein ids:
                    var gene_id = first_td.attr("data-gene");
                    if ((gene_id != '') && !(gene_id in gene_dict)) {
                        protein_dict[protein_id] = true;
						gene_dict[gene_id] = true;
                        protein_count++;
					}
					else {console.log("A gene with a valid protein id '"+protein_id+"' shares a gene id: '"+gene_id+"'");}
				}
				else { // only getting the protein ids:
                    protein_dict[protein_id] = true;
                    protein_count++;
				}
			}
		}
		else {
            var gene_id = first_td.attr("data-gene");
            if ((gene_id != '') && !(gene_id in gene_dict)) {
				gene_dict[gene_id] = true;
                protein_count++;
			}
				
		}
		
    });
    console.log("get_id_list_for_depenedencies:", protein_dict, gene_dict, protein_count)
	if (getProtein && getGene) {return [dict_to_string(protein_dict,div), dict_to_string(gene_dict,div), protein_count];}
	else if (getProtein) {return [dict_to_string(protein_dict,div), protein_count];}
	else if (getGene) {return [dict_to_string(gene_dict,div), protein_count];}
	else {return false;}
}


function show_cytoscape() {
	
	show_message("cytoscape_submit_button", "Fetching cytoscape...");
	// was: Fetching Cytoscape protein list for cytoscape image

	var protein_and_gene_list_and_count = get_id_list_for_depenedencies(';', 'protein-gene');

	var protein_list = protein_and_gene_list_and_count[0];
    var gene_list = protein_and_gene_list_and_count[1];
    var protein_count = protein_and_gene_list_and_count[2];
	
	// Try to remove unconnected proteins for the list before displaying the string network image.
	
	//var url = global_url_for_stringdb_interactionsList + dict_to_string(protein_dict,'%0D'); // Need a function to do this? eg. jQuery.makeArray() or in EM 5.1: Object.keys(protein_dict);
	
	//var protein_list = dict_to_string(protein_dict,';');
	console.log("Cytoscape original protein count:",protein_count, "Protein list:",protein_list,"Gene list:",gene_list);

    /*
	For GET use:
	var url = global_url_for_cytoscape_get.replace('myproteins', protein_list).replace('mygenes', gene_list);  // Using semi-colon instead of return character '%0D'
	
	window.open(url);  // should open a new tab in browser.
	return false; // or maybe return true?	
	*/

	// For POST using form:
	document.getElementById("cytoscape_protein_list").value = protein_list;
	document.getElementById("cytoscape_gene_list").value = gene_list;
    return true; // to submit the form, otherwise false;
}


/*
function enrich(options) {
	// This is redirecting to the Enrichr site, as: http://amp.pharm.mssm.edu/Enrichr/help#faq&q=3
	//To use it, simply call:
    //    enrich({list: genes});
    // in your JavaScript and pass in genes as a list of Entrez Gene symbols separated by newlines.
	// You can include a description for the list by using:
    //    enrich({list: genes, description: "My description"});
    // To have the results pop up in a new window, use:
    //    enrich({list: genes, popup: true});

    if (typeof options.list === 'undefined') {
        alert('No genes defined.');
    }

    var description  = options.description || "",
    	popup = options.popup || false,
    	form = document.createElement('form'),
    	listField = document.createElement('input'),
    	descField = document.createElement('input');
  
    form.setAttribute('method', 'post');
    form.setAttribute('action', 'http://amp.pharm.mssm.edu/Enrichr/enrich');
    if (popup) {
        form.setAttribute('target', '_blank');
    }
    form.setAttribute('enctype', 'multipart/form-data');

    listField.setAttribute('type', 'hidden');
    listField.setAttribute('name', 'list');
    listField.setAttribute('value', options.list);
    form.appendChild(listField);

    descField.setAttribute('type', 'hidden');
    descField.setAttribute('name', 'description');
    descField.setAttribute('value', description);
    form.appendChild(descField);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
*/

function show_enrichr() {
	show_message("enrichr_submit_button", "Fetching Enrichr..."); // was: "Fetching Enrichr "+gene_set_library+" enrichment ....");
	
    var dependency_search = global_selected_gene+", "+histotype_display(global_selected_histotype)+", "+study_info(global_selected_study)[ishortname]+'.';
    var gene_list_and_count = get_id_list_for_depenedencies("\n", 'gene');
	if (gene_list_and_count[1]==0) {
		alert("Sorry: No gene names found in this dependency table to submit to Enrichr")
		return false; // to cancel form submission
	    }		
	var description = "For "+gene_list_and_count[1] +" genes from CGDD dependency search: "+dependency_search;  
    document.getElementById("enrichr_list").value = gene_list_and_count[0];
	document.getElementById("enrichr_description").value = description;
    return true; // to submit the form, otherwise false;
    }

/*
function fetch_enrichr_data(display_callback_function) {
	// This is using the JSON API, via the pythonanywhere server: 
	// Not used now, as just going directly to interactive view
    var gene_set_library='KEGG_2016';
	show_message("enrichr_submit_button", "Fetching Enrichr..."); // was: "Fetching Enrichr "+gene_set_library+" enrichment ....");
	
	var gene_list_and_count = get_id_list_for_depenedencies(';', 'gene');

    var gene_list = gene_list_and_count[0];
    var gene_count = gene_list_and_count[1];
		
	//var protein_list = dict_to_string(protein_dict,';');
	console.log("Enrichr send: Gene count:",gene_count, "Gene list:",gene_list);	
	var url = global_url_for_enrichr.replace('mylibrary', gene_set_library).replace('mygenes', gene_list);  // Using semi-colon instead of return character '%0D'
	
	console.log("url.length:", url.length);
    console.log("url:", url);
    $.ajax({
      url: url,
      dataType: 'json',
      })
      .done(function(data, textStatus, jqXHR) {  // or use .always(function ...	  
	     console.log("Received:", data);
	  	 // display_callback_function(protein_list, protein_count);		
		 alert(data);
		 })
	  .fail(function(jqXHR, textStatus, errorThrown) {
		 alert("Ajax Failed: '"+textStatus+"'  '"+errorThrown+"'");  // Just display the original list below anyway.
         });
		 
//	  .always(function() {
//	     // var protein_count = (protein_list == '') ? 0 : count_char(protein_list,';')+1;
//		 protein_list = protein_list.split(';');
//		 protein_count = protein_list.length;
//		 protein_list = protein_list.join('%0D');  // as javascript's replace(';', '%0D') only replaces the first instance.
//		 console.log("Count after removing unconnected proteins:",protein_count, "Protein list:",protein_list);
//	     });
		 
	return false; // or maybe return true?
}
*/




function set_string_form_identifiers() {
	show_message("string_interactive_submit_button", "Fetching String-DB...");

	var protein_list_and_count = get_id_list_for_depenedencies("\n", 'protein');
	console.log("protein_list_and_count",protein_list_and_count);	
    var protein_list = protein_list_and_count[0];
    var protein_count = protein_list_and_count[1];

	
	// protein_count = protein_dict.keys().length; // but not working in IE pre v 9 browser
	// var protein_list = dict_to_string(protein_dict, "\n");  // The form submit should do the coding of newlines into '%0D'
	
	console.log("Original protein count:",protein_count, "Protein list:",protein_list);

	if (protein_count == 0) {alert("No rows to display that have ensembl protein ids"); return false;}
	var field_id = (protein_count == 1) ? 'string_protein_identifier' : 'string_protein_identifiers';
	
    document.getElementById(field_id).value = protein_list; // or $('#'+field_id).val(protein_list);
//	window.open(string_url);  // should open a new tab in browser.
    // alert(document.getElementById(field_id).value);   // Note: onclick events are not triggered when submitting by other means than pressing the button itself.
    return true; // To allow opening the form.   
    // called by the string_interactive_form
    }


function show_stringdb_interactive() {
	// ** This function is NOT used ***
	
	// NOW keeping the unconnected proteins in the interactive image as interactive alows users to do enrichment so means more if keep all proteins. 
    //	
	show_message("result_progress_div", "<b><font color='red'>Fetching String-DB protein list and image....</font></b>");
	var protein_list_and_count = get_id_list_for_depenedencies('%0D', 'protein');
	console.log("protein_list_and_count",protein_list_and_count);	
    var protein_list = protein_list_and_count[0];
    var protein_count = protein_list_and_count[1];
	// protein_count = protein_dict.keys().length; // but not working in IE pre v 9 browser
	
	console.log("Original protein count:",protein_count, "Protein list:",protein_list);

	if (protein_count == 0) {alert("No rows to display that have ensembl protein ids"); return false;}
	var string_url = (protein_count == 1) ? global_url_for_stringdb_interactive_one_network : global_url_for_stringdb_interactive_networkList;
    string_url += protein_list;
	window.open(string_url);  // should open a new tab in browser.
	return false; // or maybe return true?
//	can run this command in the browser console to experiment)
}


function show_stringdb(display_callback_function) {
	// This to calls server to remove unconnected proteins from the list before displaying the string network image.
	
	show_message("string_image", "Fetching String-DB...", 8000); // show this for 10 seconds as can be slow for images with many proteins

	var protein_list_and_count = get_id_list_for_depenedencies(';', 'protein');
	console.log("protein_list_and_count",protein_list_and_count);	
    var protein_list = protein_list_and_count[0];
    var protein_count = protein_list_and_count[1];
	
	//var url = global_url_for_stringdb_interactionsList + dict_to_string(protein_dict,'%0D'); // Need a function to do this? eg. jQuery.makeArray() or in EM 5.1: Object.keys(protein_dict);
	
	console.log("Original protein count:",protein_count, "Protein list:",protein_list);
	var url = global_url_for_stringdb_interactionsList.replace('myproteins', protein_list);  // Using semi-colon instead of return character '%0D'

	// Because of AJAX same origin policy (ie. no cross-site requests) so need to use pythonanywhere server as a proxy to get the string interaction list.
	
	console.log("url.length:", url.length);
    console.log("url:", url);	
    $.ajax({
      url: url,
      dataType: 'text',  // 'csv', // really is tab deliminated
      })
      .done(function(protein_list2, textStatus, jqXHR) {  // or use .always(function ...	  
	    //console.log("Received:", protein_list2);
		protein_list = protein_list2;
		// I had tried retrieving interactionsList directly from String-DB.org, but it would need to support either JSNOP or CORS in its replies: http://stackoverflow.com/questions/15477527/cross-domain-ajax-request
		// http://hayageek.com/cross-domain-ajax-request-jquery/
		
		// This parsing is done on pythonanywhere server now:
	    //var protein_dict2 = {};
	    //lines = data.split("\n"); ** There will be an empty line as newline at end - unless change the python code to use join? 
		//for (var i=0; i < lines.length; i++) {
		//	console.log(lines[i]);
		//	cols = lines[i].split("\t");
		//	console.log(cols);
		//	if (!(cols[0] in protein_dict)) {alert('Protein returned "'+cols[0]+'" was not in the original list');} // <-- This test can be removed in future.
		//	if (!(cols[1] in protein_dict)) {alert('Protein returned "'+cols[1]+'" was not in the original list');} // <-- This test can be removed in future.
		//	protein_dict2[cols[0]] = true;
		//	protein_dict2[cols[1]] = true;
		//	protein_dict = protein_dict2; // list will now have any unconnected proteins removed.
		//    }
		// Parse the result which is tab-deliminated in the format:	
		 // string:9606.ENSP00000302530	string:9606.ENSP00000300093	BUB1	PLK1	-	-	-	-	-	taxid:9606	taxid:9606	-	-	-	score:0.998|ascore:0.183|escore:0.722|dscore:0.9|tscore:0.933	
        
		 })
	  .fail(function(jqXHR, textStatus, errorThrown) {
		 alert("Ajax Failed: '"+textStatus+"'  '"+errorThrown+"'");  // Just display the original list below anyway.
         })
	  .always(function() {
	     // var protein_count = (protein_list == '') ? 0 : count_char(protein_list,';')+1;
		 if (protein_list=='') {
		     protein_count = 0
			 alert('StringDB reports zero interactions of confidence>700 between these selected proteins. Click the "StringDB interactive" button to see this.')
		 }
		 else {	 
		    protein_list = protein_list.split(';');
		    protein_count = protein_list.length;
		    protein_list = protein_list.join('%0D');  // as javascript's replace(';', '%0D') only replaces the first instance.
	  	    display_callback_function(protein_list, protein_count);
		 }
		 console.log("Count after removing unconnected proteins: "+protein_count+", Protein list: '"+ protein_list+"'" );
	     });
	
    return false; // Return false to the caller so won't move on the page as is called from a href="...		 
 }
	

	
//				protein_count ++;
//		        if (list_of_proteins=='') {list_of_proteins += protein_id;}
//		        else {list_of_proteins += '%0D'+protein_id;} // The return character is the separator between names.
				

//	return [protein_count,list_of_proteins];
//}
//	return false; 
/*
// or jquery, but the above plane javascript is probably faster.
	console.log("\nUsing jQuery:");
//	 Or with jquery, something like:
  $('#result_table tbody tr:visible').each(function(index){
    if (index>0) {console.log(index,$(this).find('td:first').attr("epid"));} // or .text() for text content, not the full html()
  });
  
*/
  // Ajax request to retreive the ensembl protein ids from django server:
  // get_ensembl_protein_ids()
	
/*
// Using jquery:
//	$('#result_table tbody tr:visible');
  $('#mytab1 tr').each(function(){
    $(this).find('td').each(function(){
        //do your stuff, you can use $(this) to get current cell
    })
  });
	
	
	var table = document.getElementById("mytab1");
for (var i = 0, row; row = table.rows[i]; i++) {
   //iterate through rows
   //rows would be accessed using the "row" variable assigned in the for loop
   for (var j = 0, col; col = row.cells[j]; j++) {
     //iterate through columns
     //columns would be accessed using the "col" variable assigned in the for loop
   }  
}

OR jQuery: 


	$('#fixed-columns-table tbody tr').each(function(){
    console.log($(this).cells[0])
	}

	$('#mytab1 tr').each(function(){
    $(this).find('td').each(function(){
        //do your stuff, you can use $(this) to get current cell
    })
})

// Also if send the driver gene tissues as a string (one character representing each tissue), then could use string.split("") in javascript to split it into characters.
"How are you doing today?";
var res = str.split("");


On Python side, could use, eg:  http://stackoverflow.com/questions/16060899/alphabet-range-python
  eg: range(ord('a'), ord('z')+1)))
  list(map(chr, range(97, 123)))
  

===============================
http://stackoverflow.com/questions/28323237/tablesorter-jquery-how-to-get-values-after-filtering
= could use the attr =  col ?

 $('#mytable tbody tr td:nth-child(4)').each(function () {
        if ($(this).attr('td')) {
            colCount += +1;
        } else {
            colCount++;
        }
 }
*/

function toggle_show_drugs(obj,drug_names,div,gene) {
  // An alternative could be tooltip that stays when link clicked: http://billauer.co.il/blog/2013/02/jquery-tooltip-click-for-help/
  // or: http://pagenotes.com/pagenotes/tooltipTemplates.htm
  // or: Modal tooltips: http://qtip2.com/
  // or: https://www.quora.com/How-do-I-make-a-tooltip-that-stays-visible-when-hovered-over-with-JavaScript
  
// This works but column width too wide if then select Any from filter menu:
//  obj.innerHTML = obj.innerHTML.indexOf('[more]') > -1 ? make_drug_links(drug_names,div)+' [less]' : drug_names.substr(0,8)+'...[more]';

  var mycontent = '<p style="vertical-align:middle;">For gene '+gene+', the following inhibitors were found in DGIdb:<br/>&nbsp;<br/>'+make_drug_links(drug_names,div)+'</p>';
  	
  $.fancybox.open({
  //$(".fancybox").open({
    // href: url_boxplot,
    preload: 0, // Number of gallary images to preload
    //minWidth: 900,
    //mHeight: 750,
	width: 300,
	height: 300,
	minWidth: 250,
	maxHeight: 300,
	//width: '100%',
	//height: '100%',
	autoSize: false, // true, //false,  // true,  // false, // otherwise it resizes too tall.
    //padding: 2,  	// is space between image and fancybox, default 15
    //margin:  2, 	// is space between fancybox and viewport, default 20
	// width:  boxplot_width+legend_width+8, // default is 800
	// height: boxplot_height + 8, // default is 600 /// the title is below this again, ie. outside this, so the 25 is just to allow for the margins top and bottom 
    aspectRatio: true,
    //fitToView: true,
	autoCenter: true,
    arrows: false,
	closeEffect : 'none',
    helpers: {
        title: {
            type: 'inside'
        },
        overlay: {
            showEarly: true  // false  // Show as otherwise incorrectly sized box displays before images have arrived.
        }
    },

    // href="{#% static 'gendep/boxplots/' %#}{{ dependency.boxplot_filename }}" 
    // or $(...).content - Overrides content to be displayed - maybe for inline content
	type: 'inline', // 'html', // 'iframe', // 'html',
    //content:
    // href: href,	
	content: mycontent,
    // title: box_title  //,
   });
  }


//function hide_drugs() {
//  this.innerHTML='';
//}

//onclick="show_drugs(this);"
//onclick="hide_drugs(this);"


function make_drug_links(drug_names,div) {
  // DBIdb paper: http://nar.oxfordjournals.org/content/44/D1/D1036.full
  var drugs = drug_names.split(div); // 'div' is comma or semi-colon
  var links ='';
  for (var i=0; i<drugs.length; i++) {
	if (i>0) {links += ', ';}
    links += '<a href="http://dgidb.genome.wustl.edu/drugs/'+drugs[i]+'" target="_blank">'+drugs[i]+'</a>';  
  }
  return links;
}

function stringdb_interactive(protein_list, protein_count) {
	//var protein_list = get_id_list_for_depenedencies(); // returns (list_of_proteins, protein_count)
	if (protein_count == 0) {alert("No rows to display that have ensembl protein ids"); return false;}
	var string_url = (protein_count == 1) ? global_url_for_stringdb_interactive_one_network : global_url_for_stringdb_interactive_networkList;
    string_url += protein_list
	window.open(string_url);  // should open a new tab in browser.
	return false; // or maybe return true?
//	can run this command in the browser console to experiment)		
}

/*
  api
  
  json	JSON format either as a list of hashes/dictionaries, or as a plain list (if there is only one value to be returned per record)
tsv	Tab separated values, with a header line
tsv-no-header	Tab separated values, without header line
psi-mi	The interaction network in PSI-MI 2.5 XML format
psi-mi-tab	Tab-delimited form of PSI-MI (similar to tsv, modeled after the IntAct specification. (Easier to parse, but contains less information than the XML format.)


  interactionsList	Interaction network as above, but for a list of identifiers
  
	identifiers
	limit	Maximum number of nodes to return, e.g 10.
required_score	Threshold of significance to include a interaction, a number between 0 and 1000
additional_network_nodes	Number of additional nodes in network (ordered by score), e.g./ 10
network_flavor
*/


function stringdb_image(protein_list,protein_count) {
    // An alternativbe to string-db is to use the stringdb links to build own cyctoscape display: http://thebiogrid.org/113894/summary/homo-sapiens/arid1a.html
	//var protein_list = get_id_list_for_depenedencies(); // returns (protein_list, protein_count)
  if (protein_count == 0) {alert("No rows that have ensembl protein ids"); return false;}
  var string_url = (protein_count == 1) ? global_url_for_stringdb_one_network : global_url_for_stringdb_networkList;
  string_url += protein_list;
	
//	window.open(string_url);  // should open a new tab in browser.
//	return false; // or maybe return true?
//	can run this command in the browser console to experiment)	

//function show_stringdb_image_in_fancybox() {
//}
//==============================================================================	
// + '" width="'+boxplot_width+'" height"'+boxplot_height

  // was: height="100%"  but that made small images too big
  var mycontent = '<center><img src="' + string_url +'" alt="Loading StringDB image...."/></center>';
  //var mycontent = string_url
  var href = string_url;
    
//  var box_title = '<p align="center" style="margin-top: 0;"><b>'+driver+'</b> altered cell lines have an increased dependency upon <b>'+target+'</b><br/>(p='+wilcox_p.replace('e', ' x 10<sup>')+'</sup> | effect size='+effect_size+'% | Tissues='+ histotype_display(histotype) +' | Source='+ study[0] +')';

  var box_title = '<p align="center" style="margin-top: 0;">Showing high confidence (score&ge;700) string-db interactions between the dependencies associated with driver gene <b>'+global_selected_gene+'</b><br/><a href="javascript:void(0);" title="String-db interactive view" onclick="$(\'#string_interactive_submit_button\').click();">Click here to go to interactive String-db view</a></p>';
  //  or: document.getElementById("string_interactive_submit_button").click();
  $.fancybox.open({
  //$(".fancybox").open({
    // href: url_boxplot,
    preload: 0, // Number of gallary images to preload
    minWidth: 900,
    //mHeight: 750,
	width: '100%',
	height: '100%',
	autoSize: false, // true, //false,  // true,  // false, // otherwise it resizes too tall.
    padding: 2,  	// is space between image and fancybox, default 15
    margin:  2, 	// is space between fancybox and viewport, default 20
	// width:  boxplot_width+legend_width+8, // default is 800
	// height: boxplot_height + 8, // default is 600 /// the title is below this again, ie. outside this, so the 25 is just to allow for the margins top and bottom 
    aspectRatio: true,
    fitToView: true,
	autoCenter: true,
    arrows: false,
	closeEffect : 'none',
    helpers: {
        title: {
            type: 'inside'
        },
        overlay: {
            showEarly: false   // false  // or true, as otherwise incorrectly sized box displays before images have arrived.
        }
    },

    // href="{#% static 'gendep/boxplots/' %#}{{ dependency.boxplot_filename }}" 
    // or $(...).content - Overrides content to be displayed - maybe for inline content
	type: 'image', // type image should centre the small stringdb network images // 'inline', // 'html', // 'iframe', // 'html', //'inline',
    //content:
    href: href,	
	//content: mycontent,
    title: box_title  //,
   });
   
   return false; // Return false to the caller so won't move on the page
}
  




function populate_table(data,t0) {
  var html = '';
	// The position of the P-value column needs to correspond with the index.htm javascript for "filter-select:"
	
	// PLOT THE BOXPLOT AND LEGEND SEPARATELY - LEGEND MIGHT BE SPECIFIC TO THE STUDY - ie. Achilles has more tissues, and doesn't have some tissues - so "Legend_PMID.....png" #}

	/*
	// By lines
    var lines = this.result.split('\n');
    for(var line = 0; line < lines.length; line++){
        // By tabs
        var tabs = lines[line].split('\\t');
        for(var tab = 0; tab < tabs.length; tab++){    
                alert(tabs[tab]);
        }   
    }
  };
  */
	//str.split(',') // or use '\t' as using comma assumes that no fields contain a comma - checked before data was added to the database.
	// if need to parse CSV that has quoted strings containing commas, then use: https://github.com/evanplaice/jquery-csv/
	var qi = data['query_info'];
	var search_by = qi['search_by'];
	
    var driver,target, search_by_driver;
	switch(search_by) {
		case 'driver':
	       $("#dependency_col_name").html('Dependency');
		   search_by_driver = true;
		   driver = qi['gene_name'];
		   break;
		case 'target':
	       $("#dependency_col_name").html('Driver');
		   search_by_driver = false;
		   target = qi['gene_name'];
		   break;
		default: alert("Invalid search_by: "+search_by);
	}

	// Variables for links to string.org:
    var search_gene_string_protein = '9606.'+global_selected_gene_info['ensembl_protein_id'];
	
	// additional_network_nodes = 0 ?????
	
	// Alternative (?default) is 'evidence'.
		
	// API options:
	// identifiers - required parameter for multiple items, e.g.DRD1_HUMAN%0DDRD2_HUMAN
	// network - The network image for the query item
    // networkList - The network image for the query items
    // limit - Maximum number of nodes to return, e.g 10.
    // required_score - Threshold of significance to include a interaction, a number between 0 and 1000
    // additional_network_nodes - Number of additional nodes in network (ordered by score), e.g./ 10
    // network_flavor - The style of edges in the network. evidence for colored multilines. confidence for singled lines where hue correspond to confidence score. (actions for stitch only)
	
	// var string_url_all_interactions = global_url_for_stringdb_networkList;  // For a call for all interactions in this table. Doesn't need the above search_gene_string_protein.
	
	var interaction_count = 0;
	
	results = data['results']
	//console.log(results);

	// result array indexes:
	// igene can be either driver or target depending on 'search_by'.
	var igene=0, iwilcox_p=1, ieffect_size=2, izdelta=3, ihistotype=4, istudy_pmid=5, iinteraction=6, iinhibitors=7; // itarget_variant=8; (removed target_variant - was only for Achilles variant boxplot image)
	// In javascript array indexes are represented internally as strings, so maybe using string indexes is a bit faster??
/*	
============================
	$(".fancybox").fancybox({
    loop : false,
    afterLoad: function(current, previous) {
        console.info( 'Current: ' + current.href );        
        console.info( 'Previous: ' + (previous ? previous.href : '-') );
        
        if (previous) {
            console.info( 'Navigating: ' + (current.index > previous.index ? 'right' : 'left') );     
        }
    }
});

tpl	Object containing various templates	
Object; Default value:
{
	wrap     : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
	image    : '<img class="fancybox-image" src="{href}" alt="" />',
	iframe   : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0"' + ($.browser.msie ? ' allowtransparency="true"' : '') + '></iframe>',
	error    : '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
	closeBtn : '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
	next     : '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
	prev     : '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
}

*/

/*	// Get the current a link colour (by creating an element with this class and append it to the DOM)
// Not working for 'a' links due to privacy - so wouldn't know which sites are visited.
// So just set it in css class instead.
    var eleToGetColor = $('<a style="display: none;">').appendTo('body');
	console.log(eleToGetColor);
    //get the color of the element
    var a_color = eleToGetColor.css('color');	
    alert(a_color);
    var alink_color = eleToGetColor.css('link:color');
    alert(alink_color);
	//var elem = document.getElementById("test");
	if (window.getComputedStyle) {  /// from: http://javascript.info/tutorial/styles-and-classes-getcomputedstyle
	   var alink_color = getComputedStyle(eleToGetColor, 'link').getPropertyValue("color"); // only works in IE9+
	} else {
      alink_color = eleToGetColor.currentStyle.color; // in IE only.
    }   
    alert(alink_color);
    eleToGetColor.remove(); //remove the element from the DOM
*/	
	// :visited is no longer detectable by getComputedStyle.

/*	
  var a = document.createElement('a');
  // a.href = a.textContent = url;
  document.body.appendChild(a);
  alert(document.defaultView.getComputedStyle(a, null).color);
  document.body.removeChild(a);
  // document.getElementById("myBtn").hasAttribute("onclick");
  
//getLinkColor('http://stackoverflow.com/questions/5394099/detect-visited-link-in-chrome');
//getLinkColor('http://stackoverflow.com/some-fake-path');
*/
	
var stopat=20;	// To stop table early for testing.

// In Chrome the total width of all the <th> elements is 985px, so make these add up -->
var width100=""; // "width:100px; ";
var width125=""; // "width:125px; ";
var width150=""; // "width:150px; ";

	for (var i=0; i<results.length; i++) {   // for dependency in dependency_list	  
//if (i>stopat) {break;}
      d = results[i]; // d is just a reference to the array, not a copy of it, so should be more efficient and tidier than repeatidly using results[i]

	  var id="dtd"+(i+1).toString(); // id for the dependency table first cell in each row
	  
	  var study = study_info(d[istudy_pmid]); // name,type,summary,details for 'study_pmid'
	  // perhaps 'map ......join' might be more efficient?
	  var comma = "', '";  // ie. is:  ', '
	  // An alternative to building the html as a string, is to directly modify the table using javascript.
	  // Pass the unformatted effect size, as the html tags could mess up as embedded inside tags.
	  // alternatively could pass 'this', then use next() to find subsequent columns in the row, or keep the data array globally then just specify the row number as the parameter here, eg: plot(1) for row one in the array.
      if (search_by_driver) {target = d[igene];}
      else {driver = d[igene];}
		
	  // The "this"	parameter correctly doesn't have quotes:
	  var plot_function = "plot('"+ id +comma+ driver + comma + target +comma+ d[ihistotype] +comma+ d[istudy_pmid] +comma+ d[iwilcox_p] +comma+ d[ieffect_size] +comma+ d[izdelta] +"');"; // +comma+ d[itarget_variant] 

      // Another way to pouplatte table is using DocumentFragment in Javascript:
      //      https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-B63ED1A3
	  
	  // *** GOOD: http://desalasworks.com/article/javascript-performance-techniques/

	  var darkgreen_UCD_logo  = '#00A548';
	  var midgreen_SBI_logo   = '#92C747';
	  var lightgreen_SBI_logo = '#CDF19C'; // was actually:'#ADD17C';

	  val = parseFloat(d[iwilcox_p]); // This will be in scientific format, eg: 5E-4
      if      (val <= 0.0001) {bgcolor=darkgreen_UCD_logo}
	  else if (val <= 0.001)  {bgcolor=midgreen_SBI_logo}
	  else if (val <= 0.01)   {bgcolor=lightgreen_SBI_logo}
	  else {bgcolor = '';}
	  style = width100+"text-align:center;";
	  if (bgcolor != '') {style += ' background-color: '+bgcolor;}
	  var wilcox_p_cell = '<td style="'+style+'">' + d[iwilcox_p].replace('e', ' x 10<sup>') + '</sup></td>';
	  
	  var val = parseFloat(d[ieffect_size]); // convert to float value
      if      (val >= 90) {bgcolor=darkgreen_UCD_logo}
	  else if (val >= 80) {bgcolor=midgreen_SBI_logo}
	  else if (val >= 70) {bgcolor=lightgreen_SBI_logo}
	  else {bgcolor = '';}
	  var style = width100+"text-align:center;";
	  if (bgcolor != '') {style += ' background-color: '+bgcolor;}
	  var effectsize_cell = '<td style="'+style+'">' + d[ieffect_size] + '</td>';

	  var val = parseFloat(d[izdelta]); // convert to float value
      if      (val <= -2.0) {bgcolor=darkgreen_UCD_logo}
	  else if (val <= -1.5) {bgcolor=midgreen_SBI_logo}
	  else if (val <= -1.0) {bgcolor=lightgreen_SBI_logo}
	  else {bgcolor = '';}
	  var style = width100+"text-align:center;";
	  if (bgcolor != '') {style += ' background-color: '+bgcolor;}
	  var zdelta_cell = '<td style="'+style+'">' + d[izdelta] + '</td>';
	  
	  var interaction_cell;
	  var style = width100+"text-align: center;";
	  if (d[iinteraction] == '') {interaction_cell = '<td style="'+style+'"></td>';}
	  else {
		// alert("interaction='"+d[iinteraction]+"'")
	    var interaction = d[iinteraction].split('#'); // as contains, eg: High#ENSP00000269571 (ie protein id)
	    switch (interaction[0]) { // This will be in scientific format, eg: 5E-4
          case 'Highest': bgcolor=darkgreen_UCD_logo;  break;
	      case 'High':    bgcolor=midgreen_SBI_logo;   break;
	      case 'Medium':  bgcolor=lightgreen_SBI_logo; break;
	      default: bgcolor = '';
        }
	    if (bgcolor != '') {style += ' background-color: '+bgcolor;}

		var string_protein = '';
		if (interaction[1] == '') {
		  interaction_cell = '<td style="'+style+'">'+interaction[0]+'</td>';
		} else {
		  string_protein = '9606.'+interaction[1];
		  
		  // if (interaction_count > 0) {string_url_all_interactions += '%0D'} // The return character is the separator
		  // string_url_all_interactions += string_protein; // The link for all interactions in table.
          interaction_count ++;
		  
		  // BUT this is just the target identifier now:
		  var string_url = global_url_for_stringdb_interactive_networkList_score400 + search_gene_string_protein + "%0D" + string_protein;
		  // Colm wants driver + target as they interact as (Med/High/Highest) link means these interact with score >=400. 
		  
	      // var string_function = "string('" + driver + comma + target + "');";
	      // interaction_cell = '<td'+bgcolor+'><a href="javascript:void(0);" onclick="'+string_function+'">'+interaction[0]+'</a></td>';
		  interaction_cell = '<td style="'+style+'"><a href="'+ string_url +'" target="_blank">'+interaction[0]+'</a></td>';
		}
	  }

	  var style = width150+"text-align: center;";	  
	  var inhibitor_cell;
	  if (d[iinhibitors] == '') {inhibitor_cell='<td style="'+style+'"></td>';}
	  else {
		  var onclick_or_alink = '';
		  if (d[iinhibitors].length <= 12) {
			  // create individual <a...> links for each drug
			  onclick_or_alink = make_drug_links(d[iinhibitors],', ');			  
			  }
		  else {		  
		    cell_text = d[iinhibitors].substr(0,7)+'..<span style="font-size:80%">[more]</span>';
			// create a onclick to open fancybox:
            var onclick_function = "toggle_show_drugs(this,'"+d[iinhibitors]+"', ', ', '"+d[igene]+"');";
			onclick_or_alink = '<a href="javascript:void(0);" onclick="'+onclick_function+'">'+cell_text+'</a>';
		  }
		  // removed the attribute: drug="'+d[iinhibitors]+'"
          // WAS: inhibitor_cell = '<td style="background-color: beige;"'+onclick+'>'+drug_links+'</td>';
		  //make_drug_links(drug_names,', ')	// div is comma+space or semi-colon
		  inhibitor_cell = '<td style="'+style+' background-color: beige;">'+onclick_or_alink+'</td>';
	  }

	  //	  var interaction_cell = (d[iinteraction] === 'Y') ? '<td style="background-color:'+darkgreen_UCD_logo+'">Yes</td>' : '<td></td>';
	  html += '<tr>'

	  // + '<td id="'+id+'" style="'+width125+'text-align: left; display:block;" data-gene="'+d[igene]+'" data-epid="'+string_protein+'"><a href="javascript:void(0);" onclick="'+plot_function+'">' + d[igene] + '</a></td>' // was class="tipright" 
	  
	  // http://stackoverflow.com/questions/10070232/how-to-make-a-cell-of-table-hyperlink
	  // <td><a href="..." style="display:block;">&nbsp;</a></td>

	  // can just use the td's onclick - unless popup blocker would block this?
	  + '<td id="'+id+'" style="'+width125+'text-align:left; cursor:pointer;" data-gene="'+d[igene]+'" data-epid="'+string_protein+'" onclick="'+plot_function+'">' + d[igene] + '</td>' // was class="tipright" 

        //+ '<td id="'+id+'" style="width:100px" data-gene="'+d[igene]+'" data-epid="'+string_protein+'">AB</td>' // was class="tipright"
		
		// In future could use the td class - but need to add on hoover colours, etc....
		// '<td class="tipright" onclick="plot(\'' + d[0] + '\', \'' + d[4] + '\', \'' + d[3] +'\');">' + d[0] + '</td>'
        + wilcox_p_cell
		+ effectsize_cell
		+ zdelta_cell
        + '<td style="'+width100+'text-align:center;">' + histotype_display(d[ihistotype]) + '</td>'
		+ '<td style="'+width100+'text-align:center;" data-study="'+d[istudy_pmid]+'">' + study_weblink(d[istudy_pmid],study) + '</td>' // but extra text in the table, and extra on hover events so might slow things down.
		// '<td>' + study_weblink(d[istudy_pmid], study) + '</td>' + // but this is extra text in the table, and extra on hover events so might slow things down.
		// '<td>' + study[0] + '</td>' + // study_weblink
		//'<td>' + study[1] + '</td>' +  // <a href="#" class="tipleft"> ...+'<span>' + study_summary + '</span>
		//'<td><a href="#" class="tipleft">' + study[1] + '<span>' + study[2] + '</span></td>' +
		+ '<td style="'+width100+'text-align:center;" data-exptype="'+d[istudy_pmid]+'">' + study[iexptype] + '</td>' // experiment type. The 'data-exptype=""' is use by tooltips
		
        + interaction_cell  // '<td>' + d[iinteraction] + '</td>' +  // 'interaction'
		
	    + inhibitor_cell  //'<td>' + d[iinhibitors] + '</td>' +  // 'inhibitors'
		
		+ '</tr>';  // The newline cahracter was removed from end of each row, as the direct trigger update method complains about undefined value.
/*
	  html += '<tr>'+
		'<td>A</td>' +
		'<td>B</td>' + // inlined this replace()
        '<td>C</td>' + 
		'<td>D</td>' + // study_weblink
		'<td>E</td>' +
		'<td>F</td>' +
		'<td>G</td>' +  // <a href="#" class="tipleft"> ...+'<span>' + study_summary + '</span>
		'<td>H</td>' +  // 'interaction'
		'</tr>';
*/		
	  // To minimise the size of the transfer from webserver, used single characters for these dependency fields:
	  //  t=target, p=wilcox_p, e=effect_size, s=study, h=histotype, i=inhibitors, a=interaction
	  /*
      html += '<tr>'+
        '<td><a class="tipright" href="plot(\"' + d['t'] + '\");">' + d['t'] + '</a></td>' +
		'<td>' + d['p'].replace('e', ' x 10<sup>')+'</sup></td>' + // inlined this replace()
        '<td>' + d['e'] + '</td>' + 
		'<td>' + study[0] + '</td>' + // study_weblink
        '<td>' + histotype_display(d['h']) + '</td>' +
		'<td>' + d['i'] + '</td>' +
		'<td>' + study[1] + '</td>' +  // <a href="#" class="tipleft"> ...+'<span>' + study_summary + '</span>
		'<td>' + d['a'] + '</td>' +  // 'interaction'
		'</tr>\n';
		*/
	}

	// var limit = Math.max(interaction_count,100).toString();  // Limit of 100 or num interactions if greater.
    // $("#string_link").attr("href", string_url_all_interactions);  //  + '&limit='+limit // now done by a function for all visible rows.
    // $("#string_link").html('Interactions with '+interaction_count.toString());
	
    //	var t1 = performance.now();
    // console.log("String Loop took " + (t1 - t0) + " milliseconds.")
	
	// console.log(html);
    //$("#result_table_tbody").replaceWith(html);
	console.log("Data formatted as html: ",performance.now()-t0); t0 = performance.now();
	
	// $("#result_table_tbody").html(html);
	$("#result_table_tbody").html(html);
	console.log("Data added to table tbody: ",performance.now()-t0); t0 = performance.now();
	//setup_qtips();
	
	// or from: https://github.com/Mottie/tablesorter/blob/master/docs/example-add-rows.html
	//resort = false;
	//$rows = $(html)
	//$("#result_table_tbody").append($rows)
    //$("#result_table").trigger('addRows', [$rows, resort]);
	
	// $tbodies = $( 'table' ).
	// $("table").trigger("updateCache", [ callback, $tbodies ] );
	
    triggercallback = function( table ){
     //   alert( 'update applied' );
	 console.log("Table updated: ",performance.now()-t0); t0 = performance.now();
    };

	
    // Moved to the index.html: $("#result_table").trigger("updateRows", [ false, triggercallback ]); // let the plugin know that we made a update, updates the updates the cache from the tbody.  Can use "updateRows" instead. ("updateRows was added to work around the issue of using jQuery with the Prototype library. Triggering an "update" would make Prototype clear the tbody")
	// or: .trigger( 'addRows', [ $row, resort, callback ] );
	
	// triggered event method:
    //$table.trigger( 'addRows', [ html, true ] );

    // direct method:
	//var $table = $( "#result_table" );
    //var config = $table[ 0 ].config;
	//alert(html);
    //$.tablesorter.addRows( config, html, true );  // So instead of making a jQuery object, appending it to the table, then passing the reference to the method, you can just pass a string. This method doesn't work if a table has multiple tbodies, because the plugin doesn't know where you want to add the rows.
	
	
	
//	Maybe need to reset the scroller height to make the added rows visible?
//	Also see the addRows() functions: https://mottie.github.io/tablesorter/docs/#methods
	
//	Use config.totalRows to see the number of rows.	
//	var $table = $( 'table' ),
//    config = $table[ 0 ].config;

	return t0;
}



function sup10_format(num) {
  // Could also replace pythons leading zero in the exponent, but already replaced on server in the views.py script, eg: if (num.indexOf("E-0")>=0) {return num.replace("E-0", " x 10<sup>-")+"</sup>";}
  return num.replace("E", " x 10<sup>")+"</sup>"; 
}

function format_gene_info_for_tooltip(data) {
  var synonyms = data['synonyms'];
  if (synonyms != '') {synonyms = ' | '+synonyms}
  return '<b>'+data['gene_name'] + '</b>' + synonyms +'<br/><i>' + data['full_name']+'</i>';
  // Removed the entrez text from these tooltips as too large and distracting. Put into the boxplot instead.
  // +'<p style="font-size: 85%;">'+data['ncbi_summary']+'</p>';
  }

function is_form_complete() {
  // As the autocomplete form permits text that doesn't match any driver:
  var search_by = document.getElementById("search_by").value;
  var g = document.getElementById("gene").value;
  if (g == null || g == "") {
    alert("Search '"+search_by+" gene name' field needs a value entered");
    return false;
    }
  
  var found = false;
  //alert("search_by='"+search_by+"' gene='"+g+"'");
  if (search_by === 'driver') {
    for (var i=0; i<driver_array.length; i++) {
      if (g == driver_array[i]['value']) {
        found = true;
        break;
      }
    }
  }
  else if (search_by === 'target') {
      for (var i=0; i<target_array.length; i++) {
      if (g == target_array[i]['value']) {
        found = true;
        break;
      }
    }
  }
  else {alert('Invalid search_by '+search_by)}
  
  if (found == false) {alert("The "+search_by+" gene value: '"+g+"' doesn't match any "+search_by+" in the list. Please select a "+search_by+" gene.");}
  return found;
  }




function next_dependency(this_td) {
  if (this_td.tagName != "TD") {alert("next_dependency this_td, expected TD, but got "+this_td.tagName)}
  var row=this_td.parentNode;
  if (row.tagName != "TR") {alert("next_dependency this row, expected TR, but got "+row.tagName)}  
  for (row = row.nextSibling; row!=null; row = row.nextSibling) {   // go to the next row
    if ($(row).hasClass("remove-me") || $(row).hasClass("filtered") || (row.nodeType!=1)) {continue;} // to skip hidden or special rows (such as the hidden row at top of scroller table)
	// Node.ELEMENT_NODE	1	An Element node such as <p> or <div>.
	if (row.tagName != "TR") {alert("next_dependency row, expected TR, but got "+row.tagName)}
  // console.log("next:",row,row.firstChild);
	return row.firstChild; // should be the first td in this tr
    }  
  return null;
  
  // Alternatively could use jquery for this:

  //console.log($(this_td).closest('tr')); // .attr('id')
  //console.log(this_td.parentNode); // .attr('id')
  
  //or $(this_td).closest("tr").prev().find("a[id*=DLTue]")
  
// $curRow.prev('tr'); Should get you the previous row
  
// var row = $(this).closest('tr');
// var idInput = row.find(':input');
// var nextInput = idInput.closest('td').next('td').find(':input');  
    
  // The difference between this property and previousElementSibling, is that previousSibling returns the previous sibling node as an element node, a text node or a comment node, while previousElementSibling returns the previous sibling node as an element node (ignores text and comment nodes).
  // "previousElementSibling" is not supported before IE9, whereas previousSibling is.:
  //console.log("prev:",this_td.parentNode.previousElementSibling); // or: $( row ).prev()[0]; [0] is used to "unwrap the jQuery object", to get the DOM reference to that row. If you want to perform jQuery methods on that row, you can just leave it inside, like $( row ).prev().addClass( '...' ); and in that case you don't need a new variable.)
  //console.log("next:",this_td.parentNode.nextElementSibling);

  //console.log("childNodes:",this_td.childNodes);
  // http://stackoverflow.com/questions/12820724/javascript-this-reference-for-onclick-event-not-working	
  
  //console.log("firstChild:",this_td.firstChild);
  
  //$('#result_table tbody tr:visible').each(function(index) {
  //	if ($(this).hasClass("remove-me")) {
  // if don't want jquery, then use: if (!el.className) {
  //	if (!el.className) {return false}
  // else {return (' '+el.className+' ').indexOf(' '+clsName+' ') !== -1;}
  }
  
function previous_dependency(this_td) {
  if (this_td.tagName != "TD") {
	  alert("previous_dependency this_td, expected TD, but got "+this_td.tagName);
	  // console.log("previous_dependency this_td, expected TD, but got ",this_td)
	  }
  var row=this_td.parentNode; // or use: $( "li.third-item" ).prev()
  if (row.tagName != "TR") {
	  alert("previous_dependency this row, expected TR, but got "+row.tagName);
      //console.log("previous_dependency this row, expected TR, but got:",row);
      } 
  for (row=row.previousSibling; row!=null; row=row.previousSibling) {    
    if ($(row).hasClass("remove-me") || $(row).hasClass("filtered") || (row.nodeType!=1)) {continue;}
	if (row.tagName != "TR") {
		alert("previous_dependency, expected TR, but got "+row.tagName);
	    //console.log("previous_dependency, expected TR, but got",row);
	    }
    //console.log("previous:",row,row.firstChild);
	return row.firstChild; // the td
    }
  return null;
  }


function plot(dependency_td_id, driver, target, histotype, study_pmid, wilcox_p, effect_size, zdelta_score, target_variant) { // The index number of the dependency in the array
//console.log(target);
//  var target_info;
//  if (target in gene_info_cache) {
//	target_info = gene_info_cache[target];
//function plot(index) { // The index number of the dependency in the array

// onclick="show_svg_boxplot('ERBB2','DGKG', 'PANCAN','26947069');"


  show_svg_boxplot_in_fancybox(dependency_td_id, driver, target, histotype, study_pmid, wilcox_p, effect_size, zdelta_score, target_variant); // the 'target_info' (including 'ncbi_summary') is now retrieved with the boxplot_data.
//console.log("In plot():",dependency_td_id, driver, target, histotype, study_pmid, wilcox_p, effect_size, zdelta_score, target_variant)	
	// Previously for PNG images:  show_png_boxplot_in_fancybox(driver, target, histotype, study_pmid, wilcox_p, effect_size, zdelta_score, target_info, target_variant);	
/*
	}
  else {
	// The target_info will usually have already been retreived by hoovering over the target in table, but if user clicked fast, then might not have been retreived yet.
	// Might be better to get the ids after the fancybox has displayed - ie. on fancybox's loaded .... method.
    $.ajax({
      url: global_url_gene_info_for_mygene.replace('mygene',target),
      dataType: 'json',
      })
      .done(function(target_info, textStatus, jqXHR) {  // or use .always(function ...
         if (target_info['success']) {
			gene_info_cache[target] = target_info; // cache data so can retrieve faster in future.
		 }
		 else {console.log("Error: "+target_info['message'])}
		 })
	  .fail(function(jqXHR, textStatus, errorThrown) {
		 console.log("Ajax Failed: '"+textStatus+"'  '"+errorThrown+"'");
		 // target_info = undefined;
         })
	  .always(function() {
		  		 
	  	 show_svg_boxplot_in_fancybox(driver, target, histotype, study_pmid, wilcox_p, effect_size, zdelta_score, target_info, target_variant);

	  	 // WAS: show_png_boxplot_in_fancybox(driver, target, histotype, study_pmid, wilcox_p, effect_size, zdelta_score, target_info, target_variant);		 
		 
	     });
    }
*/	
    return false; // Return false to the caller so won't move on the page as is called from a href="...
}

