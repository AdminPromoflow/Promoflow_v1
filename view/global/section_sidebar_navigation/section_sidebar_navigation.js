class SideNavigation {

  constructor() {

    sidebar.classList.add("side-open");
    sidebar.classList.remove("side-close");
    btnOpen.classList.add("is-hidden"); // opcional

    btnOpen.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.add("side-open");
      sidebar.classList.remove("side-close");
      btnOpen.classList.add("is-hidden"); // opcional
    });

    btnClose.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.add("side-close");
      sidebar.classList.remove("side-open");
      btnOpen.classList.remove("is-hidden"); // opcional
    });

  }

}

const sidebar = document.querySelector(".section-sidebar-navigation");
const btnOpen = document.getElementById("sidebar-open");
const btnClose = document.getElementById("sidebar-close");
const sideNavigation = new SideNavigation();
