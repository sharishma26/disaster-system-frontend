async function resetPassword(){

  const email =

    document.getElementById(
      "email"
    ).value;

  const response = await fetch(

    "https://disaster-system-backend.onrender.com/forgot-password",

    {

      method:"POST",

      headers:{

        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({

        email
      })
    }
  );

  const data = await response.json();

  alert(data.message);
}