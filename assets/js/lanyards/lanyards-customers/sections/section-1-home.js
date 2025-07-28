class LanyardCustomers {
  constructor() {
    // Initialize the LanyardCustomers class
    // Call a method from menuClass to change the path image for login (assuming menuClass is defined elsewhere)
    menuClass.changePathImageOpenLogin(2);

    // Define the URL for the AJAX request
    const url = "../../../controller/lanyards/lanyard-curtomers-controller.php";

    // Create an object containing the action to retrieve all Lanyard customers
    const data = {
      action: "getAllLanyardCustomers"
    };

    // Initiate an AJAX request to retrieve customer data
  //this.makeAjaxRequestGetAllLanyardCustomers(url, data);
  }

  // Function to make the AJAX request
  makeAjaxRequestGetAllLanyardCustomers(url, data) {
    // Make an HTTP POST request using the Fetch API
    fetch(url, {
      method: "POST", // Use the HTTP POST method to send data
      headers: {
        "Content-Type": "application/json" // Indicate that you're sending JSON data
      },
      body: JSON.stringify(data) // Convert the data object to a JSON string and send it
    })
      .then(response => {
        if (response.ok) {
          return response.text(); // Parse the response as text (or use response.json() for JSON responses)
        }
        throw new Error("Network error.");
      })
      .then(data => {
        // The code inside this function runs when the request is complete
        var objetoJSON = JSON.parse(data);
        this.createCustomers(objetoJSON);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  createCustomers(data) {
    // Clear the inner HTML of the listCustomers element
    listCustomers.innerHTML = "";

    // Loop through the data to create customer elements and add them to the listCustomers element
    for (var i = 0; i < data.length; i++) {
      listCustomers.innerHTML += `
        <div class="customerBox">
          <div class="imgCustomer">
            <div class="circleImgCustomer"></div>
          </div>
          <div class="nameCustomer">
            <p>${data[i]["nameUser"]}</p>
          </div>
          <div class="emailCustomer">
            <p>${data[i]["emailUser"]}</p>
          </div>
        </div>`;
    }

    // Set random background colors for elements with class "circleImgCustomer"
    const circleImgCustomer = document.querySelectorAll('.circleImgCustomer');
    for (var i = 0; i < circleImgCustomer.length; i++) {
      circleImgCustomer[i].style.background = this.getRandomColor();
    }
  }

  getRandomColor() {
    // Generate a random hexadecimal color
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

// Get the HTML element with id "listCustomers"
var listCustomers = document.getElementById("listCustomers");

// Create an instance of the LanyardCustomers class, triggering the constructor
const lanyardCustomersClass = new LanyardCustomers();
