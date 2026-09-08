if (sessionStorage.getItem("loggedIn") !== "true") {

    window.location.href = "login.html";

}

const navButtons =
    document.querySelectorAll(".nav-btn");

const pages =
    document.querySelectorAll(".page");

const incidentForm =
    document.getElementById("incidentForm");

const cancelBtn =
    document.getElementById("cancelBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const recordsBody =
    document.getElementById("recordsBody");

const recentBody =
    document.getElementById("recentBody");

const searchBody =
    document.getElementById("searchBody");

const searchInput =
    document.getElementById("searchInput");

const filterSearch =
    document.getElementById("filterSearch");

const filterStatus =
    document.getElementById("filterStatus");

const viewOverlay =
    document.getElementById("viewOverlay");

const viewTitle =
    document.getElementById("viewTitle");

const viewBody =
    document.getElementById("viewBody");

const closeView =
    document.getElementById("closeView");

const closeViewBtn =
    document.getElementById("closeViewBtn");

const deleteRecordBtn =
    document.getElementById("deleteRecordBtn");

const editRecordBtn =
    document.getElementById("editRecordBtn");

let incidents =
    JSON.parse(
        localStorage.getItem("barangayIncidents")
    ) || [];

let selectedIncidentId = null;

let editingId = null;

navButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const pageId =
            button.getAttribute("data-page");


        navButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        pages.forEach(function(page) {

            page.classList.remove("active-page");

        });


        button.classList.add("active");


        document
            .getElementById(pageId)
            .classList.add("active-page");


        refreshAll();

    });

});


const loggedUser =
    document.getElementById("loggedUser");

if (loggedUser) {

    loggedUser.textContent =
        sessionStorage.getItem("username")
        || "Administrator";

}


logoutBtn.addEventListener("click", function() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) {
        return;
    }


    sessionStorage.removeItem("loggedIn");

    sessionStorage.removeItem("userRole");

    sessionStorage.removeItem("username");


    window.location.href =
        "login.html";

});

function generateIncidentId() {

    if (incidents.length === 0) {

        return "INC-00001";

    }


    const numbers =
        incidents.map(function(incident) {

            return parseInt(
                incident.id.replace("INC-", "")
            ) || 0;

        });


    const highest =
        Math.max(...numbers);


    return "INC-" +
        String(highest + 1).padStart(5, "0");

}

function saveData() {

    localStorage.setItem(
        "barangayIncidents",
        JSON.stringify(incidents)
    );

}

incidentForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const date =
            document.getElementById("f_date").value;

        const time =
            document.getElementById("f_time").value;

        const type =
            document.getElementById("f_type").value.trim();

        const location =
            document.getElementById("f_location").value.trim();

        const complainant =
            document.getElementById("f_complainant").value.trim();

        const respondent =
            document.getElementById("f_respondent").value.trim();

        const description =
            document.getElementById("f_description").value.trim();

        const status =
            document.getElementById("f_status").value;

        const recordedBy =
            document.getElementById("f_recordedBy").value.trim();


        if (editingId) {

            const incident =
                incidents.find(function(item) {

                    return item.id === editingId;

                });


            if (incident) {

                incident.date = date;

                incident.time = time;

                incident.type = type;

                incident.location = location;

                incident.complainant = complainant;

                incident.respondent = respondent;

                incident.description = description;

                incident.status = status;

                incident.recordedBy = recordedBy;

            }


            editingId = null;


        } else {

            const newIncident = {

                id: generateIncidentId(),

                date: date,

                time: time,

                type: type,

                location: location,

                complainant: complainant,

                respondent: respondent,

                description: description,

                status: status,

                recordedBy: recordedBy,

                createdAt:
                    new Date().toISOString()

            };


            incidents.push(newIncident);

        }


        saveData();

        incidentForm.reset();

        refreshAll();


        alert(
            "Incident record saved successfully."
        );


        showPage("dashboardPage");

    }
);

cancelBtn.addEventListener(
    "click",
    function() {

        editingId = null;

        incidentForm.reset();

        showPage("dashboardPage");

    }
);

function showPage(pageId) {

    pages.forEach(function(page) {

        page.classList.remove("active-page");

    });


    navButtons.forEach(function(button) {

        button.classList.remove("active");

    });


    const page =
        document.getElementById(pageId);

    if (page) {

        page.classList.add("active-page");

    }


    const button =
        document.querySelector(
            `[data-page="${pageId}"]`
        );

    if (button) {

        button.classList.add("active");

    }

}

function displayRecords() {

    recordsBody.innerHTML = "";


    let filtered =
        [...incidents];


    const search =
        filterSearch.value
            .trim()
            .toLowerCase();


    const status =
        filterStatus.value;


    filtered =
        filtered.filter(function(incident) {

            const searchable =
                (
                    incident.id +
                    " " +
                    incident.type +
                    " " +
                    incident.complainant +
                    " " +
                    (incident.respondent || "") +
                    " " +
                    incident.location
                ).toLowerCase();


            const matchesSearch =
                searchable.includes(search);


            const matchesStatus =
                status === "All" ||
                incident.status === status;


            return matchesSearch &&
                   matchesStatus;

        });


    if (filtered.length === 0) {

        recordsBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No records found.
                </td>
            </tr>
        `;

        return;

    }


    filtered
        .sort(function(a, b) {

            return b.createdAt.localeCompare(
                a.createdAt
            );

        })
        .forEach(function(incident) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(incident.id)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(incident.date)}
                </td>

                <td>
                    ${escapeHTML(incident.type)}
                </td>

                <td>
                    ${escapeHTML(incident.complainant)}
                </td>

                <td>
                    ${escapeHTML(incident.location)}
                </td>

                <td>
                    ${statusBadge(incident.status)}
                </td>

                <td>

                    <button
                        class="btn primary"
                        onclick="viewIncident('${incident.id}')"
                    >
                        View
                    </button>

                </td>

            `;


            recordsBody.appendChild(row);

        });

}

function displayRecentRecords() {

    recentBody.innerHTML = "";


    const recent =
        [...incidents]
            .sort(function(a, b) {

                return b.createdAt.localeCompare(
                    a.createdAt
                );

            })
            .slice(0, 5);


    if (recent.length === 0) {

        recentBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No incident records yet.
                </td>
            </tr>
        `;

        return;

    }


    recent.forEach(function(incident) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(incident.id)}
                </strong>
            </td>

            <td>
                ${escapeHTML(incident.date)}
            </td>

            <td>
                ${escapeHTML(incident.type)}
            </td>

            <td>
                ${escapeHTML(incident.complainant)}
            </td>

            <td>
                ${statusBadge(incident.status)}
            </td>

        `;


        recentBody.appendChild(row);

    });

}

function displaySearchResults() {

    searchBody.innerHTML = "";


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const results =
        incidents.filter(function(incident) {

            const searchable =
                (
                    incident.id +
                    " " +
                    incident.type +
                    " " +
                    incident.complainant +
                    " " +
                    (incident.respondent || "") +
                    " " +
                    (incident.location || "") +
                    " " +
                    (incident.description || "")
                ).toLowerCase();


            return searchable.includes(search);

        });


    if (results.length === 0) {

        searchBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No matching records.
                </td>
            </tr>
        `;

        return;

    }


    results.forEach(function(incident) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(incident.id)}
            </td>

            <td>
                ${escapeHTML(incident.date)}
            </td>

            <td>
                ${escapeHTML(incident.type)}
            </td>

            <td>
                ${escapeHTML(incident.complainant)}
            </td>

            <td>
                ${escapeHTML(incident.respondent || "-")}
            </td>

            <td>
                ${statusBadge(incident.status)}
            </td>

        `;


        searchBody.appendChild(row);

    });

}

function statusBadge(status) {

    const className =
        status.toLowerCase();


    return `
        <span class="status ${className}">
            ${escapeHTML(status)}
        </span>
    `;

}

function viewIncident(id) {

    const incident =
        incidents.find(function(item) {

            return item.id === id;

        });


    if (!incident) {
        return;
    }


    selectedIncidentId =
        incident.id;


    viewTitle.textContent =
        "Incident " + incident.id;


    viewBody.innerHTML = `

        <div class="report-row">
            <strong>Incident ID</strong>
            <span>${escapeHTML(incident.id)}</span>
        </div>

        <div class="report-row">
            <strong>Date</strong>
            <span>${escapeHTML(incident.date)}</span>
        </div>

        <div class="report-row">
            <strong>Time</strong>
            <span>${escapeHTML(incident.time)}</span>
        </div>

        <div class="report-row">
            <strong>Incident Type</strong>
            <span>${escapeHTML(incident.type)}</span>
        </div>

        <div class="report-row">
            <strong>Location</strong>
            <span>${escapeHTML(incident.location)}</span>
        </div>

        <div class="report-row">
            <strong>Complainant</strong>
            <span>${escapeHTML(incident.complainant)}</span>
        </div>

        <div class="report-row">
            <strong>Respondent</strong>
            <span>${escapeHTML(incident.respondent || "-")}</span>
        </div>

        <div class="report-row">
            <strong>Status</strong>
            <span>${statusBadge(incident.status)}</span>
        </div>

        <div class="report-row">
            <strong>Recorded By</strong>
            <span>${escapeHTML(incident.recordedBy)}</span>
        </div>

        <div style="margin-top:20px;">

            <strong>
                Description
            </strong>

            <p>
                ${escapeHTML(incident.description)}
            </p>

        </div>

    `;


    viewOverlay.classList.add("show");

}

function closeModal() {

    viewOverlay.classList.remove("show");

    selectedIncidentId = null;

}


closeView.addEventListener(
    "click",
    closeModal
);


closeViewBtn.addEventListener(
    "click",
    closeModal
);


viewOverlay.addEventListener(
    "click",
    function(event) {

        if (event.target === viewOverlay) {

            closeModal();

        }

    }
);

deleteRecordBtn.addEventListener(
    "click",
    function() {

        if (!selectedIncidentId) {
            return;
        }


        const confirmDelete =
            confirm(
                "Are you sure you want to delete this record?"
            );


        if (!confirmDelete) {
            return;
        }


        incidents =
            incidents.filter(function(incident) {

                return incident.id !== selectedIncidentId;

            });


        saveData();

        closeModal();

        refreshAll();

    }
);

editRecordBtn.addEventListener(
    "click",
    function() {

        const incident =
            incidents.find(function(item) {

                return item.id === selectedIncidentId;

            });


        if (!incident) {
            return;
        }


        editingId =
            incident.id;


        document.getElementById("f_date").value =
            incident.date;

        document.getElementById("f_time").value =
            incident.time;

        document.getElementById("f_type").value =
            incident.type;

        document.getElementById("f_location").value =
            incident.location;

        document.getElementById("f_complainant").value =
            incident.complainant;

        document.getElementById("f_respondent").value =
            incident.respondent || "";

        document.getElementById("f_description").value =
            incident.description;

        document.getElementById("f_status").value =
            incident.status;

        document.getElementById("f_recordedBy").value =
            incident.recordedBy;


        closeModal();

        showPage("addIncidentPage");

    }
);


filterSearch.addEventListener(
    "input",
    displayRecords
);


filterStatus.addEventListener(
    "change",
    displayRecords
);


searchInput.addEventListener(
    "input",
    displaySearchResults
);

function updateDashboard() {

    document.getElementById("sumTotal")
        .textContent =
        incidents.length;


    document.getElementById("sumPending")
        .textContent =
        incidents.filter(function(incident) {

            return incident.status === "Pending";

        }).length;


    document.getElementById("sumResolved")
        .textContent =
        incidents.filter(function(incident) {

            return incident.status === "Resolved";

        }).length;

}

function displayReports() {

    const typeBody =
        document.getElementById(
            "reportTypeBody"
        );


    const statusBody =
        document.getElementById(
            "reportStatusBody"
        );


    typeBody.innerHTML = "";

    statusBody.innerHTML = "";


    const types = {};


    incidents.forEach(function(incident) {

        types[incident.type] =
            (types[incident.type] || 0) + 1;

    });


    Object.keys(types).forEach(function(type) {

        typeBody.innerHTML += `

            <div class="report-row">

                <span>
                    ${escapeHTML(type)}
                </span>

                <strong>
                    ${types[type]}
                </strong>

            </div>

        `;

    });


    if (Object.keys(types).length === 0) {

        typeBody.innerHTML =
            "<p>No data available.</p>";

    }


    const statuses = {

        Pending: 0,

        Ongoing: 0,

        Resolved: 0

    };


    incidents.forEach(function(incident) {

        if (statuses[incident.status] !== undefined) {

            statuses[incident.status]++;

        }

    });


    Object.keys(statuses).forEach(function(status) {

        statusBody.innerHTML += `

            <div class="report-row">

                <span>
                    ${status}
                </span>

                <strong>
                    ${statuses[status]}
                </strong>

            </div>

        `;

    });

}

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

function refreshAll() {

    updateDashboard();

    displayRecentRecords();

    displayRecords();

    displaySearchResults();

    displayReports();

}

function openDatePicker() {
    document.getElementById("hiddenDate").showPicker();
}

function openTimePicker() {
    document.getElementById("hiddenTime").showPicker();
}

function setDate(value) {
    if (value) {
        const date = new Date(value + "T00:00:00");

        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();

        document.getElementById("f_date").value =
            `${month}/${day}/${year}`;
    }
}

function setTime(value) {
    if (value) {
        const [hours, minutes] = value.split(":");

        let hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";

        hour = hour % 12;
        hour = hour || 12;

        document.getElementById("f_time").value =
            `${hour}:${minutes} ${ampm}`;
    }
}

refreshAll();