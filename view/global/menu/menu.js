class Menu {
  constructor() {
    this.toggle = document.getElementById("toggle-menu");
    this.logoutLi = document.getElementById("logout");
    this.logoutLink = this.logoutLi ? this.logoutLi.querySelector("a") : null;

    // call checkSession automatically on class instantiation
    this.checkSession();

    if (this.logoutLink) {
      this.logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  // check if the session is active
  checkSession() {
    fetch("../../controller/promoflow/session.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "check" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== "success") {
          window.location.href = "../../view/login/index.php";
        }
      })
      .catch((error) => {
        console.log("Error checking session:", error);
      });
  }

  // logout user
  logout() {
    fetch("../../controller/promoflow/session.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "off" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          // close menu if open
          if (this.toggle) this.toggle.checked = false;

          window.location.href = "../../view/login/index.php";
        }
      })
      .catch((error) => {
        console.log("Error during logout:", error);
      });
  }
}

// instantiate class on page load (script is defer)
const menu = new Menu();
