class SideNavigation {

  constructor() {

    const open_user_manager = document.getElementById("open_user_manager");

    open_user_manager.addEventListener("click", function(){
      window.open("../../view/user_manager/index.php", "_self");
    })

    const open_messages = document.getElementById("open_messages");

    open_messages.addEventListener("click", function(){
      window.open("../../view/messages/index.php", "_self");
    })




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
