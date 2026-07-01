//const socket = io("https://disaster-system-backend.onrender.com");

const isLoggedIn =
  localStorage.getItem("isLoggedIn");

if(isLoggedIn !== "true"){

  alert("Please Login First");

  window.location.href =
    "admin-login.html";
}

let allIncidents = [];

let chartInstance;

let mapInstance;

let pieChartInstance;

let barChartInstance;


/* =========================
   LOAD INCIDENTS
========================= */

async function loadIncidents(){

  try{

    const response =
      await fetch(

        "https://disaster-system-backend.onrender.com/incidents"
      );

    allIncidents =
      await response.json();

    displayIncidents(allIncidents);

    updateStatistics(allIncidents);

    createChart(allIncidents);

    createAnalyticsCharts(allIncidents);

    initializeMap(allIncidents);
    
    checkHighSeverity(allIncidents);
  }

  catch(error){

    console.log(error);
  }
}

/* =========================
   DISPLAY INCIDENTS
========================= */

function displayIncidents(incidents){

  let output = "";

  incidents.forEach((incident) => {

    output += `

      <div class="card">

        <h2>

          ${incident.disasterType}

        </h2>

        <p>

          <b>🚨 Severity:</b>

          ${incident.severity || "Medium"}

        </p>

        <p>

          <b>📍 Location:</b>

          ${incident.location}

        </p>

        <p>
📞 Phone:
<a href="tel:${incident.phone}">
${incident.phone}
</a>
</p>

        <p>

          <b>📝 Description:</b>

          ${incident.description}

        </p>

        ${
          incident.image

          ?

          `<img
            src="${incident.image}"
            alt="Disaster Image"
            class="incident-image"
          />`

          :

          ""
        }

        <p>

          <b>Status:</b>

          <span class="status ${getStatusClass(incident.status)}">

            ${incident.status}

          </span>

        </p>

        <p>

          <b>📅 Date:</b>

          ${new Date(
            incident.createdAt
          ).toLocaleString()}

        </p>

        <!-- STATUS DROPDOWN -->

        <select
          onchange="updateStatus('${incident._id}', this.value)"
        >

          <option value="Pending"
            ${incident.status === "Pending" ? "selected" : ""}
          >

            Pending

          </option>

          <option value="In Progress"
            ${incident.status === "In Progress" ? "selected" : ""}
          >

            In Progress

          </option>

          <option value="Resolved"
            ${incident.status === "Resolved" ? "selected" : ""}
          >

            Resolved

          </option>

        </select>

        <button
          class="delete-btn"
          onclick="deleteIncident('${incident._id}')"
        >

          Delete

        </button>

        <button 
        onclick="assignTeam('${incident._id}')"
  style="background:#4caf50;"
>

  🚑 Assign Team

</button>

      </div>

    `;
  });

  document.getElementById(
    "incidentList"
  ).innerHTML = output;
}

/* =========================
   STATUS COLORS
========================= */

function getStatusClass(status){

  if(status === "Pending"){

    return "pending";
  }

  else if(status === "In Progress"){

    return "progress";
  }

  else if(status === "Resolved"){

    return "resolved";
  }

  return "pending";
}

/* =========================
   SEARCH INCIDENTS
========================= */

function searchIncidents(){

  const searchValue =
    document.getElementById(
      "searchInput"
    ).value.toLowerCase();

  const filtered =
    allIncidents.filter((incident) => {

      return (

        incident.disasterType
          .toLowerCase()
          .includes(searchValue)

        ||

        incident.location
          .toLowerCase()
          .includes(searchValue)

        ||

        (incident.severity || "")
          .toLowerCase()
          .includes(searchValue)

      );
    });

  displayIncidents(filtered);
}

/* =========================
   DELETE INCIDENT
========================= */

async function deleteIncident(id){

  const confirmDelete =
    confirm(
      "Are you sure to delete?"
    );

  if(!confirmDelete){

    return;
  }

  try{

    const response =
      await fetch(

        `https://disaster-system-backend.onrender.com/incident/${id}`,

        {
          method: "DELETE"
        }
      );

    const result =
      await response.json();

    alert(result.message);

    loadIncidents();

  }

  catch(error){

    console.log(error);
  }
}

/* =========================
   UPDATE STATUS
========================= */

async function updateStatus(id, status){

  try{

    await fetch(

      `https://disaster-system-backend.onrender.com/incident/${id}`,

      {

        method: "PUT",

        headers: {

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          status: status
        })
      }
    );

    alert(
      "✅ Status Updated Successfully"
    );

    loadIncidents();

  }

  catch(error){

    console.log(error);
  }
}

/* =========================
   UPDATE STATISTICS
========================= */

function updateStatistics(incidents){

  document.getElementById(
    "totalIncidents"
  ).innerText =
    incidents.length;

  document.getElementById(
    "pendingIncidents"
  ).innerText =

    incidents.filter(

      i => i.status === "Pending"

    ).length;

  document.getElementById(
    "resolvedIncidents"
  ).innerText =

    incidents.filter(

      i => i.status === "Resolved"

    ).length;
}

/* =========================
   CREATE CHART
========================= */

function createChart(incidents){

  const disasterCounts = {};

  incidents.forEach((incident) => {

    const type =
      incident.disasterType;

    disasterCounts[type] =

      (disasterCounts[type] || 0) + 1;

  });

  const labels =
    Object.keys(disasterCounts);

  const data =
    Object.values(disasterCounts);

  const ctx =
    document.getElementById(
      "incidentChart"
    );

  if(chartInstance){

    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {

    type: "bar",

    data: {

      labels: labels,

      datasets: [{

        label:
          "Disaster Reports",

        data: data,

        borderWidth: 1
      }]
    },

    options: {

      responsive: true,

      scales: {

        y: {

          beginAtZero: true
        }
      }
    }
  });
}

/* =========================
   INITIALIZE MAP
========================= */

function initializeMap(incidents){

  if(mapInstance){

    mapInstance.remove();
  }

  mapInstance = L.map("map")

    .setView([20.5937, 78.9629], 5);

  L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

      attribution:
        "© OpenStreetMap contributors"
    }

  ).addTo(mapInstance);

  const redIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const greenIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

   incidents.forEach((incident) => {

  if(
    incident.latitude &&
    incident.longitude
  ){

    L.marker(
      [
      incident.latitude,
      incident.longitude
    ],
    {
      icon: redIcon
    }
  )

    .addTo(mapInstance)

    .bindPopup(`

      <b>${incident.disasterType}</b><br>

      ${incident.location}<br>

      Severity: ${incident.severity}<br>

      Status: ${incident.status}

    `);
  }
});
}


  /* INDIA STATE COORDINATES */

  const locations = {

    "Andhra Pradesh":
      [15.9129, 79.7400],

    "Arunachal Pradesh":
      [28.2180, 94.7278],

    "Assam":
      [26.2006, 92.9376],

    "Bihar":
      [25.0961, 85.3131],

    "Chhattisgarh":
      [21.2787, 81.8661],

    "Goa":
      [15.2993, 74.1240],

    "Gujarat":
      [22.2587, 71.1924],

    "Haryana":
      [29.0588, 76.0856],

    "Himachal Pradesh":
      [31.1048, 77.1734],

    "Jharkhand":
      [23.6102, 85.2799],

    "Karnataka":
      [15.3173, 75.7139],

    "Kerala":
      [10.8505, 76.2711],

    "Madhya Pradesh":
      [22.9734, 78.6569],

    "Maharashtra":
      [19.7515, 75.7139],

    "Tamil Nadu":
      [11.1271, 78.6569],

    "Telangana":
      [18.1124, 79.0193],

    "Delhi":
      [28.7041, 77.1025],

    "West Bengal":
      [22.9868, 87.8550]

  };
function checkHighSeverity(incidents){

  const highAlerts = incidents.filter(

    item =>

      item.severity === "High"

      &&

      item.status !== "Resolved"
  );

  if(highAlerts.length > 0){

    const latest =
      highAlerts[0];

    document.getElementById(
      "liveAlert"
    ).style.display = "block";

    document.getElementById(
      "liveAlert"
    ).innerHTML =

      `🚨 HIGH ALERT:
      ${latest.disasterType}
      reported in
      ${latest.location}`;

    // Play Sound

    const sound =
  document.getElementById(
    "alertSound"
  );

if(sound.paused){

  sound.play();

}
  }

  else{

  document.getElementById(
    "liveAlert"
  ).style.display = "none";

}
}

function createAnalyticsCharts(incidents){

  const flood = incidents.filter(
    i => i.disasterType === "Flood"
  ).length;

  const cyclone = incidents.filter(
    i => i.disasterType === "Cyclone"
  ).length;

  const earthquake = incidents.filter(
    i => i.disasterType === "Earthquake"
  ).length;

  /* PIE CHART */

  const pieCtx =
    document.getElementById("pieChart");

  if(pieChartInstance){

    pieChartInstance.destroy();
  }

  pieChartInstance = new Chart(pieCtx,{

    type:"pie",

    data:{

      labels:[
        "Flood",
        "Cyclone",
        "Earthquake"
      ],

      datasets:[{

        data:[
          flood,
          cyclone,
          earthquake
        ]

      }]
    }

  });

  /* BAR CHART */

  const barCtx =
    document.getElementById("barChart");

  if(barChartInstance){

    barChartInstance.destroy();
  }

  barChartInstance = new Chart(barCtx,{

    type:"bar",

    data:{

      labels:[
        "Flood",
        "Cyclone",
        "Earthquake"
      ],

      datasets:[{

        label:"Reports",

        data:[
          flood,
          cyclone,
          earthquake
        ]

      }]
    }

  });

}


/* =========================
   INITIAL LOAD
========================= */

loadIncidents();
setInterval(() => {

  //loadIncidents();
  loadRescues();
  loadSOS();

}, 10000);
function logout(){

  localStorage.removeItem("isLoggedIn");

  window.location.href =
    "admin-login.html";

}

async function assignTeam(){

  const teamId = prompt(

    "Enter Rescue Team ID"

  );

  if(!teamId){

    return;

  }

  try{

    const response = await fetch(

      `https://disaster-system-backend.onrender.com/assign-team/${teamId}`,

      {

        method:"PUT"

      }

    );

    const result =
      await response.json();

    alert(result.message);

    const teamResponse = await fetch(
    "https://disaster-system-backend.onrender.com/teams"
  );

  const teams = await teamResponse.json();
  

  const team = teams.find(
    t => t.teamId.toUpperCase() === teamId.toUpperCase()
  );
alert(team ? team.teamName : "Team Not Found");
  if(team){

    const rescueIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });


    window.assignedTeamMarker = L.marker(
  [
    team.latitude,
    team.longitude
  ],
  {
    icon: rescueIcon
  }
)
.addTo(mapInstance)
.bindPopup(
  `🚑 ${team.teamId} - ${team.teamName}`
)
.openPopup();
   //loadIncidents();

  }
}

  catch(error){

    console.log(error);

  }

}
function downloadReport(){

  window.open(

    "https://disaster-system-backend.onrender.com/download-report",

    "_blank"

  );

}
async function loadRescues(){
  
  try{

  const response =
    await fetch(

      "https://disaster-system-backend.onrender.com/rescues"
    );

  const data =
    await response.json();

  let output = "";

  data.forEach((item)=>{

    output += `

    <div class="card">

      <h3>🚁 Rescue Request</h3>

      <p>

        📍 ${item.location}

      </p>

      <p>

        Status:
        ${item.status}

      </p>

    </div>

    `;
  });

  document.getElementById(
    "rescueList"
  ).innerHTML = output;
}
catch (error) {
    console.log("Rescue load error:", error);
  }
}

async function loadSOS(){

  try{

    const response = await fetch(

      "https://disaster-system-backend.onrender.com/sos-alerts"
    );

    const data = await response.json();

    let output = "";

    data.forEach((sos)=>{

      output += `

      <div class="card">

        <h3>🚨 SOS ALERT</h3>

        <p>

          📍 ${sos.location}

        </p>

        <p>

          Status:
          ${sos.status}

        </p>

        <p>

          Date:
          ${new Date(
            sos.createdAt
          ).toLocaleString()}

        </p>

      </div>

      `;
    });

    document.getElementById(

      "sosList"

    ).innerHTML = output;

  }

  catch(error){

    console.log(error);
  }
}