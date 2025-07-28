<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500&family=Roboto:wght@100;300;400&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  </head>
  <body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <style media="screen">
      body{
        position: relative;
        margin: 0;
        padding: 0;
        background-color: #E0E5EA;
        font-family: 'Montserrat', sans-serif;
        font-family: 'Roboto', sans-serif;
      }
      button{
        position: relative;
        padding: 5px;
        background-color: #2F4560;
        height: 35px;
        border-radius: 5px;
        width: 100px;
        cursor: pointer;
        box-shadow: 0px 0px 2px rgb(50,50,50);
        text-align: center;
        color: white;
        margin: 10px;
        font-weight: 300;
        font-size: 1.2em;

      }
        button:hover{
        background-color: #435267;
        transition: .4s;
      }
      h1, h2, h3, h4, h5{
        padding: 0;
        margin: 0;

      }

      .menuLogin{
        position: relative;
        height: 100px;
        width: 98%;
        left: 50%;
        transform: translateX(-50%);
        background: rgb(49,70,95);
        background: linear-gradient(90deg, rgba(49,70,95,1) 27%, rgba(141,151,163,1) 72%, rgba(252,251,252,1) 100%);
        margin: 20px 0;
        border-radius: 5px;

        display: flex;
        justify-content: center;
        flex-wrap: wrap;
      }

      .bodyLogin{
        position: relative;
        height: 80vh;
        width: 98%;
        left: 50%;
        transform: translateX(-50%);
        background: #2F4560;;
        margin: 20px 0;
        border-radius: 5px;
      }
      .boxLogin{
        position: relative;
        height: 60vh;

        min-width: 600px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        flex-direction: row;
      }
      .boxLogin2{
        position: relative;
        width: 300px;
        height: 100%;
        background-color: orange;
      }
      .boxLogin2:first-child{
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        background-color: #E0E5EA;
      }
      .boxLogin2:last-child{
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        background-color: #2F4560;

      }
      .boxLogin2:last-child img{
        position: relative;
        width: 80%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 50px;
      }
      .boxLogin2:last-child h3{
        position: relative;
        text-align: center;
        padding: 15px;
        color: white;
        font-size: 0.9em;
        font-weight: 300;
      }
      .contentLogin{
        position: relative;
        padding: 10px;
        width: 90%;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .contentLogin h4{
        position: relative;
        text-align: left;
        padding-left: 15px;
        font-size: 0.9em;
        font-weight: 300;
        margin: 8px;
      }
      .contentLogin h5{
        position: relative;
        text-align: center;
        padding-left: 15px;
        font-size: 0.8em;
        font-weight: 300;
        margin: 8px;
        color: #5E2129;
      }
      .contentLogin h1{
        font-weight: 600;
        padding-left: 15px;
        color:  #212E3E;
      }
      .contentLogin input{
        position: relative;
        width: 70%;
        left: 50%;
        transform: translateX(-50%);
        margin: 0;
        height: 20px;
        border-radius: 5px;
      }
      .contactTitle{
        position: relative;
        padding: 5px;
        background-color: #2F4560;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 20px;
        border-radius: 5px;
        width: 100px;
        cursor: pointer;
      }
      .contactTitle:hover{
        background-color: #435267;
        transition: .4s;
      }
      .contactTitle h3{
        text-align: center;
        color: white;
        padding: 0;
        margin: 0;
        font-weight: 300;
      }
      a {
        all: none;
      }
      .bodyLogin h1 {
        color: white;
        padding-left: 55px;
        margin: 2px;
        font-weight: 300;
        font-size: 1em;
      }
      .menuLogin img{
        position: absolute;
        margin-right: 30px;
        height: 55%;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        filter: drop-shadow(2px 2px 3px rgb(50,50,50));
      }
      .menuLogin h1{
        font-size: 3em;
        margin-left: 30px;
        font-weight: 400;
        text-shadow: 2px 2px 5px rgb(50,50,50);
      }

      @media screen and (min-width: 480px) {

      }
      @media screen and (min-width: 768px) {

      }
      @media screen and (min-width: 1024px) {

      }
      @media screen and (min-width: 1200px) {

      }
      .containerMenu{
        position: relative;
        width: 48%;
      }
      .containerMenu img{
        position: absolute;
        height: 60%;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
      .containerMenu:nth-child(2) img{
        right: 5px;
        height: 30%;
        transition: .5s;
      }
      .containerMenu:nth-child(2) img:hover{
        filter: drop-shadow(0px 0px 1px black);
      }
      .containerMenu:nth-child(2) img:active{
        filter: drop-shadow(0px 0px 0px black);
      }
      .menuContainer{
        position: fixed;
        display: none;
        top: 4px;
        right: 4px;
        background-color: rgba(47, 69, 96, .97);
        height: 100%;
        max-width: 320px;
        z-index: 10;
        width: 98%;
        border-radius: 5px;
      }
      .relative{
        position: relative;
      }
      .itemContainer{
        position: relative;
        padding: 10px;
        margin-top: 70px;
        height: 70vh;
        overflow-y: scroll;
      }
      .items{
        padding: 5px;
        background-color: gold;
        cursor: pointer;
        margin: 3px 0;
      }
      .itemsLogout{
        padding: 5px;
        background-color: gold;
        cursor: pointer;
        margin: 3px 0;
        background-color: rgba(33, 46, 63, 1);
      }
      .itemsLogout h3{
        margin: 0;
        padding: 0;
        text-align: center;
        color: white;
        font-weight: 300;
        color: rgba(240, 250, 240, 1);
      }
      .itemsLogout:hover {
        background-color: rgba(33, 46, 63, .7);
      }
      .itemsLogout:active {
        background-color: rgba(33, 46, 63, 1);
      }

      .items:nth-child(odd) {
        background-color: rgba(33, 46, 63, 1);
      }
      .items:nth-child(even) {
        background-color: rgba(109, 114, 126, 1);
      }


      .items:nth-child(odd):hover {
        background-color: rgba(33, 46, 63, .7);
      }
      .items:nth-child(even):hover {
        background-color: rgba(109, 114, 126, .7);
      }


      .items:nth-child(odd):active {
        background-color: rgba(33, 46, 63, 1);
      }
      .items:nth-child(even):active {
        background-color: rgba(109, 114, 126, 1);
      }
      .items h3{
        margin: 0;
        padding: 0;
        text-align: center;
        color: white;
        font-weight: 300;
        color: rgba(240, 250, 240, 1);
      }
      .menuContainer img{
        position: absolute;
        right: 20px;
        top: 20px;
        height: 30px;
        z-index: 11;
        cursor: pointer;
        filter: drop-shadow(0px 0px 2px black);
        transition: .4s;
      }
      .menuContainer img:hover{
        filter: drop-shadow(0px 0px 4px black);
      }
      .menuContainer img:active{
        filter: drop-shadow(0px 0px 2px black);
      }
      .navigateTable{
        position: relative;
        padding-top: 50px;
        left: 50%;
        transform: translateX(-50%);
        padding: 7px;
        width: 80%;
        background-color: rgba(139, 144, 156, .5);
        border-radius: 5px;
        max-width: 400px;

        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
      }
      .navigateTable img{
        height: 30px;
        cursor: pointer;
        filter: drop-shadow(0px 0px 0px grey);
        transition: .4s;
      }
      .navigateTable img:hover{
        filter: drop-shadow(0px 0px 1px #2F4560);
      }
      .navigateTable img:active{
        filter: drop-shadow(0px 0px 0px #2F4560);
      }
      .navigateTable img:first-child{
        transform: rotateY(180deg);
      }
      .textNavigatorTable{
        width: 60%;
        display: none;
      }
      .textNavigatorTable h3{
        margin: 0;
        padding: 4px;
        font-weight: 600;
        font-size: 1em;
        color: rgba(210, 220, 234, 1);
        text-align: center;
      }
      .containerTableW3P{
        position: relative;
        display: none;
        padding: 5px;
        background-color: rgba(139, 144, 156, .5);
        width: 80%;
        height: calc(100% - 150px);
        left: 50%;
        transform: translateX(-50%);
        border-radius: 5px;
        overflow: scroll;
      }
      .containerTableW3P::-webkit-scrollbar {
      width: 1.5em;
      }
      .containerTableW3P::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      }
      .containerTableW3P::-webkit-scrollbar-thumb {
      background:rgba(47, 69, 96, 1);
      border: 1px solid black;
    }
      .containerTableW3P table{
        position: relative;

      /*  left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);*/
      }
      .containerTableW3P th{
        background-color: rgba(202, 108, 46,1);
        color: white;
        padding: 7px;
      }
      .containerTableW3P td{
        border: 1px solid black;
        background-color: rgba(210, 220, 234,1);
        padding: 4px;
      }

      .logoImg{
        position: absolute;
        left: 20px;
        height: 40%!important;
      }

      .containerCenterTable{
        position: relative;
        width: 280px;
        border-radius: 5px;
        overflow: hidden;
        margin-top: 13px;
        left: 50%;
        transform: translateX(-50%);
      }


    </style>

    <section class="Login">
      <!--  MENU  -->
      <div class="menuLoginFixed">
        <div class="menuLogin">
          <div class="containerMenu">
            <img class="logoImg" src="Images/Logo.png" alt="">
          </div>
          <div class="containerMenu">
            <img id="openMenuContainer"  src="Images/menuIcon.png" alt="">
          </div>
        </div>
      </div>

      <div id="menuContainer"  class="menuContainer">
        <img id="closeMenu"  src="Images/Close.png" alt="">
        <div class="relative">
          <div class="itemContainer">
            <div class="items">
              <h3>User manager</h3>
            </div>
            <div class="items">
              <h3>W3P </h3>
            </div>
          <!--  <div class="items">
              <h3>Client PO & Art to C2R</h3>
            </div>
            <div class="items">
              <h3>C2R PO & Art Supplier</h3>
            </div>
            <div class="items">
              <h3>Proof from supplier to C2R</h3>
            </div>
            <div class="items">
              <h3>Approval from client</h3>
            </div>
            <div class="items">
              <h3>Approval from C2R to supplier</h3>
            </div>
            <div class="items">
              <h3>To Production</h3>
            </div>
            <div class="items">
              <h3>Despatch</h3>
            </div>
            <div class="items">
              <h3>Invoice</h3>
            </div>
            <div class="items">
              <h3>Lanyard for you</h3>
            </div>-->
            <div id="logout" class="itemsLogout">
              <h3>Logout </h3>
            </div>
          </div>
        </div>
      </div>

    </section>

    <?php include "../1-ClientsManager/ClientsManager.php" ?>
    <?php include "../2-W3P/W3P.php" ?>

    <script type="text/javascript">
    /* verifyLogin */
  //  verifyLogin();
    function verifyLogin() {
      $.ajax( "../App/Controller/Controller2.php", {
      type: 'post',
      async: false,
      data: {
        module: "verifyLogin",
      },
      success: function(data){
        //var data = jQuery.parseJSON(data);
        if (data == 1) {

        }
        else {
          window.open("../index.php", "_self");
        }

      }
    }
    )
    }




    /* Menu */

    /* Declaration of variables*/
    var closeMenu = document.getElementById('closeMenu');
    var menuContainer = document.getElementById('menuContainer');
    var openMenuContainer = document.getElementById('openMenuContainer');

    /* Close Menu*/
    closeMenu.addEventListener("click", function(){
    menuContainer.style.display = "none";
    })
    /* Open Menu*/
    openMenuContainer.addEventListener("click", function(){
    menuContainer.style.display = "block";
    })




  const items = document.querySelectorAll(".items");
    const bodyLogin = document.querySelectorAll(".bodyLogin");
    var containerOn = 1;



    for (let i = 0; i < bodyLogin.length; i++) {

      bodyLogin[i].style.display = "none";
      bodyLogin[containerOn].style.display = "block";


      items[i].addEventListener("click", function(){

        if (bodyLogin[i].style.display == "none"){
          containerOn  = i;
          bodyLogin[i].style.display = "block";
          turnOffOtherContainers();
          menuContainer.style.display = "none";
        }
        else {
          menuContainer.style.display = "none";
        }
      }
    )
    }

    function turnOffOtherContainers(){
      for (let i = 0; i < items.length; i++) { // Cambiar el 3 por optionAddToCard2.length
        if (i != containerOn) {
          bodyLogin[i].style.display = "none";
        }
      }
    }

    /* Logout */
    var logout = document.getElementById('logout');

    logout.addEventListener("click", function(){
      $.ajax( "../App/Controller/Controller2.php", {
      type: 'post',
      async: false,
      data: {
        module: "logout",
      },
      success: function(data){
        //alert(data);
      //  var data = jQuery.parseJSON(data);

     }
    }
    )
      menuContainer.style.display = "none";
      window.open("../index.php", "_self");
    })

    </script>


  </body>
</html>
