document.addEventListener('DOMContentLoaded', function() {
    var sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav, {});
    
    var collapsibleElem = document.querySelector('.collapsible');
    var collapsibleInstance = M.Collapsible.init(collapsibleElem, {});

    var modal = document.querySelectorAll('.modal');
    var instances = M.Modal.init(modal, {});
});


function search_college() {
    let college = document.getElementById("search-college").value;
}