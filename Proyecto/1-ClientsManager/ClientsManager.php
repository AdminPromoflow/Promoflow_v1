<style media="screen">


  .containerCRUDTitle{
    position: absolute;
    width: 100%;
    height: 50px;
    top: 0px;
  }

  .containerCRUDTitle h2{
    position: relative;
    color: white;
    font-size: 1.6em;
    font-weight: 500;
    text-align: center;
    margin: 0;
    top: 50%;
    transform: translateY(-50%);
  }


  .ContainerCRUD{
    position: relative;
    padding: 5px;
    display: none;
    background-color: rgba(210, 220, 234, .3);
    width: 80%;
    height: calc(100% - 200px);
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 30px;
  }
  .ContainerCRUD::-webkit-scrollbar {
  width: 1.5em;
  }
  .ContainerCRUD::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  .ContainerCRUD::-webkit-scrollbar-thumb {
  background:rgba(47, 69, 96, 1);
  border: 1px solid black;
}
.formUpdate{
  position: absolute;
  left: 0px;
  top: 50px;
  width: 100%;
  height: 100px;
}
.inputFormUpdate{
  position:relative;
  display: block;
  width: 250px;
  height: 80px;
  margin: 10px 0px;
  left: 50%;
  transform: translateX(-50%);
}
.inputFormUpdate button{
  left: 50%;
  transform: translateX(-55%);
}
.inputFormUpdate label{
  position: relative;
  width: 100%;
  height: 20px;
  display: block;
  text-align: left;
  font-weight: 500;
  font-size: 1.2em;
  padding-left: 22px;
}
.inputFormUpdate input{
  position: relative;
  top: 10px;
  width: 80%;
  height: 35px;
  border-radius: 10px;
  font-weight: 500;
  text-align: center;
  margin: 0!important;
  padding: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1em;
}
.containerCRUDWrap{
position: absolute;
top: 50px;
left: 0px;
width: 100%;
height: 50px;
display: flex;
justify-content: center;
flex-wrap: wrap;
flex-direction: row;
}
.CRUDBoxes{
position: relative;
height: 120px;
width: 160px;
margin: 20px;
cursor: pointer;
}

.RoundBoxes{
position: relative;
width: 100%;
height: 100%;
background-color: rgba(216, 225, 232, 1);
overflow: hidden;
border-radius: 3%;
box-shadow: 2px 2px 3px black, -1px -1px 2px grey;


display: flex;
justify-content: center;
flex-wrap: wrap;
flex-direction: row;
}

.CRUDBoxesLeft{
position: relative;
left: 0px;
top: 0px;
height: 100%;
width: 30%;
background-color:rgba(155, 198, 232, 1);
border-top-left-radius: 50%;
}

.CRUDBoxesRight{
position: relative;
right: 0px;
top: 0px;
height: 100%;
width: 70%;
background-color:rgba(208, 217, 223, 1);
}

.CRUDBoxesLeftTop{
position: relative;
right: 0px;
top: 0px;
height: 10%;
width: 100%;
background-color:rgba(62, 140, 209, 1);
border-top-left-radius: 30%;
}

.CRUDBoxesLeftTopInside{
position: relative;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
height: 20%;
width: 80%;
background-color: white;
border-top-left-radius: 5px;
}

.CRUDBoxesLeftBody{
position: relative;
right: 0px;
top: 0px;
height: 30%;
width: 100%;
background-color:rgba(155, 198, 232, 1);
padding: 15% 0;
}

.CRUDBoxesLeftBodyLine{
position: relative;
height: 7%;
width: 60%;
background-color: white;
margin-bottom: 15%;
margin-left: 10%;
border-radius: 29%;
}

.CRUDBoxesRightName{
position: relative;
left: 50%;
margin-top: 5%;
transform: translateX(-50%);
height: 35%;
width: 75%;
background-color: rgba(103, 135, 229, 1);
border-radius: 15%;
box-shadow: -2px 2px 10px black, -1px -1px 2px grey;

display: flex;
justify-content: center;
flex-wrap: wrap;
flex-direction: row;
align-items: center;
}

.CRUDBoxesRightDown{
position: relative;
left: 50%;
margin-top: 5%;
transform: translateX(-50%);
height: 50%;
width: 75%;
border-radius: 15%;

display: flex;
justify-content: center;
flex-wrap: wrap;
flex-direction: row;
}

.CRUDBoxesRightDownLine{
position: relative;
height: 15%;
width: 80%;
margin-top: 5%;
background-color: rgba(241, 242, 246, 1);
margin-bottom: 3%;
border-radius: 29.5%;
box-shadow: 1px 1px 3px black;

}

.CRUDBoxesRightDownLine:nth-child(3){
background-color: rgba(144, 183, 219, 1);
}

.CRUDBoxesRightDownLineSubline{
position: relative;
height: 7%;
width: 60%;
margin-top: 5%;
background-color: rgba(193, 214, 242, 1);
margin-bottom: 15%;
margin-left: 10%;
border-radius: 10%;
}

.CRUDBoxesRightDownLine:nth-child(1) .CRUDBoxesRightDownLineSubline{
background-color: rgba(193, 214, 242, 1);
width: 50%;
}
.CRUDBoxesRightDownLine:nth-child(2) .CRUDBoxesRightDownLineSubline{
background-color: rgba(193, 214, 242, 1);
width: 35%;
}
.CRUDBoxesRightDownLine:nth-child(3) .CRUDBoxesRightDownLineSubline{
background-color: rgba(193, 214, 242, 1);
width: 50%;
left: 50%;
transform: translateX(-50%);
}
.CRUDBoxesRightName h3{
position: relative;
width: 90%;
font-size: 80%;
margin: 0;
text-align: center;
color: white;
text-shadow: 2px 2px 3px black;
}
.BottonCRUDUpdate{
position: absolute;
width: 35%;
height:45%;
top: 50%;
left: -12%;
border-radius: 20%;
background-color: rgba(225, 228, 235, 1);
box-shadow: 2px 2px 3px black, -1px -1px 2px grey;
}

.relative{
position: relative;
height: 100%;
width: 100%;
}

.BottonCRUDUpdate img{
position: relative;
height: 60%;
width: 70%;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
cursor: pointer;
transition: 0.4s;
}
.CRUDBoxes:hover > .BottonCRUDUpdate img{
filter: drop-shadow(3px 3px 5px Black);
}
.CRUDBoxes:active > .BottonCRUDUpdate img{
filter: drop-shadow(0px 0px 3px Black);
}

</style>

<?php include "../0-Messages/Messages.php" ?>
  <section class="bodyLogin">
    <h2 class="titleBodyLogin">Clients Manager</h2>
    <div class="containerUsersManagerBottoms">

      <div class="itemUsersManager">
        <img src="../1-ClientsManager/Images/create.png" alt="">
        <h3>Create</h3>
      </div>

      <div class="itemUsersManager" id="openRead">
        <img src="../1-ClientsManager/Images/Read.png" alt="">
        <h3>Read</h3>
      </div>

      <div class="itemUsersManager" id="openUpdate">
        <img src="../1-ClientsManager/Images/update.png" alt="">
        <h3>Update</h3>
      </div>

      <div class="itemUsersManager" id="openDelete">
        <img src="../1-ClientsManager/Images/DeleteIcon.png" alt="">
        <h3>Delete</h3>
      </div>

    </div>
    <?php include "../1-1-Create/Create.php" ?>
    <?php include "../1-2-Read/Read.php" ?>
    <?php include "../1-3-Update/Update.php" ?>
    <?php include "../1-4-Delete/Update.php" ?>
  </section>


<script type="text/javascript">
  const itemUsersManager = document.querySelectorAll(".itemUsersManager");
  const ContainerCRUD  = document.querySelectorAll(".ContainerCRUD");
  var onContainer = 0


  for (let i = 0; i < itemUsersManager.length; i++) {
    ContainerCRUD[i].style.display = "none";
    openReadPanel();
    ContainerCRUD[1].style.display = "flex";

    itemUsersManager[i].addEventListener("click", function(){
      if (ContainerCRUD[i].style.display == "none") {
        ContainerCRUD[i].style.display = "flex";
        onContainer = i;

        for (let j = 0; j < itemUsersManager.length; j++) {
          if (j != onContainer ) {
            ContainerCRUD[j].style.display = "none";
          }
        }

      }
    })
  }





 /*Update information of the user*/


 var openUpdate = document.getElementById("openUpdate");
 var containerBoxUsersUpdate = document.getElementById("containerBoxUsersUpdate");
 var formUpdate = document.getElementById("formUpdate");
 formUpdate.style.display = "none";

 openUpdate.addEventListener("click", function(){
   openUpdatePanel();
 })

function openUpdatePanel(){
  $.ajax( "../App/Controller/Controller.php", {
         type: 'post',
         async: false,
         data: {
           module: "getUsers"
                 },
         success: function(data){
           var data = jQuery.parseJSON(data);
           containerBoxUsersUpdate.style.display = "flex";
           formUpdate.style.display = "none";
           setusersUpdate(data);
        }
       }
      )
}






var openDelete = document.getElementById("openDelete");
var containerBoxUsersDelete = document.getElementById("containerBoxUsersDelete");

 openDelete.addEventListener("click", function(){
   openDeletePanel();
 })

 function openDeletePanel(){
   $.ajax( "../App/Controller/Controller.php", {
          type: 'post',
          async: false,
          data: {
            module: "getUsers"
                  },
          success: function(data){
           var data = jQuery.parseJSON(data);

          setUsersDelete(data);

         }
        }
       )
 }





 var containerBoxUsersRead = document.getElementById("containerBoxUsersRead");
 var openRead = document.getElementById("openRead");

  openRead.addEventListener("click", function(){
    openReadPanel();
  })

  function openReadPanel(){
    $.ajax( "../App/Controller/Controller.php", {
           type: 'post',
           async: false,
           data: {
             module: "getUsers"
                   },
           success: function(data){
             var data = jQuery.parseJSON(data);

             containerBoxUsersRead.style.display = "block";
             setUsersRead(data);
             const toggleInformation = document.querySelectorAll(".toggleInformation");
             const buttonPlus = document.querySelectorAll(".buttonPlus");
             const buttonLess = document.querySelectorAll(".buttonLess");
             const boxUserName = document.querySelectorAll(".boxUserName");
             const boxUserInformation = document.querySelectorAll(".boxUserInformation");


             for (let i = 0; i < toggleInformation.length; i++) {
               boxUserInformation[i].classList.toggle("hideShow");
             }

          }
         }
       )
  }

  /*field´s form verification*/
  function verifyForm(name, email, password){
    var answer;
    var message;
    var borderOptions = 0; // 0: No red border, 1: One red border, 3: Three red borders
    if (name == "" || email == "" || password == "") {
       answer = 0;
       message = "It appears that some values are missing, please fill them in";
       borderOption = 3;
    }
    else {
      if (!email.includes("@")) {
        answer = 0;
        message = "Please ensure you have entered a valid email address";
        borderOption = 1;
      }
      else {
        if (!email.includes(".")) {
          answer = 0;
          message = "Please ensure you have entered a valid email address";
          borderOption = 1;
        }
        else {
          answer = 1;
          message = "";
          borderOption = 0;
        }
      }
    }

  const array = [answer, message, borderOption];
    return array;
  }


</script>
