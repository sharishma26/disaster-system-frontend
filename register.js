document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();
  register();
});
async function register() {

  console.log("Register button clicked");

  const username =
    document.getElementById("username").value;

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  if(password !== confirmPassword){

    alert("❌ Passwords do not match");
    return;
  }

  try{

    const response = await fetch(

      "https://disaster-system-backend.onrender.com/register",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          username,
          email,
          password

        })
      }
    );
    console.log("Response received");

    const data = await response.json();

    alert(data.message);

    if(data.success){

      alert("Your OTP is: " + data.otp);

      localStorage.setItem(

        "email",

        email

      );

      window.location.href =
        "otp.html";
    }

  }

  catch(error){

    console.log(error);

    alert("Server Error");
  }
}