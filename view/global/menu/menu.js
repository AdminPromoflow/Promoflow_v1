class Menu {
  constructor() {
    // call checkSession automatically on class instantiation
    this.checkSession();
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
        alert(data);
        if (data.status === "success") {
          alert("Session is active ✅");
        } else {
          alert("Session not found ❌ — redirecting to login...");
          window.location.href = "../../view/users/login.php";
        }
      })
      .catch(error => {
        alert("Error checking session: " + error);
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
          alert("Session closed successfully 🚪 — redirecting...");
          window.location.href = "../../view/users/login.php";
        } else {
          alert("No active session to close ❌");
        }
      })
      .catch(error => {
        alert("Error during logout: " + error);
      });
  }
}

// instantiate class on page load
const menu = new Menu();
