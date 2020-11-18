import $ from 'jquery'

// add functionality to toggle the mobile search menu
$('.search-result-filters-button [role=button],.search-result-filters-submit-wrapper [role=button], .search-result-navigation-close a').on('click', function (event) {
    event.preventDefault();
    $('.search-result-filters').toggleClass('search-result-filters-active');
});

// In the Funnelback set up each filter's value is a url, on change we need to load the page with that url
if (!$('.not-main-search').length) {
    $('.search-result-filters input').change(function(event){
        window.location.replace($(this).val());
    });
}