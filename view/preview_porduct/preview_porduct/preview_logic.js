// Product presentation, branching options and totals come from the shared Dot63 preview.
const sharedModule = document.getElementById("preview_app").dataset.sharedModule;
const { SupplierPreviewApp } = await import(new URL(sharedModule, window.location.href));

export class PreviewLogic extends SupplierPreviewApp {
  constructor() {
    super({
      autoLoad: false,
      previewUrl: "../../controller/dot63/requests_63_api.php",
      productUrl: "../../controller/dot63/requests_63_api.php",
      previewAction: "get_review_preview",
      variationChildrenAction: "get_review_variation_children",
      variationPricesAction: "get_review_variation_prices"
    });
    this.statusRequest = null;
    this.approving = false;
    document.getElementById("btn_msn_supplier")?.addEventListener("click", () => this.MsnSupplier());
    this.getProduct();
  }

  renderProduct(payload) {
    super.renderProduct(payload);
    this.renderApprovalRequest(payload.product, payload.permissions);
  }

  renderApprovalRequest(product = {}, permissions = {}) {
    const pending = product.pending_status != null;
    const available = permissions.approval_available !== false;
    this.statusRequest = pending && available && permissions.can_approve === true ? { ...product } : null;
    const summary = document.getElementById("approval_status_summary");
    if (summary) {
      summary.textContent = `Current status: ${product.status_label || "Draft"}. ` + (
        !available ? "Status approval is temporarily unavailable." :
        pending ? `Requested status: ${product.pending_status_label}. The current status remains in effect until approval.` :
        "No status change is awaiting approval."
      );
    }
    const button = document.getElementById("btn_publish");
    if (button) {
      button.hidden = false;
      button.disabled = !this.statusRequest || this.approving;
      button.querySelector(".btn-label").textContent = pending ? `Approve: ${product.pending_status_label}` : "No pending change";
      button.title = !available ? "Status approval is temporarily unavailable" :
        pending && !this.statusRequest ? "Complete the product checklist before approving this status" : "";
    }
  }

  async submitForApproval() {
    if (!this.statusRequest || this.approving) return;
    this.approving = true;
    const request = this.statusRequest;
    const button = this.elements.publish;
    button.disabled = true;
    button.classList.add("is-loading");
    try {
      const result = await this.makeRequest(this.api.productUrl, {
        action: "approve_product",
        sku: this.sku,
        requested_status: request.pending_status,
        status_request_version: request.status_request_version
      }, { requireSuccess: true });
      this.statusRequest = null;
      await this.getProduct();
      this.showMessage(result.message || "The status change has been approved.", "success");
    } catch (error) {
      // Refresh a stale request, but leave approving the new request to a separate click.
      if (error.status === 409) await this.getProduct();
      this.showMessage(error.message || "Unable to approve the status change.", "error");
    } finally {
      this.approving = false;
      button.classList.remove("is-loading");
      button.disabled = !this.statusRequest;
    }
  }

  goBack() {
    window.location.assign("../../view/overview/index.php");
  }

  MsnSupplier() {
    if (this.sku) window.location.assign(`../../view/messages/index.php?sku=${encodeURIComponent(this.sku)}`);
  }
}

const previewLogic = new PreviewLogic();
window.previewLogic = previewLogic;
