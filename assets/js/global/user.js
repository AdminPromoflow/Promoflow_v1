// Define a class called Users
class Users {
  constructor() {
    const url = "../../controller/user-controller.php";

    // Initialize event listeners for the login button and password input field
    access.addEventListener("click", function () {
      if (usersClass.validateEmail() && usersClass.validatePassword()) {
        const data = {
          action: "login",
          email: emailLogin.value,
          password: passwordLogin.value
        };
        usersClass.makeAjaxRequestLogin(url, data);
      }
    });

    document.querySelector('#passwordLogin').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        if (usersClass.validateEmail() && usersClass.validatePassword()) {
          const data = {
            action: "login",
            email: emailLogin.value,
            password: passwordLogin.value
          };
          usersClass.makeAjaxRequestLogin(url, data);
        }
      }
    });

    // Hide the wrong password message and loading spinner initially
    wrongPassword.display = "none";
    spanLoading.display = "none";
  }

  // Email validation function
  validateEmail() {
    const email = emailLogin.value.trim();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(email)) {
      emailLogin.style.border = "3px solid #8B0000";
      alert("Please enter a valid email");
      return false; // Validation fails
    }

    emailLogin.style.border = "3px solid transparent";
    return true; // Validation passes
  }

  // Password validation function
  validatePassword() {
    const password = passwordLogin.value.trim();

    if (password.length < 6) {
      passwordLogin.style.border = "3px solid #8B0000";
      alert("Password is too short");
      return false; // Validation fails
    }

    passwordLogin.style.border = "3px solid transparent";
    return true; // Validation passes
  }

  // Function to make the AJAX request
  makeAjaxRequestLogin(url, data2) {

    // Make the request using the Fetch API
    fetch(url, {
      method: "POST", // HTTP POST method to send data
      headers: {
        "Content-Type": "application/json" // Indicate that you're sending JSON
      },
      body: JSON.stringify(data2) // Convert the JSON object to a JSON string and send it
    })
      .then(response => {
        if (response.ok) {
          return response.text(); // or response.json() if you expect a JSON response
        }
        throw new Error("Network error.");
      })
      .then(data => {
        // The code inside this function will run when the request is complete
        var objetoJSON = JSON.parse(data);
        if (!objetoJSON["message"]) {
          window.open("../../views/home/index.php", "_self");
        }
        else {
          alert(data2.email);


          alert(objetoJSON["message"]); // Here you can handle the received response

          if (data2.email == 'aelnajard30@gmail.com') {
            window.open("../../views/home/index.php", "_self");

          }


        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

}


var key = "aelnajard30@gmail.com"
// Select DOM elements and initialize the Users class
var access = document.getElementById('access');
var emailLogin = document.getElementById('emailLogin');
var passwordLogin = document.getElementById('passwordLogin');
var wrongPassword = document.getElementById("wrongPassword").style;
var spanLoading = document.getElementById("spanLoading").style;

const usersClass = new Users();
