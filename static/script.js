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
                var onclick_function = 'get_college_data("' + college + '")';
                
                var option = document.createElement("a");
                option.href = "#!";
                option.className = "collection-item";
                option.innerHTML = college;
                option.addEventListener('click', function() {
                    get_college_data(college)
                });

                document.getElementById("college-options").appendChild(option);


                // document.getElementById("college-options").innerHTML += 
                // '<a href="#!" onclick='+ onclick_function +' class="collection-item"> ' + college + '</a>';
            });

            $("#college-options-container").modal();
            $("#college-options-container").modal("open");
            $("#fab").removeClass("disabled");
        }
    };


    request.open("GET", "https://mvk5rtvch8.execute-api.us-east-1.amazonaws.com/prod/search?search=" + college, true);
    request.send();
}

function get_college_data(college) {            
    $("#college-options-container").modal("close");

    document.getElementsByClassName("spinner-container")[0].style.display = "flex"
    var formatted = college.toLowerCase();
    formatted = formatted.replace(/ /g, "-");

    var request = new XMLHttpRequest();

    $("#fab").addClass("disabled");

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(request.responseText);

            if (localStorage.getItem('collegeList') == null) {
                localStorage.setItem('collegeList', "" + response.message.Name + ", ")
            } else {
                var college_list = localStorage.getItem('collegeList');
                localStorage.setItem('collegeList', college_list + response.message.Name + ", ");
            }

            localStorage.setItem(response.message.Name, request.responseText);

            var card = `
            <div id="college-card" class="col s12 m3">
                <div class="card green darken-3">
                    <div class="card-content white-text">
                        <div id="grade-title">
                            <div class="grade teal accent-4">
                                <span>`+ response.message.Niche_Grade +`</span>
                            </div>

                            <span class="card-title" style="display: inline-block;">
                                `+ response.message.Name +`
                            </span>
                        </div>

                        <ul class="list-info">
                            <li> `+ response.message.Sat_Range +`</li>
                            <li> `+ response.message.Act_Range +`</li>
                            <li> `+ response.message.Acceptance_Rate +`</li>
                            <li> `+ response.message.Location +`</li>
                            <li> `+ response.message.Net_Price +`</li>
                        </ul>
                    </div>

                    <div class="card-action">
                        <a class="white-text" target="_blank" href="https://www.niche.com/colleges/`+ formatted +`">Learn More</a>
                    </div>

                </div>
            </div>
            `

            document.getElementById("cards-area").innerHTML += card;
            document.getElementsByClassName("spinner-container")[0].style.display = "none"
            $("#fab").removeClass("disabled");
        }
    }

    request.open("GET", "https://1m468rdcpi.execute-api.us-east-1.amazonaws.com/prod/search?search=" + formatted, true);
    request.send();
}
