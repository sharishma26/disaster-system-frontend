async function userLogin(){

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  try{

    const response = await fetch(
      "https://disaster-system-backend.onrender.com/login",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const result =
      await response.json();

    alert(result.message);

    if(result.success){

      localStorage.setItem(
        "token",
        result.token
      );

      window.location.href =
        "index.html";
    }

  }

  catch(error){

    console.log(error);

    alert("Login Failed");
  }
}