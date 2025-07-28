<style media="screen">
  .messageBackground{
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 100;
  }
  .relative{
    position: relative;
  }
  .message{
    position: relative;
    width: 300px;
    height: 200px;
    background-color: rgba(225, 228, 235, 0.9);
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    box-shadow: 0px 0px 3px black;
  }
  .headMessage{
    position: relative;
    height: 20%;
    width: 100%;
    background-color: rgba(47, 69, 96, 0.9);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .headMessage img{
    filter: drop-shadow(2px 2px 0px black);
  }
  .logoMessage{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 30%;
    left: 100px;
  }
  .closeMessage{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 30%;
    right: 10px;
    filter: drop-shadow(1px 1px 0px black);
    cursor: pointer;
  }
  .closeMessage:hover{
    filter: drop-shadow(2px 2px 0px black);
  }
  .closeMessage:active{
    filter: drop-shadow(1px 1px 0px black);
  }
  .headMessage h2{
    position: relative;
    left: 10px;
    margin: 0;
    padding: 0;
    font-size: 1.1em;
    color: white;
    font-weight: 300;
    top: 50%;
    transform: translateY(-50%);
    text-shadow: 2px 2px 2px black;
  }
  .bodyMessage{
    position: relative;
    height: 50%;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    text-align: center;
    color: black;

    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
  }
  .bodyMessage p{
    position: relative;
    font-weight: 400;
    font-size: 1em;
    width: 90%;
  }
  .footerMessage{
    position: relative;
    width: 100%;
    height: 30%;

    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: row;
  }

</style>

<section id="messageSection">
  <div class="messageBackground">
    <div class="relative">
      <div class="message">
        <div class="headMessage">
          <h2>Promoflow</h2>
          <img  src="../0-Messages/Images/Logo.png" alt="" class="logoMessage">
          <img src="../0-Messages/Images/Close.png" alt="" class="closeMessage" id="closeMessage">
        </div>
        <div class="bodyMessage">
          <p id="textMessages">Lorem ipsum dolor sit , Lorem ipsu ipsumolor sit amet,olor sit amet,Lorem ipsumd.</p>
        </div>
        <div class="footerMessage">
          <button class="buttonSelected optionDeleteSelected" id="button1Message" type="" name="button">Create</botton>
          <button class="buttonSelected optionDeleteSelected" id="button2Message" type="" name="button">Create</botton>
        </div>
      </div>
    </div>
  </div>
</section>


<script type="text/javascript">
  var closeMessage = document.getElementById("closeMessage");
  var messageSection = document.getElementById("messageSection");
  var textMessages = document.getElementById("textMessages");
  var button1Message = document.getElementById("button1Message");
  var button2Message = document.getElementById("button2Message");
  var buttonSelected = document.querySelectorAll(".buttonSelected");
  messageSection.style.display = "none";
  closeMessage.addEventListener("click" , function (){
    messageSection.style.display = "none";
  })

  for (let i = 0; i < buttonSelected.length; i++) {
    buttonSelected[i].addEventListener("click", function(){
      messageSection.style.display = "none";
    })
  }

function message(noButton, nameButton1, nameButton2, message){
  button2Message.style.display = "block";


    messageSection.style.display = "block";
  if (noButton == 2) {
    button1Message.innerHTML = nameButton1;
    button2Message.innerHTML = nameButton2;
  }
  else if (noButton == 1) {
    button1Message.innerHTML = nameButton1;
    button2Message.style.display = "none";
  }
  textMessages.innerHTML = message;
}

</script>
