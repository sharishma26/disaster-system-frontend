async function login() {

  const email =

    document.getElementById(
      "email"
    ).value;

  const password =

    document.getElementById(
      "password"
    ).value;

  try {

    const response = await fetch(

      "https://disaster-system-backend.onrender.com/login",

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          email,

          password
        })
      }
    );

    const data = await response.json();

    if(data.success){

      alert(data.message);

      localStorage.setItem(

        "token",

        data.token
      );

      window.location.href =
        "admin.html";
    }

    else{

      alert(data.message);
    }

  }

  catch(error){

    console.log(error);

    alert("Login Failed");
  }
}