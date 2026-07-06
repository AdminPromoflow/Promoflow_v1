class Messages_Logic {
  constructor() {
  //  alert("buenas");
  }

async  requestSuppliers(){
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

  async makeRequest(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Network error.");
      }

      return await response.json();

    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
}
const messages_logic =  new Messages_Logic();
