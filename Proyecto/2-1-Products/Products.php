<style media="screen">
  .containerItemsCategory{
    position: relative;
    width: 100%;
  }
  .itemCategory{
    position: relative;
    width: 100%;
    height: 40px;
    background-color: #2F4560;
    border: 1px solid black;
  }
  .itemCategory h3{
    position: relative;
    text-align: center;
    color: rgba(255, 255, 255, .9);
    top: 50%;
    transform: translateY(-50%);
    font-size: 1em;
    font-weight: 400;
  }
  .openToggleSubitemCategory{
    position: absolute;
    width: 40px;
    height: 100%;
    top: 0px;
    right: 0px;
  }
  .buttonPlusCategory {
    position: absolute;
    width: 25px;
    height: 21px;
    top:50%;
    right:10px;
    transform: translateY(-50%);
    cursor: pointer;
    }
  .buttonLessCategory{
    position: absolute;
    width: 25px;
    height: 11px;
    top:50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    display: none;
    }





    .containerItemGroup{
      position: relative;
      width: 100%;
    }
    .itemGroup{
      position: relative;
      width: 100%;
      padding: 4px;
      background-color: #55677D;
      border: 1px solid black;
    }
    .itemGroup h3{
      position: relative;
      text-align: center;
      width: 68%;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, .8);
      font-size: 1em;
      font-weight: 400;
    }
    .openToggleSubitemGroup{
      position: absolute;
      width: 30px;
      height: 100%;
      top: 0px;
      right: 10px;
    }
    .buttonLessGroup{
      position: absolute;
      width: 14px;
      height: 8px;
      top:50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      display: none;
      }
    .buttonPlusGroup {
      position: absolute;
      width: 14px;
      height: 18px;
      top:50%;
      right:10px;
      transform: translateY(-50%);
      cursor: pointer;
      }




      .containerItemProduct{
        position: relative;
        width: 100%;
      }
      .itemProduct{
        position: relative;
        width: 100%;
        padding: 4px;
        background-color: #7B899A;
        border: 1px solid black;
      }
      .itemProduct h3{
        position: relative;
        text-align: center;
        width: 85%;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255, 255, 255, .8);
        font-size: 1em;
        font-weight: 300;
      }
      .openToggleSubitemProduct{
        position: absolute;
        width: 30px;
        height: 100%;
        right: 10px;
        top: 0px;
      }
      .buttonPlusProduct {
        position: absolute;
        width: 15px;
        height: 21px;
        top:50%;
        right:10px;
        transform: translateY(-50%);
        cursor: pointer;
        }
      .buttonLessProduct{
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







        .containerItemProductContent{
          position: relative;
          width: 100%;
        }
        .itemProductContent{
          position: relative;
          width: 100%;
          padding: 4px;
          background-color: #A0AAB7;
          border: 1px solid black;
        }
        .itemProductContent h3{
          position: relative;
          text-align: center;
          width: 80%;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, .8);
          font-size: 1em;
          font-weight: 300;
          overflow-x: scroll;
        }
        .openToggleSubitemProductContent{
          position: absolute;
          width: 30px;
          height: 100%;
          top: 0px;
          right: 10px;
        }
        .buttonPlusProductContent {
          position: absolute;
          width: 14px;
          height: 15px;
          top:50%;
          right:10px;
          transform: translateY(-50%);
          cursor: pointer;
          }
        .buttonLessProductContent{
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

</style>
<div class="containerTableW3P">
  <div id="containersItemsCategory"  class="containerCenterTable">
  </div>
</div>
<script type="text/javascript">
var noCurrentGroup = 0;
getCategories();

/*----------------------  Get Categories from Database  -----------------------*/

  function getCategories(){
    var containersItemsCategory = document.getElementById("containersItemsCategory");

    $.ajax( "../App/Controller/Controller2.php", {
           type: 'post',
           async: false,
           data: {
             module: "getCategories"
                   },
           success: function(data){
            containersItemsCategory.innerHTML =  "";
            var data = jQuery.parseJSON(data);
            for (var i = 0; i < data.length; i++) {
              console.log("Category:  " +  data[i]["name"]);
              createCategories(data[i]["code"], data[i]["name"], i);
            }
            }
          })
  }


/*---------------------------  Create categories  ----------------------------*/

  function createCategories(code, name, noDivCategory) {
    var containersItemsCategory = document.getElementById("containersItemsCategory");
    name  = name.replace("Category", "");
    containersItemsCategory.innerHTML +=
    '<div class="containerItemsCategory">'+
        '<div class="itemCategory">'+
          '<h3> '+ name +'</h3>'+
          '<div class="openToggleSubitemCategory" onclick="showCategories(\'' + noDivCategory  + '\');" >'+
            '<img  class="buttonPlusCategory"src="../2-2-Orders/Images/mas.png" alt="">'+
            '<img  class="buttonLessCategory"src="../2-2-Orders/Images/menos.png" alt="">'+
          '</div>'+
        '</div>'+
        '<div class="containersItemGroup">'+
        '</div>'+
      '</div>';
    //  alert("hahah: " +noCurrentGroup);

      getGroups(code, noDivCategory);
      showCategories(noDivCategory);
      showCategories(noDivCategory);
  }


  function showCategories(noDivCategory){
    const buttonPlusCategory =  document.querySelectorAll(".buttonPlusCategory");
    const buttonLessCategory =  document.querySelectorAll(".buttonLessCategory");
    const containersItemGroup =  document.querySelectorAll(".containersItemGroup");

    if (buttonPlusCategory[noDivCategory].style.display == "none" ) {
      buttonPlusCategory[noDivCategory].style.display = "block";
      buttonLessCategory[noDivCategory].style.display = "none";
      containersItemGroup[noDivCategory].style.display = "none";

    }else {
      buttonPlusCategory[noDivCategory].style.display = "none";
      buttonLessCategory[noDivCategory].style.display = "block";
      containersItemGroup[noDivCategory].style.display = "block";
    }
  }

/*--------------------------------  Get groups  ------------------------------*/
  function getGroups(code, noDivCategory){
      const containersItemGroup = document.querySelectorAll(".containersItemGroup");
      $.ajax( "../App/Controller/Controller2.php", {
           type: 'post',
           async: false,
           data: {
             module: "getGroups",
             id: code
                   },
           success: function(data){
              containersItemGroup[noDivCategory].innerHTML =  '';
              var data = jQuery.parseJSON(data);
              for (var i = 0; i < data.length; i++) {
            //    alert("Get Groups: " + data[i]["code"] + noCurrentGroup );
                console.log("Group:  " +  data[i]["name"]);
                createGroup(data[i]["code"], data[i]["name"], noDivCategory);



              }
          }
      })
  }


/*-------------------------------  Create groups  ----------------------------*/

  function createGroup(codeG, nameG, noDivCategory) {
  //  alert("Create Groups: " + codeG + noDivGroup);

    const containersItemGroup = document.querySelectorAll(".containersItemGroup");
      containersItemGroup[noDivCategory].innerHTML +=
      '<div class="containerItemGroup">'+
        '<div class="itemGroup">'+
           '<h3> '+ nameG +'</h3>'+
           '<div class="openToggleSubitemGroup" onclick="showGroups(\'' + noCurrentGroup  + '\');" >'+
             '<img  class="buttonPlusGroup"src="../2-2-Orders/Images/mas.png" alt="">'+
             '<img  class="buttonLessGroup"src="../2-2-Orders/Images/menos.png" alt="">'+
           '</div>'+
          '</div>'+
          '<div class="containersItemProduct">'+
        '</div>'+
      '</div>';
      getProducts(codeG);
      showGroups(noCurrentGroup);
      showGroups(noCurrentGroup);
      noCurrentGroup = noCurrentGroup + 1;

   }

   function showGroups(noCurrentGroup){
     const buttonPlusGroup =  document.querySelectorAll(".buttonPlusGroup");
     const buttonLessGroup =  document.querySelectorAll(".buttonLessGroup");
     const containersItemProduct =  document.querySelectorAll(".containersItemProduct");

     if (buttonPlusGroup[noCurrentGroup].style.display == "none" ) {
       buttonPlusGroup[noCurrentGroup].style.display = "block";
       buttonLessGroup[noCurrentGroup].style.display = "none";
       containersItemProduct[noCurrentGroup].style.display = "none";

     }else {
       buttonPlusGroup[noCurrentGroup].style.display = "none";
       buttonLessGroup[noCurrentGroup].style.display = "block";
       containersItemProduct[noCurrentGroup].style.display = "block";
     }
   }


/*--------------------------------  Get products  ----------------------------*/

  function getProducts(codeG){
  //  alert("Group: " + codeG + noDivGroup);
    const containersItemProduct = document.querySelectorAll(".containersItemProduct");
    $.ajax( "../App/Controller/Controller2.php", {
           type: 'post',
           async: false,
           data: {
             module: "getProducts",
             id: codeG
                   },
           success: function(dataP){
              containersItemProduct[noCurrentGroup].innerHTML =  '';
              var dataP = jQuery.parseJSON(dataP);
              for (var i = 0; i < dataP.length; i++) {
                console.log("Product:  " +  dataP[i]["name"]   + "Number group: " + noCurrentGroup);
                createProduct(dataP[i]["id"], dataP[i]["name"], i);
              }
          }
      })
  }


/*-----------------------------  Create products  ----------------------------*/

  function createProduct(codeP, nameP, noDivProduct) {
    const containersItemProduct = document.querySelectorAll(".containersItemProduct");
    containersItemProduct[noCurrentGroup].innerHTML +=
    '<div class="containerItemProduct">'+
        '<div class="itemProduct">'+
          '<h3> '+ nameP +'</h3>'+
          '<div class="openToggleSubitemProduct"  >'
          '</div>'+
        '</div>'+
        '<div class="containersItemProduct">'+
        '</div>'+
      '</div>';
    }



    /*
    select
        `product_group`.code AS 'GROUP CODE', `product_group`.name AS 'GROUP',  `product`.id AS 'PRODUCT CODE', `product`.name AS 'PRODUCT'
    from
        `product`
    inner join `product_group`
        on `product`.code = `product_group`.code

    ORDER BY  `product_group`.name
    */


</script>
