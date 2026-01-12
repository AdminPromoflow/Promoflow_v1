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
      this.renderOverviewDetailsTable(data);
    })
    .catch(err => console.log("Error:", err));
  }

  renderOverviewDetailsTable(data) {
    alert("Bueno " + JSON.stringify(data));
  }



//  table_overview_details


}

document.addEventListener("DOMContentLoaded", () => {
  const sectionOverview = new SectionOverview();
});
