import $ from 'jquery'

// Search the data using the user text input.
$(".in-page-search .search-input").keyup(function() {
    
    // Set the form id and search term (user input).
    var form_id = this.id,
    search_term = $(this).val().toLowerCase(),
    results_holder = $('#' + form_id).next('.tt-menu'),
    no_results_message = $(this).closest('form').attr('data-attr-no-results-message');

    // Set the search data 
    var search_list = courses;

    // Wait until the search term length is greater than two characters before starting the search.
    if ( search_term.length > 2 ) {

        var results = search_data( form_id, search_term, search_list );

        // Make sure the results div is empty before adding new results.
        results_holder.children('.tt-dataset').html('');

        // Show error message if no results have been found.
        if (results.length === 0) {
            results_holder.children('.tt-dataset').html('<div class=\"tt-suggestion tt-selectable\">' + no_results_message + '</div>');
        } else {
            results_holder.children('.tt-dataset').html(results);
        }
        results_holder.fadeIn();
    } else {
        results_holder.fadeOut();
    }

});

function search_data( form_id, search_term, search_list ) {

    // Set empty arrays for the left and right results columns.
    var results = [];

    // Search for stuff
    for ( var i = 0; i < search_list.length; i++ ) {

        var link, link_url, link_text;

        if ( search_list[i].name.toLowerCase().indexOf(search_term) >= 0 ) {

            // Build the link
            link_url = search_list[i].url;
            link_text = search_list[i].name;

            link = "<a class=\"tt-suggestion tt-selectable\" href='" + link_url + "'>" + link_text + "</a>";
            
            results.unshift(link);
        }
    }

    results = results.join("");

    return results;
}