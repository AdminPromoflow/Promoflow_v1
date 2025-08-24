class Menu {
  constructor() {
    // call checkSession automatically on class instantiation
    this.checkSession();

    logout.addEventListener("click", function(){
      this.logout();
    });
  }

  // check if the session is active
  checkSession() {
    fetch("../../controller/promoflow/session.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "check" })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
        } else {
          window.location.href = "../../view/login/index.php";
        }
      })
      .catch(error => {
        console.log("Error checking session: " + error);
      });
  }

  // logout user
  logout() {
    fetch("../../controller/promoflow/session.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "off" })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
        //  alert("Session closed successfully 🚪 — redirecting...");
          window.location.href = "../../view/login/index.php";
        } else {
        //  alert("No active session to close ❌");
        }
      })
      .catch(error => {
        //alert("Error during logout: " + error);
      });
  }
}
const logout = document.getElementById("logout");
// instantiate class on page load
const menu = new Menu();
