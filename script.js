
let latitude = "";
let longitude = "";

if (navigator.geolocation) {

  navigator.geolocation.getCurrentPosition(

    (position) => {

      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

    },

    (error) => {

      console.log(error);

      alert("Location access denied");
    }

  );

}
const form = document.getElementById("reportForm");

/* =========================
   SUBMIT REPORT
========================= */

form.addEventListener(

  "submit",

  async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append(

      "disasterType",

      document.getElementById(
        "disasterType"
      ).value
    );

    formData.append(

      "severity",

      document.getElementById(
        "severity"
      ).value
    );

    formData.append(

      "location",

      document.getElementById(
        "location"
      ).value
    );

    formData.append(

      "description",

      document.getElementById(
        "description"
      ).value
    );

    formData.append(
  "latitude",
  latitude
);

formData.append(
  "longitude",
  longitude
);

    formData.append(

      "image",

      document.getElementById(
        "image"
      ).files[0]
    );

    try{

      console.log("Submitting report..."); 

      const response = await fetch(

        "https://disaster-system-backend.onrender.com/report",

        {

          method: "POST",

          body: formData
        }
      );
        console.log("Status:", response.status);

      const result =
        await response.json();

        console.log("Server Response:", result);

      alert(result.message);

      // Voice Success Alert

      const speech =

        new SpeechSynthesisUtterance(

          "Incident reported successfully"
        );

      speech.lang = "en-US";

      window.speechSynthesis.speak(
        speech
      );

      form.reset();

      // Reload Live Reports

      loadIncidents();

      // Reload Statistics

      loadStatistics();

    }

    catch(error){

  console.log("ERROR =", error);

  alert(error);
}
});

/* =========================
   LOAD LIVE INCIDENTS
========================= */

async function loadIncidents(){

  try{

    const response = await fetch(

      "https://disaster-system-backend.onrender.com/incidents"
    );

    const data =
      await response.json();

    let output = "";

    data.forEach((incident) => {

      let severityColor = "";

      if(
        incident.severity === "High"
      ){

        severityColor = "red";
      }

      else if(
        incident.severity === "Medium"
      ){

        severityColor = "orange";
      }

      else{

        severityColor = "green";
      }

      output += `

      <div class="incident-card">

        <h3>
          ${incident.disasterType}
        </h3>

        <p>
          📍 ${incident.location}
        </p>

        <p>
          ⚠️ Severity:
          <span style="
            color:${severityColor};
            font-weight:bold;
          ">
            ${incident.severity}
          </span>
        </p>

        <p>
          📝 ${incident.description}
        </p>

        <p>
          📅
          ${new Date(
            incident.createdAt
          ).toLocaleString()}
        </p>

        <img
          src="${incident.image}"
          width="100%"
          style="
            border-radius:10px;
            margin-top:10px;
          "
        />

      </div>
      `;
    });

    document.getElementById(

      "incidentContainer"

    ).innerHTML = output;

  }

  catch(error){

    console.log(error);
  }
}

/* =========================
   LOAD STATISTICS
========================= */

async function loadStatistics(){

  try{

    const response = await fetch(

      "https://disaster-system-backend.onrender.com/incidents"
    );

    const data =
      await response.json();

    document.getElementById(

      "totalReports"

    ).innerText = data.length;

    document.getElementById(

      "floodCount"

    ).innerText =

      data.filter(

        item =>
          item.disasterType ===
          "Flood"

      ).length;

    document.getElementById(

      "earthquakeCount"

    ).innerText =

      data.filter(

        item =>
          item.disasterType ===
          "Earthquake"

      ).length;

    document.getElementById(

      "cycloneCount"

    ).innerText =

      data.filter(

        item =>
          item.disasterType ===
          "Cyclone"

      ).length;

  }

  catch(error){

    console.log(error);
  }
}

async function activateSOS(){

  const name = prompt(

    "Enter Your Name"

  );

  try{

    const response = await fetch(

      "https://disaster-system-backend.onrender.com/sos",

      {

        method:"POST",

        headers:{

          "Content-Type":"application/json"

        },

        body: JSON.stringify({

          name,

          location:
            document.getElementById(
              "location"
            ).value,

          latitude,

          longitude

        })

      }

    );

    const result =
      await response.json();

    alert(result.message);

  }

  catch(error){

    console.log(error);

  }

}
/* =========================
   LOAD EVERYTHING
========================= */

loadIncidents();

loadStatistics();

function findNearbyHelp(){

  if(!navigator.geolocation){

    alert("Location not supported");

    return;
  }

  navigator.geolocation.getCurrentPosition(

    (position)=>{

      const lat =
        position.coords.latitude;

      const lng =
        position.coords.longitude;

      document.getElementById(
        "nearbyHelp"
      ).innerHTML =

      `
      <div class="contact-card">

        <h3>🏥 Nearby Help</h3>

        <p>
          Your Location:
          ${lat},
          ${lng}
        </p>

        <a
          href="https://www.google.com/maps/search/hospital/@${lat},${lng},15z"
          target="_blank"
        >

          Open Nearby Hospitals

        </a>

      </div>
      `;
    },

    (error)=>{

      console.log(error);

      alert(
        "Location access denied"
      );
    }
  );
}
async function requestRescue(){

  const location = document.getElementById(
    "location"
  ).value;

  if(!location){

    alert("Enter location first");

    return;
  }

  try{

    const response = await fetch(

      "https://disaster-system-backend.onrender.com/rescue",

      {

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          location

        })
      }
    );

    const result =
      await response.json();

    alert(result.message);

  }

  catch(error){

    console.log(error);
  }
}