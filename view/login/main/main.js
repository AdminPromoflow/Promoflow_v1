class Menu {
  constructor() {
    // call checkSession automatically on class instantiation
    this.checkSession();
  }

  // check if the session is active (same pattern as requestLogin)
  checkSession() {
    const url = "../../controller/promoflow/session.php";
    const data = { action: "check" };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
          alert("Session is active ✅");
        } else {
          alert("Session not found ❌ — redirecting to login…");
          window.location.href = "../../view/users/login.php";
        }
      })
      .catch(error => {
        alert("There was a problem checking your session.");
        console.error("Error:", error);
      });
  }

  // logout user (same pattern as requestLogin)
  logout() {
    const url = "../../controller/promoflow/session.php";
    const data = { action: "off" };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
          alert("Session closed successfully — redirecting…");
          window.location.href = "../../view/users/login.php";
        } else {
          alert("No active session to close.");
        }
      })
      .catch(error => {
        alert("There was a problem processing your logout.");
        console.error("Error:", error);
      });
  }
}

// instantiate class on page load
const menu = new Menu();
// Example: document.querySelector("#logoutBtn")?.addEventListener("click", () => menu.logout());
