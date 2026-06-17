window.onload = function(){

  const email =

    localStorage.getItem(
      "otpEmail"
    );

  if(email){

    document.getElementById(
      "email"
    ).value = email;
  }
};

async function verifyOTP(){

  const email =

    document.getElementById(
      "email"
    ).value;

  const otp =

    document.getElementById(
      "otp"
    ).value;
    
    const email = localStorage.getItem("userEmail");

    console.log("Email from localStorage:", email);

  const response = await fetch(

    "https://disaster-system-backend.onrender.com/verify-otp",

    {

      method:"POST",

      headers:{

        "Content-Type":
        "application/json"
      },

      body: JSON.stringify({

        email,
        otp
      })
    }
  );

  const data =
    await response.json();

  alert(data.message);

  if(data.success){

    window.location.href =
      "login.html";
  }
}