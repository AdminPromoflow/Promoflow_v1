<style media="screen">

    .containerItemsOrder{
      position: relative;
      width: 100%;
    }
    .itemOrder{
      position: relative;
      width: 100%;
      height: 40px;
      background-color: #2F4560;
      border: 1px solid black;
    }
    .itemOrder h3{
      position: relative;
      text-align: center;
      color: rgba(255, 255, 255, .9);
      top: 50%;
      transform: translateY(-50%);
      font-size: 1em;
      font-weight: 400;
    }
    .openToggleSubitemOrder{
      position: absolute;
      width: 40px;
      height: 100%;
      top: 0px;
      right: 0px;
    }
    .buttonPlusOrder {
      position: absolute;
      width: 25px;
      height: 21px;
      top:50%;
      right:10px;
      transform: translateY(-50%);
      cursor: pointer;
      }
    .buttonLessOrder{
      position: absolute;
      width: 25px;
      height: 11px;
      top:50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      display: none;
      }


    .containerItemJob{
      position: relative;
      width: 100%;
    }
    .itemJob{
      position: relative;
      width: 100%;
      padding: 4px;
      background-color: #55677D;
      border: 1px solid black;
    }
    .itemJob h3{
      position: relative;
      text-align: center;
      color: rgba(255, 255, 255, .8);
      font-size: 1em;
      font-weight: 400;
    }
    .openToggleSubitemJob{
      position: absolute;
      width: 30px;
      height: 100%;
      top: 0px;
      right: 10px;
    }
    .buttonLessJob{
      position: absolute;
      width: 17px;
      height: 11px;
      top:50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      display: none;
      }
    .buttonPlusJob {
      position: absolute;
      width: 17px;
      height: 21px;
      top:50%;
      right:10px;
      transform: translateY(-50%);
      cursor: pointer;
      }


    .containerItemContent{
      position: relative;
      width: 100%;
    }
    .itemContent{
      position: relative;
      width: 100%;
      padding: 4px;
      background-color: #7B899A;
      border: 1px solid black;
    }
    .itemContent h3{
      position: relative;
      text-align: left;
      width: 85%;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, .8);
      font-size: 1em;
      font-weight: 300;
    }
    .openToggleSubitemContent{
      position: absolute;
      width: 30px;
      height: 100%;
      right: 10px;
      top: 0px;
    }
    .buttonPlusContent {
      position: absolute;
      width: 15px;
      height: 21px;
      top:50%;
      right:10px;
      transform: translateY(-50%);
      cursor: pointer;
      }
    .buttonLessContent{
      position: absolute;
      width: 15px;
      height: 11px;
      top:50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      display: none;
      }
      .blueColor{
        font-weight: 500;
        color: #2F4560;
        font-size: 1.1em;
      }


    .containerItemContentL2{
      position: relative;
      width: 100%;
    }
    .itemContentL2{
      position: relative;
      width: 100%;
      padding: 4px;
      background-color: #A0AAB7;
      border: 1px solid black;
    }
    .itemContentL2 h3{
      position: relative;
      text-align: left;
      width: 80%;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, .8);
      font-size: 1em;
      font-weight: 300;
      overflow-x: scroll;
    }
    .openToggleSubitemContentL2{
      position: absolute;
      width: 30px;
      height: 100%;
      top: 0px;
      right: 10px;
    }
    .buttonPlusContentL2 {
      position: absolute;
      width: 14px;
      height: 15px;
      top:50%;
      right:10px;
      transform: translateY(-50%);
      cursor: pointer;
      }
    .buttonLessContentL2{
      position: absolute;
      width: 14px;
      height: 15px;
      top:50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      display: none;
      }


      .blackColor{
      color: #CFD4DA;
      }


      .containerItemContentL3{
        position: relative;
        width: 100%;
      }
      .itemContentL3{
        position: relative;
        width: 100%;
        padding: 4px;
        background-color: #C6CCD4;
        border: 1px solid black;
      }
      .itemContentL3 h3{
        position: relative;
        text-align: left;
        width: 75%;
        left: 50%;
        transform: translateX(-50%);
        color: #2F4560;
        font-size: 1em;
        font-weight: 300;
        overflow-x: scroll;
      }
      .openToggleSubitemContentL3{
        position: absolute;
        width: 30px;
        height: 100%;
        top: 0px;
        right: 10px;
      }
      .buttonPlusContentL3 {
        position: absolute;
        width: 14px;
        height: 15px;
        top:50%;
        right:10px;
        transform: translateY(-50%);
        cursor: pointer;
        }
      .buttonLessContentL3{
        position: absolute;
        width: 14px;
        height: 15px;
        top:50%;
        right: 10px;
        transform: translateY(-50%);
        cursor: pointer;
        display: none;
        }
    .width600{
      font-weight: 600;
    }

</style>

<div class="containerTableW3P">
  <div id="containerOrders" class="containerCenterTable">
  </div>
</div>

<script type="text/javascript">

  /*--------------------------  Get orders from API  ---------------------------*/

    function getOrders(){
      var containerOrders = document.getElementById("containerOrders");
      $.ajax( "../App/Controller/Controller2.php", {
             type: 'post',
             async: false,
             data: {
               module: "getOrders"
                     },
             success: function(data){
               //alert(data);
              console.log(data);
              var data = jQuery.parseJSON(data);
              containerOrders.innerHTML  = "";
             for (var i = 0; i < data["runs"].length; i++) { // Create each orders
                createOrders(data["runs"][i]["id"],  data["runs"][i]["created_date"], i);
              }

              }
            })
     }


  /*-----------------------------  Create orders  ------------------------------*/

    function createOrders(idOrder, dateOrder, noDivOrder){
      var containerOrders = document.getElementById("containerOrders");

      containerOrders.innerHTML +=
      '<div class="containerItemsOrder">' +
        '<div class="itemOrder">' +
          '<h3>Order: '+ dateOrder +'</h3>' +
          '<div class="openToggleSubitemOrder" onclick="showJobs(\'' + noDivOrder  + '\');" >' +
            '<img  class="buttonPlusOrder"src="../2-2-Orders/Images/mas.png" alt="">' +
            '<img  class="buttonLessOrder"src="../2-2-Orders/Images/menos.png" alt="">' +
          '</div>' +
        '</div>' +
        '<div class="containersItemJob">' +
        '</div>' +
      '</div>'
      ;

      getJobs(noDivOrder, idOrder);  //Create jobs
      showJobs(noDivOrder); //Show all the jobs
      showJobs(noDivOrder); //Hide all jobs --> we have twice this function of hide all

    }


  /*-------------------------  Show jobs of each job  --------------------------*/

    function showJobs(noDivOrder){
      const buttonPlusOrder =  document.querySelectorAll(".buttonPlusOrder");
      const buttonLessOrder =  document.querySelectorAll(".buttonLessOrder");
      const containersItemJob =  document.querySelectorAll(".containersItemJob");

      if (buttonPlusOrder[noDivOrder].style.display == "none" ) {
        buttonPlusOrder[noDivOrder].style.display = "block";
        buttonLessOrder[noDivOrder].style.display = "none";
        containersItemJob[noDivOrder].style.display = "none";

      }else {
        buttonPlusOrder[noDivOrder].style.display = "none";
        buttonLessOrder[noDivOrder].style.display = "block";
        containersItemJob[noDivOrder].style.display = "block";
      }
    }


  /*---------------------------  Get jobs from API  ----------------------------*/

    var dataJob;
    function getJobs(noDivOrder, idOrder){
      const containersItemJob =  document.querySelectorAll(".containersItemJob");

        $.ajax( "../App/Controller/Controller2.php", {
               type: 'post',
               async: false,
               data: {
                 module: "getOrdersContent",
                 idOrder: idOrder
                       },
               success: function(data){
                 console.log(data);

              //  alert(data);
                var data = jQuery.parseJSON(data);
                dataJob =  data["jobs"];
                containersItemJob[noDivOrder].innerHTML = '';

                for (var i = 0; i < data["jobs"].length; i++) {
                   createJobs(noDivOrder, i);
                }
                }
              })
    }


  /*------------------------------  Create jobs  -------------------------------*/

    var noDivJobSelected = 0;
    function createJobs(noDivOrder, noDivJob){
      const containersItemJob =  document.querySelectorAll(".containersItemJob");

      containersItemJob[noDivOrder].innerHTML +=
      '<div class="containerItemJob">' +
        '<div class="itemJob">' +
          '<h3>Job: ' +  (noDivJob +1) +'</h3>' +
          '<div class="openToggleSubitemJob"  onclick="showContent(\'' + noDivJobSelected + '\');" >' + //onclick="createContent(\'' + numberDivJob + '\',\'' + numberJobOn + '\');"
            '<img  class="buttonPlusJob"src="../2-2-Orders/Images/mas.png" alt="">' +
            '<img  class="buttonLessJob"src="../2-2-Orders/Images/menos.png" alt="">' +
          '</div>' +
        '</div>' +
        '<div class="containersItemsContent">' +
        '</div>' +
      '</div>'
      ;


      getContent(noDivJob,  noDivJobSelected);  //Create content
      showContent(noDivJobSelected); //Show all the content
      showContent(noDivJobSelected); //Hide all content --> we have twice this function of hide all
      noDivJobSelected = noDivJobSelected + 1;

    }


  /*-----------------------  Show jobs of each Content  ------------------------*/

    function showContent(noDivJobSelected){

      const buttonPlusJob =  document.querySelectorAll(".buttonPlusJob");
      const buttonLessJob =  document.querySelectorAll(".buttonLessJob");
      const containersItemsContent =  document.querySelectorAll(".containersItemsContent");


      if (buttonPlusJob[noDivJobSelected].style.display == "none" ) {
        buttonPlusJob[noDivJobSelected].style.display = "block";
        buttonLessJob[noDivJobSelected].style.display = "none";
        containersItemsContent[noDivJobSelected].style.display = "none";

      }else {
        buttonPlusJob[noDivJobSelected].style.display = "none";
        buttonLessJob[noDivJobSelected].style.display = "block";
        containersItemsContent[noDivJobSelected].style.display = "block";
      }
    }


  /*---------------------------  Get content's job  ----------------------------*/

    function getContent(noDivJob, noDivJobSelected){
      const containersItemsContent =  document.querySelectorAll(".containersItemsContent");
      var value;
      var itemHierarchy = "";

      for(let key in dataJob[noDivJob]) {
        value = checkHierarchyOnContent((dataJob[noDivJob][key]+""),  noDivJobSelected)["value"];
        itemHierarchy =  checkHierarchyOnContent((dataJob[noDivJob][key]+""),  noDivJobSelected)["itemHierarchy"];

        createContent(noDivJob, key, value, noDivJobSelected,  itemHierarchy, noDivContentSelected);
      }
    }


  /*-----------------------  Check Hierarchy on content  -----------------------*/

    function checkHierarchyOnContent(checkValue,  noDivJobSelected){
      var value = "";
      var itemHierarchy = "";


      if (checkValue.substring(1,7) ==  "object") {
        value = "";
        itemHierarchy =  '<div class="openToggleSubitemContent" onclick="showItemsContent(\'' + noDivitemHierarchy + '\',\'' + noDivContentSelected +'\');">' +    //
                          '<img  class="buttonPlusContent"src="../2-2-Orders/Images/mas.png" alt="">' +
                          '<img  class="buttonLessContent"src="../2-2-Orders/Images/menos.png" alt="">' +
                        '</div>'
      }else{
         itemHierarchy = "";
         value = checkValue;
      }

      const checkHierarchyOnContent = [];
      checkHierarchyOnContent["value"] = value;
      checkHierarchyOnContent["itemHierarchy"] = itemHierarchy;

      return checkHierarchyOnContent;
    }


  /*----------------------------  Create contents  -----------------------------*/

    var noDivContentSelected =  0;
    var noDivitemHierarchy = 0;
    function createContent(noDivJob, item, value, noDivJobSelected, itemHierarchy){
      const containersItemsContent =  document.querySelectorAll(".containersItemsContent");
            containersItemsContent[noDivJobSelected].innerHTML +=
            '<div class="containerItemContent">' +
              '<div class="itemContent">' +
                '<h3>  <strong class="blueColor">'+item+': </strong>' +  value +'</h3>'  +
                itemHierarchy +
              '</div>' +
              '<div class="containersItemsContentL2">' +
              '</div>' +
            '</div>'
            ;

      if (itemHierarchy !=  "") {
        getItemsContent(noDivContentSelected, item, noDivJob);
        showItemsContent(noDivitemHierarchy, noDivContentSelected)
        showItemsContent(noDivitemHierarchy, noDivContentSelected)
        noDivitemHierarchy ++;
      }
      noDivContentSelected =  noDivContentSelected  + 1;

    }


  /*-----------------  Show items items of each content items  -----------------*/

    function showItemsContent(noDivitemHierarchy, noDivContentSelected){
      const buttonPlusContent =  document.querySelectorAll(".buttonPlusContent");
      const buttonLessContent =  document.querySelectorAll(".buttonLessContent");
      const containersItemsContentL2 =  document.querySelectorAll(".containersItemsContentL2");
      if (buttonPlusContent[noDivitemHierarchy].style.display == "none" ) {
      buttonPlusContent[noDivitemHierarchy].style.display = "block";
      buttonLessContent[noDivitemHierarchy].style.display = "none";
      containersItemsContentL2[noDivContentSelected].style.display = "none";
      }else {
        buttonPlusContent[noDivitemHierarchy].style.display = "none";
        buttonLessContent[noDivitemHierarchy].style.display = "block";
        containersItemsContentL2[noDivContentSelected].style.display = "block";
      }
    }


  /*--------------------------  Get items's Content  ---------------------------*/

    var numberDivContentL2 = 0;
    function getItemsContent(noDivContentSelected, nameContentOn , noDivJob){
      const containersItemsContentL2 =  document.querySelectorAll(".containersItemsContentL2");
      containersItemsContentL2[noDivContentSelected].innerHTML = "";

      if (dataJob[noDivJob][nameContentOn].length > 1) {
        for (var i = 0; i < dataJob[noDivJob][nameContentOn].length; i++) {
          createItemsContent1(noDivContentSelected, nameContentOn , i, noDivJob);
          numberDivContentL2  = numberDivContentL2 +1;
        }
      }
      else if (dataJob[noDivJob][nameContentOn].length == 1) {
        for (var i = 0; i < dataJob[noDivJob][nameContentOn].length; i++) {
          for(let key in dataJob[noDivJob][nameContentOn][i]) {
            createItemsContent2(noDivContentSelected, key, dataJob[noDivJob][nameContentOn][i][key]);
            numberDivContentL2  = numberDivContentL2 +1;
          }
        }
      }
      else {
        for(let key in dataJob[noDivJob][nameContentOn]) {
          createItemsContent2(noDivContentSelected, key, dataJob[noDivJob][nameContentOn][key]);
          numberDivContentL2  = numberDivContentL2 +1;
        }
      }
  }


  /*--------------------  Create items's Content Option 1 ----------------------*/

    var numberDivContentL3 = 0;
    function createItemsContent1(noDivContentSelected, nameContentOn , noDivItemsContent,  noDivJob){
      const containersItemsContentL2 =  document.querySelectorAll(".containersItemsContentL2");
      containersItemsContentL2[noDivContentSelected].innerHTML +=
      '<div class="containerItemContentL2">' +
        '<div class="itemContentL2">' +
          '<h3>'+nameContentOn +  (noDivItemsContent+1)+': ' +'</h3>' +
          '<div class="openToggleSubitemContentL2" onclick="showItemsContent2(\'' + numberDivContentL3 +'\');">' +
           '<img  class="buttonPlusContentL2"src="../2-2-Orders/Images/mas.png" alt="">' +
           '<img  class="buttonLessContentL2"src="../2-2-Orders/Images/menos.png" alt="">' +
         '</div>' +
        '</div>' +
        '<div class="containersItemsContentL3">' +
        '</div>' +
      '</div>'
      ;
      showItemsContent2(numberDivContentL3);
      showItemsContent2(numberDivContentL3);
      getContent3(  noDivItemsContent, noDivJob, nameContentOn);
      numberDivContentL3 = numberDivContentL3 +1;
    }


  /*--------------------  Create items's Content Option 2 ----------------------*/

    function createItemsContent2(noDivContentSelected, item , valueItem){
      const containersItemsContentL2 =  document.querySelectorAll(".containersItemsContentL2");
      containersItemsContentL2[noDivContentSelected].innerHTML +=
      '<div class="containerItemContentL2">' +
        '<div class="itemContentL2">' +
          '<h3><strong class="blueColor">'+item +':</strong> '+ valueItem+'</h3>' +
        '</div>' +
      '</div>'
      ;
    }


  /*-----------------  Show items items of each content2 items  ----------------*/

    function showItemsContent2(numberDivContentL3){
      const buttonPlusContentL2 =  document.querySelectorAll(".buttonPlusContentL2");
      const buttonLessContentL2 =  document.querySelectorAll(".buttonLessContentL2");
      const containersItemsContentL3 =  document.querySelectorAll(".containersItemsContentL3");
      if (buttonPlusContentL2[numberDivContentL3].style.display == "none" ) {
      buttonPlusContentL2[numberDivContentL3].style.display = "block";
      buttonLessContentL2[numberDivContentL3].style.display = "none";
      containersItemsContentL3[numberDivContentL3].style.display = "none";
      }else {
        buttonPlusContentL2[numberDivContentL3].style.display = "none";
        buttonLessContentL2[numberDivContentL3].style.display = "block";
        containersItemsContentL3[numberDivContentL3].style.display = "block";
      }
    }


  /*--------------------------  Get items's Content3  --------------------------*/

    function  getContent3(  noDivItemsContent, noDivJob, nameContentOn){

      for (var i = 0; i < dataJob[noDivJob][nameContentOn].length; i++) {
        const containersItemsContentL3 =  document.querySelectorAll(".containersItemsContentL3");
        containersItemsContentL3[numberDivContentL3].innerHTML = "";
        for(let key in dataJob[noDivJob][nameContentOn][i]) {
          createItemsContent3( key , dataJob[noDivJob][nameContentOn][i][key]);
        }
      }
    }


  /*-----------------------  Create items's content 3  -------------------------*/

    function createItemsContent3( item , valueItem){
      const containersItemsContentL3 =  document.querySelectorAll(".containersItemsContentL3");
      console.log(numberDivContentL3);
      containersItemsContentL3[numberDivContentL3].innerHTML +=
      '<div class="containerItemContentL3">' +
        '<div class="itemContentL3">' +
          '<h3> <strong class="blueColor">'+item +': </strong>'+ valueItem+'</h3>' +
        '</div>' +
      '</div>'
      ;
    }

</script>
