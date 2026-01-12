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
      tableOverviewDetails.innerHTML += `
        <tr>
          <td>1</td>
          <td>2025-12-21</td>
          <td>Category</td>
          <td>W3P Supplier A</td>
          <td>CAT-2002</td>
          <td>Pending</td>
          <td>Review</td>
        </tr>`;
    }
  }




//


}

document.addEventListener("DOMContentLoaded", () => {
  const sectionOverview = new SectionOverview();
});
