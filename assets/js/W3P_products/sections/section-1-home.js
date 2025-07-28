// Create an instance of the Menu class to handle menu functionality
menuClass.changePathImageOpenLogin(1);
var noCurrentGroup = 0;
getCategories();

/*----------------------  Get Categories from Database  -----------------------*/

  function getCategories(){
    var containersItemsCategory = document.getElementById("containersItemsCategory");
    $.ajax( "../../controller/W3P/W3P_products/products.php", {
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
            '<img  class="buttonPlusCategory"src="../../assets/img/W3P_products/sections/section-1-home/mas.png" alt="">'+
            '<img  class="buttonLessCategory"src="../../assets/img/W3P_products/sections/section-1-home/menos.png" alt="">'+
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
      $.ajax( "../../controller/W3P/W3P_products/products.php", {
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
             '<img  class="buttonPlusGroup"src="../../assets/img/W3P_products/sections/section-1-home/mas.png" alt="">'+
             '<img  class="buttonLessGroup"src="../../assets/img/W3P_products/sections/section-1-home/menos.png" alt="">'+
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
    $.ajax( "../../controller/W3P/W3P_products/products.php", {
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




    const openOrders = document.getElementById("openOrders");

    openOrders.addEventListener("click", function(){
      window.open("../../views/W3P_orders/index.php", "_self");
    });



    /*
    select
        `product_group`.code AS 'GROUP CODE', `product_group`.name AS 'GROUP',  `product`.id AS 'PRODUCT CODE', `product`.name AS 'PRODUCT'
    from
        `product`
    inner join `product_group`
        on `product`.code = `product_group`.code

    ORDER BY  `product_group`.name
    */
