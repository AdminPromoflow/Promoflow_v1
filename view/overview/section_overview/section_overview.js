class SectionOverview {
  constructor() {
    const  pending_to_construction = document.querySelectorAll(".pending_to_construction");

    for (let i = 0; i <  pending_to_construction.length; i++) {
       pending_to_construction[i].addEventListener("click", function(){
        alert("This page is not available yet. We are working on building it soon.");
      })
    }



    this.tableOverviewDetails = document.getElementById("table_overview_details");

    if (this.tableOverviewDetails) {
      // Event delegation: un solo listener para todos los "Review"
      this.tableOverviewDetails.addEventListener("click", (e) => {
        const cell = e.target.closest(".link_review");
        if (!cell) return;

        const sku = cell.dataset.sku || "";
        const skuVariation = cell.dataset.skuVariation || "";

        this.reviewProduct(sku, skuVariation);
      });
    }

    // ✅ Botones del card "User manager"
    document.querySelectorAll('[data-go="user-manager"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href = "../../view/user_manager/index.php";
      });
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
         // alert(JSON.stringify(data));
        if (data["success"]) {
          this.renderOverviewDetailsTable(data["result"]);
        }
      })
      .catch((err) => console.log("Error:", err));
  }

  renderOverviewDetailsTable(data) {
    if (!this.tableOverviewDetails) return;

    this.tableOverviewDetails.innerHTML = "";

    const products = Array.isArray(data)
      ? data
      : Array.isArray(data?.result)
        ? data.result
        : [];

    const pendingProducts = products.filter((product) => {
      return parseInt(product?.is_approved, 10) === 0;
    });

    if (pendingProducts.length === 0) {
      this.tableOverviewDetails.innerHTML = `
        <tr>
          <td colspan="7">No pending products found.</td>
        </tr>
      `;
      return;
    }

    pendingProducts.forEach((product, i) => {
      const index = i + 1;

      const dateRaw = product?.date_status;
      const date = dateRaw === null || dateRaw === undefined || dateRaw === ""
        ? "-"
        : dateRaw;

      const supplier = product?.supplier?.company_name ?? "-";
      const name = product?.name ?? "";
      const status = "Pending";

      const sku = product?.SKU ?? "";
      const skuVariation = product?.sku_variations ?? "";

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
        </tr>
      `;
    });
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
