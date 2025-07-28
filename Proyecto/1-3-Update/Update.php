<style media="screen">



</style>
<div class="ContainerCRUD">
  <div class="containerCRUDTitle">
      <h2 id="">Update user</h2>
  </div>
<div class="containerCRUDWrap" id="containerBoxUsersUpdate">
<!--
  <div class="CRUDBoxes">
    <div class="RoundBoxes">
    <div class="CRUDBoxesLeft">
      <div class="CRUDBoxesLeftTop">
        <div class="CRUDBoxesLeftTopInside">
        </div>
      </div>
      <div class="CRUDBoxesLeftBody">
        <div class="CRUDBoxesLeftBodyLine">
        </div>
        <div class="CRUDBoxesLeftBodyLine">
        </div>
        <div class="CRUDBoxesLeftBodyLine">
        </div>
      </div>
    </div>
    <div class="CRUDBoxesRight">
      <div class="CRUDBoxesRightName">
        <h3>CRUD, CRUD, CRUD, CRUD,</h3>
      </div>
      <div class="CRUDBoxesRightDown">
        <div class="CRUDBoxesRightDownLine">
          <div class="CRUDBoxesRightDownLineSubline">
          </div>
        </div>
        <div class="CRUDBoxesRightDownLine">
          <div class="CRUDBoxesRightDownLineSubline">
          </div>
        </div>
        <div class="CRUDBoxesRightDownLine">
          <div class="CRUDBoxesRightDownLineSubline">
          </div>
        </div>
      </div>
    </div>
   </div>
   <div class="BottonCRUDUpdate">
     <div class="relative">
         <img src="../1-3-Update/Images/update.png" alt="">
     </div>
   </div>
  </div>

-->
<br><br>
</div>

<div id="formUpdate" class="formUpdate">
  <br><br>
  <div class="inputFormUpdate">
    <label for="updateName">Name</label>
    <input type="text" name="" value="" id="updateName">
  </div>
  <div class="inputFormUpdate">
    <label for="updateName">Email</label>
    <input type="text" name="" value="" id="updateEmail">
  </div>
  <div class="inputFormUpdate">
    <label for="updateName">Password</label>
    <input type="text" name="" value="" id="updatePassword">
  </div>
  <div class="inputFormUpdate">
    <label for="updateName">Type of user</label>
    <input type="text" name="" id="updateUserType" value="Admin" disabled>
  </div>
  <div class="inputFormUpdate">
    <button id="clickUpdate" type="button" name="button">Update</button>
  </div>
</div>



</div>

<script type="text/javascript">

var updateName = document.getElementById("updateName");
var updateEmail = document.getElementById("updateEmail");
var updatePassword = document.getElementById("updatePassword");
var updateUserType = document.getElementById("updateUserType");
var clickUpdate = document.getElementById("clickUpdate");



function setusersUpdate(data){
  containerBoxUsersUpdate.innerHTML  = "";
     for (var i = 0; i < data.length; i++) {//
       containerBoxUsersUpdate.innerHTML  +=
       '<div onclick="updateUsers(\''+data[i]["idUser"]+'\',  \''+data[i]["name"]+'\',  \''+data[i]["email"]+'\',  \''+data[i]["password"]+'\',  \''+data[i]["userType"]+'\');" id="CRUDBoxesUpdate'+i+'" class="CRUDBoxes">' +
         '<div class="RoundBoxes">' +
         '<div class="CRUDBoxesLeft">' +
           '<div class="CRUDBoxesLeftTop">' +
             '<div class="CRUDBoxesLeftTopInside">' +
             '</div>' +
           '</div>' +
           '<div class="CRUDBoxesLeftBody">' +
             '<div class="CRUDBoxesLeftBodyLine">' +
             '</div>' +
             '<div class="CRUDBoxesLeftBodyLine">' +
            ' </div>' +
             '<div class="CRUDBoxesLeftBodyLine">' +
             '</div>' +
           '</div>' +
         '</div>' +
         '<div class="CRUDBoxesRight">' +
           '<div class="CRUDBoxesRightName">' +
             '<h3>'+data[i]["name"]+'</h3>' +
           '</div>' +
           '<div class="CRUDBoxesRightDown">' +
             '<div class="CRUDBoxesRightDownLine">' +
               '<div class="CRUDBoxesRightDownLineSubline">' +
               '</div>' +
             '</div>' +
            ' <div class="CRUDBoxesRightDownLine">' +
               '<div class="CRUDBoxesRightDownLineSubline">' +
               '</div>' +
             '</div>' +
            ' <div class="CRUDBoxesRightDownLine">' +
               '<div class="CRUDBoxesRightDownLineSubline">' +
               '</div>' +
            ' </div>' +
           '</div>' +
         '</div>' +
        '</div>' +
        '<div class="BottonCRUDUpdate">' +
          '<div class="relative">' +
              '<img src="../1-3-Update/Images/update.png" alt="">' +
          '</div>' +
        '</div>' +
       '</div>'
       ;
     }
  }
var globalIdUser;
  function updateUsers(idUser, name, email, password, userType) {
         containerBoxUsersUpdate.style.display = "none";
         formUpdate.style.display = "block";

         globalIdUser  = idUser;
         updateName.value = name;
         updateEmail.value = email;
         updatePassword.value = password;
         updateUserType.value = userType;
  }

  clickUpdate.addEventListener("click", function(){
    if (verifyForm(updateName.value, updateEmail.value, updatePassword.value)[0] == 1){
    $.ajax( "../App/Controller/Controller2.php", {
           type: 'post',
           async: false,
           data: {
             module: "updateUsers",
             idUser: globalIdUser,
             name: updateName.value,
             email: updateEmail.value,
             password: updatePassword.value,
             userType: updateUserType.value
                   },
           success: function(data){
             message(1, "Ok", "button2", data);
             openUpdatePanel();
          }
         }
        )
      }
      else {
        for (let i = 0; i < buttonSelected.length; i++) {
            buttonSelected[i].classList.remove("optionDeleteSelected");
        }
          message(1, "Ok", "", verifyForm(updateName.value, updateEmail.value, updatePassword.value)[1]);
      }
  })


</script>
