class SideNavigation {
  constructor() {
    this.sidebar = document.getElementById("dashboard-sidebar");
    this.btnOpen = document.getElementById("sidebar-open");
    this.btnClose = document.getElementById("sidebar-close");

    if (!this.sidebar || !this.btnOpen || !this.btnClose) return;

    this.btnOpen.addEventListener("click", () => this.open());
    this.btnClose.addEventListener("click", () => this.close());

    document.querySelectorAll("[data-sidebar-placeholder]").forEach((item) => {
      item.addEventListener("click", () => {
        const label = item.dataset.sidebarPlaceholder || "This section";
        window.alert(`${label} is not available yet.`);
      });
    });
  }

  open() {
    this.sidebar.classList.add("side-open");
    this.sidebar.classList.remove("side-close");
    this.btnOpen.classList.add("is-hidden");
    this.btnOpen.setAttribute("aria-expanded", "true");
  }

  close() {
    this.sidebar.classList.add("side-close");
    this.sidebar.classList.remove("side-open");
    this.btnOpen.classList.remove("is-hidden");
    this.btnOpen.setAttribute("aria-expanded", "false");
  }
}

document.addEventListener("DOMContentLoaded", () => new SideNavigation());
