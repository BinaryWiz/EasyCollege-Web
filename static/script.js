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

    var request = new XMLHttpRequest();
    document.getElementsByClassName("spinner-container")[0].style.display = "flex";
    $("#fab").addClass("disabled");

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(request.responseText);
            document.getElementsByClassName("spinner-container")[0].style.display = "none";
            response.messages.forEach(college => {
                document.getElementById("college-options").innerHTML += 
                '<a href="#!" class="collection-item"> ' + college + '</a>';
            });

            $("#college-options-container").modal();
            $("#college-options-container").modal("open");
        }
        $("#fab").removeClass("disabled");
    };


    request.open("GET", "https://mvk5rtvch8.execute-api.us-east-1.amazonaws.com/prod/search?search=" + college, true);
    request.send();
}