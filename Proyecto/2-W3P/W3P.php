<div class="bodyLogin">
  <br><br>

  <!--  Navigator   -->




  <div class="navigateTable">
    <img id="leftArrowW3P" src="Images/arrow.png" alt="">
    <div class="textNavigatorTable">
      <h3>Products</h3>
    </div>
    <div class="textNavigatorTable">
      <h3>Orders</h3>
    </div>
    <div class="textNavigatorTable">
      <h3>ToSendPO</h3>
    </div>

    <img id="rightArrowW3P" src="Images/arrow.png" alt="">
  </div>

  <br><br>



  <?php include "../2-1-Products/Products.php" ?>
  <?php include "../2-2-Orders/Orders.php" ?>
  <?php include "../2-3-ToSendPO/ToSendPO.php" ?>


<script type="text/javascript">



            /* Move table with arrows */

/* Declaration of variables*/
var leftArrowW3P = document.getElementById('leftArrowW3P');
var rightArrowW3P = document.getElementById('rightArrowW3P');
const textNavigatorTable = document.querySelectorAll(".textNavigatorTable");
const containerTableW3P = document.querySelectorAll(".containerTableW3P");

var indexTableOn = 0;

getOrders();
getToSendPO();
//getCustomers();



/*Turn on the first layer*/
textNavigatorTable[indexTableOn].style.display = "block";
containerTableW3P[indexTableOn].style.display = "block";


/*Event for click left*/
leftArrowW3P.addEventListener("click", function(){
 textNavigatorTable[indexTableOn].style.display = "none"; // Turn off current layer
 containerTableW3P[indexTableOn].style.display = "none"; // Turn off current layer


   if (indexTableOn != 0) { //If layers its not 0
     indexTableOn = indexTableOn - 1;
     textNavigatorTable[indexTableOn].style.display = "block";
     containerTableW3P[indexTableOn].style.display = "block";
   }
   else {
     indexTableOn = containerTableW3P.length - 1; //If layers it's  0
     textNavigatorTable[indexTableOn].style.display = "block";
     containerTableW3P[indexTableOn].style.display = "block";
   }
   if (indexTableOn == 1) {

   }
})


/*Event for click right*/
rightArrowW3P.addEventListener("click", function(){
 textNavigatorTable[indexTableOn].style.display = "none"; // Turn off current layer
 containerTableW3P[indexTableOn].style.display = "none"; // Turn off current layer


   if (indexTableOn != containerTableW3P.length -1) {  //If layers it's not 3
     indexTableOn = indexTableOn + 1;
     textNavigatorTable[indexTableOn].style.display = "block";
     containerTableW3P[indexTableOn].style.display = "block";
   }
   else {//If layers it's  3
     indexTableOn = 0;
     textNavigatorTable[indexTableOn].style.display = "block";
     containerTableW3P[indexTableOn].style.display = "block";
   }
   if (indexTableOn == 1) {

   }
})
</script>
