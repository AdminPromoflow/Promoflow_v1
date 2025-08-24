class ClassLogin {
  constructor() {
    btn_login.addEventListener("click",function(){
       classLogin.requestLogin();
    })
  }
  requestLogin() {
    const url = "../../controller/users/login.php";
    const data = {
      action: "requestLogin",
      email: email.value,
      password: password.value
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // parse JSON directly
        }
        throw new Error("Network error.");
      })
      .then(result => {
        if (result.status === "success") {
          // redirect if login success
          window.location.href = "../../view/directory/index.php";
        } else {
          // show alert if login failed
          alert("Your credentials are incorrect, please try again.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("There was a problem with the login request.");
      });
  }
}
const email = document.getElementById('email');
const password = document.getElementById('password');
const btn_login = document.getElementById('btn_login');
const classLogin = new ClassLogin()
