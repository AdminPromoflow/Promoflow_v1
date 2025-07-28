<style media="screen">
.redBorder{
  border: 3px solid rgba(162, 22, 15, 1) ;
}
.asterisk{
  position: absolute;
  top: 52%;
  left: 0px;
  height: 8px;
  display: block;
}

</style>

<div class="ContainerCRUD">
  <div class="containerCRUDTitle">
      <h2 id="">Create user</h2>
  </div>
  <div id="formCreate" class="formUpdate">
   <br><br>
    <div class="inputFormUpdate">
      <label for="updateName">Name</label>
      <input type="text" name="" placeholder="Enter the name " value="" id="createName">
        <img class="asterisk" src="../1-1-Create/Asterisk.png" alt="">
    </div>
    <div class="inputFormUpdate">
      <label for="updateName">Email</label>
      <input type="text" name="" placeholder="Enter the email "value="" id="createEmail">
      <img class="asterisk" src="../1-1-Create/Asterisk.png" alt="">
    </div>
    <div class="inputFormUpdate">
      <label for="updateName">Password</label>
      <input type="text" name="" placeholder="Enter the password  " value="" id="createPassword">
      <img class="asterisk" src="../1-1-Create/Asterisk.png" alt="">
    </div>
    <div class="inputFormUpdate">
      <label for="updateName">Type of user</label>
      <input type="text" name="" placeholder="Enter the user type " value="Admin" id="createUserType" disabled>
    </div>
    <div class="inputFormUpdate">
      <button id="clickCreate" type="button" name="button">Create</button>
   </div>
  </div>
</div>
<script type="text/javascript">
  var createName = document.getElementById("createName");
  var createEmail = document.getElementById("createEmail");
  var createPassword = document.getElementById("createPassword");
  var createUserType = document.getElementById("createUserType");
  var clickCreate = document.getElementById("clickCreate");
  const asterisk = document.querySelectorAll(".asterisk");
  for (var i = 0; i < asterisk.length; i++) {
    asterisk[i].style.display = "none";
  }

  document.querySelector('#formCreate').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        createUser();
      }
  });

  clickCreate.addEventListener("click", function(){
    createUser();
  })
  function createUser(){
    for (let i = 0; i < buttonSelected.length; i++) {
        buttonSelected[i].classList.remove("optionDeleteSelected");
    }
    if (verifyForm(createName.value, createEmail.value, createPassword.value)[0] == 1) {
      $.ajax( "../App/Controller/Controller2.php", {
             type: 'post',
             async: false,
             data: {
               module: "createUser",
               name: createName.value,
               email: createEmail.value,
               password: createPassword.value,
               userType: createUserType.value
                     },
             success: function(data){
              // alert(data);
               if (data == 0) {

                  message(1, "Ok", "button2", "The user has been created");

                  messageSection.style.display = "block";

                  createName.value = "";
                  createEmail.value = "";
                  createPassword.value = "";

                  createName.classList.remove("redBorder");
                  asterisk[0].style.display = "none";

                  createEmail.classList.remove("redBorder");
                  asterisk[1].style.display = "none";

                  createPassword.classList.remove("redBorder");
                  asterisk[2].style.display = "none";

                  openReadPanel();
               }
               else if (data == 1) {
                 message(1, "Ok", "button2", "The user cannot be created as they already exist.");
                 createName.classList.add("redBorder");
                 asterisk[0].style.display = "block";

                 createEmail.classList.add("redBorder");
                 asterisk[1].style.display = "block";

                 createPassword.classList.add("redBorder");
                 asterisk[2].style.display = "block";
               }

            }
           }
          )
    }
    else {
    if (verifyForm(createName.value, createEmail.value, createPassword.value)[2] == 3) {
      createName.classList.add("redBorder");
      asterisk[0].style.display = "block";

      createEmail.classList.add("redBorder");
      asterisk[1].style.display = "block";

      createPassword.classList.add("redBorder");
      asterisk[2].style.display = "block";
    }
    else if (verifyForm(createName.value, createEmail.value, createPassword.value)[2] == 1) {
      createEmail.classList.add("redBorder");
      asterisk[1].style.display = "block";
    }

    message(1, "Ok", "", verifyForm(createName.value, createEmail.value, createPassword.value)[1]);

  }

  }

</script>
