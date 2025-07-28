<style media="screen">
.containerUsers{
  position: relative;
  width: 280px;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 13px;
}
.boxUser{
  position: relative;
  width: 100%;
}
.boxUserName{
  position: relative;
  width: 100%;
  height: 40px;
  background-color: rgba(47, 69, 96, 1);
  border: 1px solid black;
}
.boxUserName h3{
  position: relative;
  text-align: center;
  color: white;
  top: 50%;
  transform: translateY(-50%);
}
.toggleInformation{
  position: absolute;
  width: 40px;
  height: 100%;
  top: 0px;
  right: 0px;
}
.buttonPlus {
  position: absolute;
  width: 25px;
  height: 21px;
  top:50%;
  right:10px;
  transform: translateY(-50%);
  cursor: pointer;
  }
.buttonLess{
  position: absolute;
  width: 25px;
  height: 11px;
  top:50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  display: none;
  }
.boxUserInformation{
  position: relative;
  width: 100%;
  background-color: rgba(225, 228, 235, 1);
}
.itemBoxUserInformation{
  position: relative;
  width: 100%;
  height: 40px;
  border: 1px solid black;
  overflow-x: scroll;
}
.itemBoxUserInformation p{
  position: absolute;
  font-size: 0.8em;
  font-weight: 400;
  top: 5px;
  left: 50%;
  transform: translate(-50%,-50%);
  padding-left: 30px;
  font-weight: 300;
}
 .nameItemUserInformation p{
  position: absolute;
  top: -5px;
  left: 30px;
  font-size: 0.9em;
  padding-left: 15px;
  color: rgba(47, 69, 96, 1);
  text-shadow: 0.5px 0.5px 1px black;
}
.itemBoxUserInformation::-webkit-scrollbar{
  display: none;
  }
.hideShow{
  display: none;
}
.showHide{
  display: block;
}


</style>

<div class="ContainerCRUD">
  <div class="containerCRUDTitle">
      <h2 id="">Users in the system</h2>
  </div>
  <div class="containerCRUDWrap" >
    <div class="containerUsers" id="containerBoxUsersRead">
<!--
    <div class="boxUser">
        <div class="boxUserName">
          <h3 class="nameUserRead"></h3>
          <div class="toggleInformation">
            <img class="buttonPlus"src="../1-2-Read/Images/mas.png" alt="">
            <img class="buttonLess"src="../1-2-Read/Images/menos.png" alt="">
          </div>
        </div>
        <div class="boxUserInformation">
          <div class="itemBoxUserInformation">
            <div class="nameItemUserInformation">
              <p class="nameItemUserInformation">Email:</p>
            </div>
            <p class="emailUserRead"> </p>
          </div>
          <div class="itemBoxUserInformation">
            <div class="nameItemUserInformation">
              <p class="nameItemUserInformation">Password:</p>
            </div>
            <p class="passwordUserRead"> </p>
          </div>
          <div class="itemBoxUserInformation">
            <div class="nameItemUserInformation">
              <p class="nameItemUserInformation ">User type:</p>
            </div>
            <p class="typeUserRead"> </p>
          </div>
        </div>
      </div> -->






    </div>
  </div>

</div>
<script type="text/javascript">

  // Function read Users  nameUserRead emailUserRead passwordUserRead typeUserRead
  var containerBoxUsersRead = document.getElementById("containerBoxUsersRead");

  function setUsersRead(data){
    containerBoxUsersRead.innerHTML  = "";
       for (var i = 0; i < data.length; i++) {//

         containerBoxUsersRead.innerHTML  +=
         '<div class="boxUser" >'+
             '<div class="boxUserName">'+
               '<h3 class="nameUserRead">'+data[i]["name"]+'</h3>'+
               '<div class="toggleInformation" onclick="showInformationUser(\''+i+'\');">'+
                 '<img class="buttonPlus"src="../1-2-Read/Images/mas.png" alt="">'+
                 '<img class="buttonLess"src="../1-2-Read/Images/menos.png" alt="">'+
               '</div>'+
             '</div>'+
             '<div class="boxUserInformation">'+
               '<div class="itemBoxUserInformation">'+
                 '<div class="nameItemUserInformation">'+
                   '<p class="nameItemUserInformation">Email:</p>'+
                 '</div>'+
                 '<p class="emailUserRead">'+data[i]["email"]+' </p>'+
               '</div>'+
               '<div class="itemBoxUserInformation">'+
                 '<div class="nameItemUserInformation">'+
                   '<p class="nameItemUserInformation">Password:</p>'+
                 '</div>'+
                 '<p class="passwordUserRead">'+data[i]["password"]+' </p>'+
               '</div>'+
               '<div class="itemBoxUserInformation">'+
                 '<div class="nameItemUserInformation">'+
                   '<p class="nameItemUserInformation ">User type:</p>'+
                 '</div>'+
                 '<p class="typeUserRead">'+data[i]["userType"]+'</p>'+
               '</div>'+
             '</div>'+
           '</div>';
       }
    }

    function  showInformationUser(data){
      const toggleInformation = document.querySelectorAll(".toggleInformation");
      const buttonPlus = document.querySelectorAll(".buttonPlus");
      const buttonLess = document.querySelectorAll(".buttonLess");
      const boxUserInformation = document.querySelectorAll(".boxUserInformation");
      boxUserInformation[data].classList.toggle("showHide");
      buttonPlus[data].classList.toggle("hideShow");
      buttonLess[data].classList.toggle("showHide");
    }


</script>
