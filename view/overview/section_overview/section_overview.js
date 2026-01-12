class SectionOverview {
  constructor() {
    this.getOverviewData();
  }


  getOverviewData() {

    const url = "../../controller/dot63/requests_63_api.php";
    const data = {
      action: "get_API_overview_data"
    }
    fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(response =>{
      if(response.ok) return response.text();
      throw new Error("Network error.");
    })
    .then(data => {
      alert(data);
    })
    .catch(error => {
      console.log("Error: ", error)
    })

  }


}

document.addEventListener("DOMContentLoaded", () => {
  const sectionOverview = new SectionOverview();
});
