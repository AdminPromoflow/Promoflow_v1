class Messages_Logic {
  constructor() {
  //  alert("buenas");
  }

  requestSuppliers(){
    if (!this.modal) return;

    const params = new URLSearchParams(window.location.search);
    const sku = params.get('sku');

    const url = "../../controller/messages/messages.php";
    const data = {
      action: "get_suppliers",
      sku: sku
    };

    const response = await this.makeRequest(url, data);

    if (!response) return;

    alert(JSON.stringify(response));
  }
}
const messages_logic =  new Messages_Logic();
