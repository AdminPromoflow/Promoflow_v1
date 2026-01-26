class SectionOverview {
  constructor() {
    this.tableOverviewDetails = document.getElementById("table_overview_details");

    // Event delegation: un solo listener para todos los "Review"
    this.tableOverviewDetails.addEventListener("click", (e) => {
      const cell = e.target.closest(".link_review");
      if (!cell) return;

      const sku = cell.dataset.sku || "";
      const skuVariation = cell.dataset.skuVariation || "";

      this.reviewProduct(sku, skuVariation);
    });

    this.getOverviewData();
  }

  getOverviewData() {
    const url = "../../controller/dot63/requests_63_api.php";
    const payload = { action: "get_API_overview_data" };

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((result) => {
        if (!result.ok) throw new Error("Network error.");
        return result.json();
      })
      .then((data) => {
        if (data["success"]) {
          this.renderOverviewDetailsTable(data["result"]);
        }
      })
      .catch((err) => console.log("Error:", err));
  }

  renderOverviewDetailsTable(data) {
    this.tableOverviewDetails.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
      const index = i + 1;

      const dateRaw = data[i]["date_status"];
      const date =
        dateRaw === null || dateRaw === undefined || dateRaw === "" ? "-" : dateRaw;

      const supplier = data[i]["supplier"]?.["company_name"] ?? "-";
      const name = data[i]["name"] ?? "";
      const status =
        parseInt(data[i]["is_approved"], 10) === 0 ? "Pending" : "Approved";

      const sku = data[i]["SKU"] ?? "";
      const skuVariation = data[i]["sku_variations"] ?? "";

      // Escapar comillas dobles para atributos HTML
      const safeSku = String(sku).replace(/"/g, "&quot;");
      const safeSkuVar = String(skuVariation).replace(/"/g, "&quot;");

      this.tableOverviewDetails.innerHTML += `
        <tr>
          <td>${index}</td>
          <td>${date}</td>
          <td>Product Launch</td>
          <td>${supplier}</td>
          <td>${name}</td>
          <td>${status}</td>
          <td class="link_review"
              data-sku="${safeSku}"
              data-sku-variation="${safeSkuVar}">
            Review
          </td>
        </tr>`;
    }
  }

  reviewProduct(sku, skuVariation) {
    const url =
      `../../view/preview_porduct/index.php` +
      `?sku=${encodeURIComponent(sku)}` +
      `&sku_variation=${encodeURIComponent(skuVariation)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new SectionOverview();
});
