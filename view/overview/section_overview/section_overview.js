class SectionOverview {
  constructor() {
    this.getOverviewData();
  }


  getOverviewData() {
    const url = "../../controller/dot63/requests_63_api.php";
    const payload = { action: "get_API_overview_data" };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(result => {
      if (!result.ok) throw new Error("Network error.");
      return result.json();
    })
    .then(data => {
      if (data["success"]) {
        this.renderOverviewDetailsTable(data["result"]);
      }
    })
    .catch(err => console.log("Error:", err));
  }

  renderOverviewDetailsTable(data) {
    const tableOverviewDetails = document.getElementById("table_overview_details");
    tableOverviewDetails.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
      var index = i+1;
      var date =  data[i]["date_status"];
      var supplier = data[i]["supplier"]["company_name"];
      var name = data[i]["name"];
      var status = (parseInt(data[i]["is_approved"], 10) === 0) ? "Pending" : "Approved";
      const sku = data[i]["SKU"]; // <- aquí lo tomas


      tableOverviewDetails.innerHTML += `
        <tr>
          <td>${index}</td>
          <td>${date}</td>
          <td>Product Launch</td>
          <td>${supplier}</td>
          <td>${name}</td>
          <td>${status}</td>
          <td class="link_review" onclick="this.reviewProduct('${String(sku).replace(/'/g, "\\'")}')">Review</td>
        </tr>`;
    }
  }

    reviewProduct(sku) {
      alert("SKU:", sku);

      // Ejemplo: redirigir
      // window.location.href = `review.php?sku=${encodeURIComponent(sku)}`;

      // Ejemplo: llamar tu flujo de review
      // this.openReviewModal(sku);
    }




//


}

document.addEventListener("DOMContentLoaded", () => {
  const sectionOverview = new SectionOverview();
});
