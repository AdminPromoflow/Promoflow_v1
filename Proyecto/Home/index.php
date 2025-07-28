<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

  </head>
  <body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>

    <style media="screen">
 
    </style>

    <section class="Login">
      <div  id="spanLoading" class="spanLoading ">
        <span style="--i:1;"></span>
        <span style="--i:2;"></span>
        <span style="--i:3;"></span>
        <span style="--i:4;"></span>
        <span style="--i:5;"></span>
        <span style="--i:6;"></span>
        <span style="--i:7;"></span>
        <span style="--i:8;"></span>
        <span style="--i:9;"></span>
        <span style="--i:10;"></span>
        <span style="--i:11;"></span>
        <span style="--i:12;"></span>
        <span style="--i:13;"></span>
        <span style="--i:14;"></span>
        <span style="--i:15;"></span>
      </div>
      <div class="menuLogin">
        <h1>Promoflow</h1>
        <img src="Images/Logo.png" alt="">
      </div>
      <div class="bodyLogin">
        <div class="boxLogin">
          <div class="boxLogin2">
            <div class="contentLogin">
              <br>
              <h1>Log in</h1>
              <h4>Please provide your email and password to access the system.</h4>
              <br>
              <h4>Email:</h4>
              <input class="data" id="emailData" type="text" name="" >
              <h4>Password:</h4>
              <input class="data" id="passwordData" type="password" name="" >
              <div id="access" class="contactTitle">
                <h3>Access</h3>
              </div>
              <br>
              <h5 id="wrongPassword">The login credentials you entered are incorrect. Please try again</h5>
            </div>
          </div>
          <div class="boxLogin2">
            <img src="Images/IanLoginPIcture.png" alt="">
            <h3>Your product management interface is ready for you.</h3>
          </div>
        </div>
      </div>
    </section>


    <script type="text/javascript">
    var access = document.getElementById('access');
    var data = document.getElementsByClassName('data');

    var wrongPassword = document.getElementById("wrongPassword").style;

    wrongPassword.display = "none";

    var spanLoading = document.getElementById("spanLoading").style;
    spanLoading.display = "none";


    access.addEventListener("click", function(){
      login();
    })

    document.querySelector('#passwordData').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          login();
        }
    });

    function login(){
      spanLoading.display = "block";
          $.ajax( "../App/Controller/Controller2.php", {
          type: 'post',
          async: false,
          data: {
            module: "loginUser",
            email: data[0].value,
            password: data[1].value
          },
          success: function(data){
          //  alert(data);

            var data = jQuery.parseJSON(data);
        //    alert(data["COUNT(*)"]);
            if (data["COUNT(*)"]==1) {
              window.open("../Dashboard/", "_self");
            }
            else{
              setTimeout(function() {
                  //your code to be executed after 1 second
              }, 3);
              wrongPassword.display = "block";
              spanLoading.display = "none";
            }
         }
        }
      )
    }
    </script>

  </body>
</html>
