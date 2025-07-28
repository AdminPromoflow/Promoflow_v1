<style media="screen">
    .containerItemsToSendPO{
      position: relative;
      width: 100%;
    }
    .itemToSendPO{
      position: relative;
      width: 100%;
      height: 40px;
      background-color: #2F4560;
      border: 1px solid black;
    }
    .itemToSendPO h3{
      position: relative;
      text-align: center;
      color: rgba(255, 255, 255, .9);
      top: 50%;
      transform: translateY(-50%);
      font-size: 1em;
      font-weight: 400;
    }
    .openToggleSubitemToSendPO{
      position: absolute;
      width: 40px;
      height: 100%;
      top: 0px;
      right: 0px;
    }
    .buttonPlusToSendPO {
      position: absolute;
      width: 25px;
      height: 21px;
      top:50%;
      right:10px;
      transform: translateY(-50%);
      cursor: pointer;
      }
    .buttonLessToSendPO{
      position: absolute;
      width: 25px;
      height: 11px;
      top:50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      display: none;
      }


      .containerItemContentToSendPO{
        position: relative;
        width: 100%;
      }
      .itemContentToSendPO{
        position: relative;
        width: 100%;
        padding: 4px;
        background-color: #7B899A;
        border: 1px solid black;
      }
      .itemContentToSendPO h3{
        position: relative;
        text-align: center;
        width: 85%;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255, 255, 255, .8);
        font-size: 1em;
        font-weight: 300;
      }
      .itemContentToSendPO input{
        position: relative;
        text-align: center;
        width: 85%;
        left: 50%;
        background-color: #66768A;
        transform: translateX(-50%);
        color: white;
        font-size: 1em;
        font-weight: 300;
        margin: 5px 0px;
        border: 2px solid #26384F;
      }
      .openToggleSubitemContentToSendPO{
        position: absolute;
        width: 30px;
        height: 100%;
        right: 10px;
        top: 0px;
      }
      .buttonPlusContentToSendPO {
        position: absolute;
        width: 15px;
        height: 21px;
        top:50%;
        right:10px;
        transform: translateY(-50%);
        cursor: pointer;
        }
      .buttonLessContentToSendPO{
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
</style>
<div class="containerTableW3P">

  <div id="containersItemsContentToSendPO" class="containerCenterTable">

    <div class="containerItemsToSendPO">
        <div class="itemToSendPO">
          <h3>Order date</h3>
          <div class="openToggleSubitemToSendPO" onclick="showCategories(\ + noDivToSendPO  + \);" >
            <img  class="buttonPlusToSendPO"src="../2-2-Orders/Images/mas.png" alt="">
            <img  class="buttonLessToSendPO"src="../2-2-Orders/Images/menos.png" alt="">
          </div>
        </div>
        <div id=""class="containersItemsContentToSendPO">



        </div>
      </div>





  </div>

</div>
<script type="text/javascript">
//var test = document.getElementById('test');
  function getToSendPO(){
    var containersItemsContentToSendPO = document.getElementById("containersItemsContentToSendPO");

    $.ajax( "../App/Controller/Controller2.php", {
           type: 'post',
           async: false,
           data: {
             module: "getToSendPOOrders"
                   },
           success: function(data){
             containersItemsContentToSendPO.innerHTML = "";

             console.log(data);
             var data = jQuery.parseJSON(data);
            for (var i = 0; i < data.length; i++) { // Create each orders
              //alert(data[i]["created_date"]);
               createToSendPOOrders(data[i]["id"], data[i]["created_date"], i);
             }

    //         test.value = "hola";

            }
          })
  }



  function createToSendPOOrders(idOrder, date, noDivOrder){
    var containersItemsContentToSendPO = document.getElementById("containersItemsContentToSendPO");

    containersItemsContentToSendPO.innerHTML +=
    '<div class="containerItemsToSendPO">' +
      '<div class="itemToSendPO">' +
        '<h3>Order: '+ date +'</h3>' +
        '<div class="openToggleSubitemToSendPO" onclick="" >' +
          '<img  class="buttonPlusToSendPO"src="../2-2-Orders/Images/mas.png" alt="">' +
          '<img  class="buttonLessToSendPO"src="../2-2-Orders/Images/menos.png" alt="">' +
        '</div>' +
      '</div>' +
      '<div class="containersItemContentToSendPO">' +
      '</div>' +
    '</div>'
    ;
    getToSendPOContent(idOrder, noDivOrder);
  }
  
  var dataContentToSentPO;
  function getToSendPOContent(idOrder, noDivOrder){
    const containersItemContentToSendPO =  document.querySelectorAll(".containersItemContentToSendPO");
    /*const DataNo =  document.querySelectorAll(".DataNo");
    const Customer =  document.querySelectorAll(".Customer");
    const PrintRef =  document.querySelectorAll(".PrintRef");
    const Project =  document.querySelectorAll(".Project");
    const Qty =  document.querySelectorAll(".Qty");
    const Supplier =  document.querySelectorAll(".Supplier");
    const OrderDate =  document.querySelectorAll(".OrderDate");
    const POSent =  document.querySelectorAll(".POSent");
    const ApprovalSent =  document.querySelectorAll(".ApprovalSent");
    const DespatchDate =  document.querySelectorAll(".DespatchDate");
    const DUEDATE =  document.querySelectorAll(".DUEDATE");
    const ArtworkPreApproved =  document.querySelectorAll(".ArtworkPreApproved");
    const Artwork =  document.querySelectorAll(".Artwork");
    const ArtworkVisual =  document.querySelectorAll(".ArtworkVisual");
    const ApprovedPDF =  document.querySelectorAll(".ApprovedPDF");
    const ApprovedVisual =  document.querySelectorAll(".ApprovedVisual");
    const BoxNo =  document.querySelectorAll(".BoxNo");
    const DespatchDate =  document.querySelectorAll(".DespatchDate");
    const TrackingNo =  document.querySelectorAll(".TrackingNo");
    const DeliveredDate =  document.querySelectorAll(".DeliveredDate");
    const Nettsale =  document.querySelectorAll(".Nettsale");
    const CustomerReference1 =  document.querySelectorAll(".CustomerReference1");
    const Ref =  document.querySelectorAll(".Ref");
    const Email =  document.querySelectorAll(".Email");
    const Item =  document.querySelectorAll(".Item");
    const Size =  document.querySelectorAll(".Size");
    const Material =  document.querySelectorAll(".Material");
    const Weigth =  document.querySelectorAll(".Weigth");
    const Print =  document.querySelectorAll(".Print");
    const Coverage =  document.querySelectorAll(".Coverage");
    const PrintStyle =  document.querySelectorAll(".PrintStyle");
    const Finish1 =  document.querySelectorAll(".Finish1");
    const Finish2 =  document.querySelectorAll(".Finish2");
    const Finish3 =  document.querySelectorAll(".Finish3");
    const ServiceLevel =  document.querySelectorAll(".ServiceLevel");
    const Status =  document.querySelectorAll(".Status");
    const Notes =  document.querySelectorAll(".Notes");
    const Note =  document.querySelectorAll(".Note");
    const CompanyName =  document.querySelectorAll(".CompanyName");
    const Attn =  document.querySelectorAll(".Attn");
    const Tel =  document.querySelectorAll(".Tel");
    const Email =  document.querySelectorAll(".Email");
    const DeliveryAddress =  document.querySelectorAll(".DeliveryAddress");
    const Tracklink =  document.querySelectorAll(".Tracklink");
    const DeliveryImage =  document.querySelectorAll(".DeliveryImage");
    const ProductImage =  document.querySelectorAll(".ProductImage");
    const NotSure =  document.querySelectorAll(".NotSure");
    const POReceived =  document.querySelectorAll(".POReceived");*/


      $.ajax( "../App/Controller/Controller2.php", {
             type: 'post',
             async: false,
             data: {
               module: "getToSendPOContent",
               idOrder: idOrder
                     },
             success: function(data){
               console.log(data);

            // alert(data);
              dataContentToSentPO = jQuery.parseJSON(data);
              containersItemContentToSendPO[noDivOrder].innerHTML = '';


               //alert(data[i]["data_no"]);
                 createToSendPOContent(noDivOrder);

              }
            })
  }

  function createToSendPOContent(noDivOrder){
    const containersItemContentToSendPO =  document.querySelectorAll(".containersItemContentToSendPO");
    containersItemsContentToSendPO.innerHTML +=
    '<div class="containerItemsContentToSendPO">'+
        '<div class="itemContentToSendPO">'+
          '<h3 >1. Data No*:</h3>'+
          '<input class="DataNo" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >2. Customer:</h3>'+
          '<input class="Customer" type="text" name="" value="">'+
         '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >3. Print Ref*:</h3>'+
          '<input class="PrintRef" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >4. Project:</h3>'+
          '<input class="Project" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >5. Qty*:</h3>'+
          '<input class="Qty" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >6. Supplier:</h3>'+
          '<input class="Supplier" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >7. C-Order Date:</h3>'+
          '<input class="OrderDate" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >8. PO Sent:</h3>'+
          '<input class="POSent" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >9. Approval Sent:</h3>'+
          '<input class="ApprovalSent" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >10. Despatch Date:</h3>'+
          '<input class="DespatchDate" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >11. C-DUE DATE:</h3>'+
          '<input class="DUEDATE" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >12. Artwork Pre Approved?:</h3>'+
          '<input class="ArtworkPreApproved" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >13. C- Artwork:</h3>'+
          '<input class="Artwork" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >14. C-Artwork Visual:</h3>'+
          '<input class="ArtworkVisual" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >15. C-Approved PDF:</h3>'+
          '<input class="ApprovedPDF" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >16. C-Approved Visual:</h3>'+
          '<input class="ApprovedVisual" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >20. Box No:</h3>'+
          '<input class="BoxNo" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >21. Act-Despatch Date:</h3>'+
          '<input class="DespatchDate" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >22. UK-Tracking No:</h3>'+
          '<input class="TrackingNo" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >23. Delivered Date:</h3>'+
          '<input class="DeliveredDate" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >24. Nett sale*:</h3>'+
          '<input class="Nettsale" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >25. Customer Reference 1*:</h3>'+
          '<input class="CustomerReference1" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >26. S-Ref:</h3>'+
          '<input class="Ref" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >27. S-Email:</h3>'+
          '<input class="Email" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >28. Item:</h3>'+
          '<input class="Item" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >29. Size:</h3>'+
          '<input class="Size" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >30. Material:</h3>'+
          '<input class="Material" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >31. Weigth/Thickness/Capacity:</h3>'+
          '<input class="Weigth" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >32. Print:</h3>'+
          '<input class="Print" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >33. Coverage:</h3>'+
          '<input class="Coverage" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >34: Print Style:</h3>'+
          '<input class="PrintStyle" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >35. Finish 1:</h3>'+
          '<input class="Finish1" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >36. Finish 2:</h3>'+
          '<input class="Finish2" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >37. Finish 3:</h3>'+
          '<input class="Finish3" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >38. Service Level:</h3>'+
          '<input class="ServiceLevel" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >39. Status*:</h3>'+
          '<input class="Status" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >40. Notes:</h3>'+
          '<input class="Notes" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >41: Note:</h3>'+
          '<input class="Note" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >42. Company Name:</h3>'+
          '<input class="CompanyName" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >43. Attn:</h3>'+
          '<input class="Attn" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >44. Tel:</h3>'+
          '<input class="Tel" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >45. Email:</h3>'+
          '<input class="Email" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >46. Delivery Address:</h3>'+
          '<input class="DeliveryAddress" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >47. UK-Track link:</h3>'+
          '<input class="Tracklink" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >48: Delivery Image:</h3>'+
          '<input class="DeliveryImage" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >49. Product Image:</h3>'+
          '<input class="ProductImage" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >50. Not Sure:</h3>'+
          '<input class="NotSure" type="text" name="" value="">'+
        '</div>'+
        '<div class="itemContentToSendPO">'+
          '<h3 >51. PO Received:</h3>'+
          '<input class="POReceived" type="text" name="" value="">'+
        '</div>'+

      '</div>'
    ;

  }




</script>
