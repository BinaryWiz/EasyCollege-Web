document.addEventListener('DOMContentLoaded', function() {
    var sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav, {});
    
    var collapsibleElem = document.querySelector('.collapsible');
    var collapsibleInstance = M.Collapsible.init(collapsibleElem, {});

    var modal = document.querySelectorAll('.modal');
    var instances = M.Modal.init(modal, {});

    var all_colleges = localStorage.getItem("collegeList");
    if (all_colleges != null) {
        all_colleges = all_colleges.split(",")
        all_colleges.forEach(college => {
            create_college_card(localStorage.getItem(college));
        });
    }
});

function search_college() {
    $("#college-options-container").find(".collection-item").remove();
    let college = document.getElementById("search-college").value;

    var request = new XMLHttpRequest();
    document.getElementsByClassName("spinner-container")[0].style.display = "flex";
    $("#fab").addClass("disabled");

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(request.responseText);
            document.getElementsByClassName("spinner-container")[0].style.display = "none";
            response.messages.forEach(college => {
                
                var option = document.createElement("a");
                option.href = "#!";
                option.className = "collection-item";
                option.innerHTML = college;
                option.addEventListener('click', function() {
                    get_college_data(college);
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
            var response = request.responseText;

            if (localStorage.getItem('collegeList') == null) {
                localStorage.setItem('collegeList', "" + formatted + ",")
            } else {
                var college_list = localStorage.getItem('collegeList');
                localStorage.setItem('collegeList', college_list + formatted + ",");
            }

            localStorage.setItem(formatted, request.responseText);

            create_college_card(response);
            
            document.getElementsByClassName("spinner-container")[0].style.display = "none"
            $("#fab").removeClass("disabled");
        }
    }

    request.open("GET", "https://1m468rdcpi.execute-api.us-east-1.amazonaws.com/prod/search?search=" + formatted, true);
    request.send();
}

function create_college_card(json_info) {
    json_info = JSON.parse(json_info);
    var formatted = json_info.message.Name.toLowerCase();
    formatted = formatted.replace(/ /g, "-");

    var card = `
    <div id="`+ formatted +`" class="col s12 m3 college-card">
        <div class="card green darken-3">
            <div class="card-content white-text">
                <div id="grade-title">
                    <div class="grade teal accent-4">
                        <span>`+ json_info.message.Niche_Grade +`</span>
                    </div>

                    <span class="card-title" style="display: inline-block;">
                        `+ json_info.message.Name +`
                    </span>
                </div>

                <ul class="list-info">
                    <li> `+ json_info.message.Sat_Range +`</li>
                    <li> `+ json_info.message.Act_Range +`</li>
                    <li> `+ json_info.message.Acceptance_Rate +`</li>
                    <li> `+ json_info.message.Location +`</li>
                    <li> `+ json_info.message.Net_Price +`</li>
                </ul>
            </div>

            <div class="card-action">
                <a class="white-text" target="_blank" href="https://www.niche.com/colleges/`+ formatted +`">Learn More</a>
                <a alt="Delete College" class="delete-button right" onclick=delete_card('`+ formatted +`') style="width: fit-content; height: fit-content; background-color: transparent; box-shadow: none; margin-bottom: 10px;">
                    <i class="material-icons white-text" style="font-size: 2rem">delete</i>
                </a>
            </div>

        </div>
    </div>
    `

    document.getElementById("cards-area").innerHTML += card;
}

function delete_card(card_id) {
    localStorage.removeItem(card_id);
    $("#" + card_id).remove();
}