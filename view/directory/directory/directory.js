class OpsDashboardV3 {
  constructor(root) {

    const open_review = document.getElementById("open_review");


    open_review.addEventListener("click", function(){

      window.open('../../view/preview_porduct/index.php', '_blank');
    })




    this.root = root;

    // Mobile sidebar
    this.sideToggle = root.querySelector("[data-side-toggle]");
    this.sideCloseEls = Array.from(root.querySelectorAll("[data-side-close]"));
    this.sideOverlay = root.querySelector("[data-side-overlay]");

    // Views
    this.navButtons = Array.from(root.querySelectorAll("[data-view-btn]"));
    this.views = Array.from(root.querySelectorAll("[data-view]"));
    this.jumpButtons = Array.from(root.querySelectorAll("[data-jump]"));

    // Accordions
    this.accButtons = Array.from(root.querySelectorAll("[data-acc-btn]"));

    // Subnav items inside accordions
    this.subNavButtons = Array.from(root.querySelectorAll("[data-subview]"));

    // Messages
    this.msgSearch = root.querySelector("[data-msg-search]");
    this.msgFilterBtns = Array.from(root.querySelectorAll("[data-msg-filter-btn]"));
    this.msgRows = Array.from(root.querySelectorAll("[data-thread]")); // opsMsgRow
    this.msgQuery = "";
    this.msgFilter = "all";

    // Approvals
    this.apprTabs = Array.from(root.querySelectorAll("[data-approvals-tab]"));
    this.apprViews = Array.from(root.querySelectorAll("[data-approvals-view]"));
    this.apprSearchInputs = Array.from(root.querySelectorAll("[data-approvals-search]"));
    this.apprPlatformBlocks = Array.from(root.querySelectorAll("[data-appr-platform-view]"));
    this.apprJumpBtns = Array.from(root.querySelectorAll("[data-approvals-jump]"));

    // Orders
    this.orderTabs = Array.from(root.querySelectorAll("[data-orders-tab]"));
    this.orderViews = Array.from(root.querySelectorAll("[data-orders-view]"));
    this.orderSearchInputs = Array.from(root.querySelectorAll("[data-orders-search]"));
    this.orderStatusSelects = Array.from(root.querySelectorAll("[data-orders-status]"));
    this.orderJumpBtns = Array.from(root.querySelectorAll("[data-orders-jump]"));

    this.bind();
  }

  bind() {
    // Mobile sidebar open/close
    if (this.sideToggle) this.sideToggle.addEventListener("click", () => this.setSideOpen(true));
    this.sideCloseEls.forEach(el => el.addEventListener("click", () => this.setSideOpen(false)));

    // Sidebar navigation buttons
    this.navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view-btn");
        const accKey = btn.getAttribute("data-acc-btn");

        this.setView(view);

        // If it has accordion -> toggle accordion ONLY (do not close sidebar)
        if (accKey) {
          this.toggleAccordion(accKey);
          return;
        }

        // If no accordion -> close on mobile
        this.autoCloseSideOnSmall();
      });
    });

    // Jump buttons (Overview tiles)
    this.jumpButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-jump");
        this.setView(view);
        this.autoCloseSideOnSmall();
      });
    });

    // Subnav inside accordion
    this.subNavButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.subview;
        this.setView(view);

        if (view === "messages" && btn.dataset.msgFilter) {
          this.setMessagesFilter(btn.dataset.msgFilter);
        }

        if (view === "approvals" && btn.dataset.apprPlatform) {
          this.setApprovalsPlatform(btn.dataset.apprPlatform);
        }

        if (view === "orders" && btn.dataset.ordersTab) {
          this.setOrdersTab(btn.dataset.ordersTab);
        }

        this.autoCloseSideOnSmall();
      });
    });

    // Messages: search
    if (this.msgSearch) {
      this.msgSearch.addEventListener("input", () => {
        this.msgQuery = (this.msgSearch.value || "").trim().toLowerCase();
        this.applyMessagesFilters();
      });
    }

    // Messages: filter pills
    this.msgFilterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.msgFilterBtn || "all";
        this.setMessagesFilter(key);
      });
    });

    // Messages: row switching
    this.msgRows.forEach(row => {
      row.addEventListener("click", () => {
        this.msgRows.forEach(r => r.classList.remove("is-active"));
        row.classList.add("is-active");

        // On mobile, scroll to detail pane
        if (window.matchMedia && window.matchMedia("(max-width: 860px)").matches) {
          const detail = this.root.querySelector("[data-msg-detail]");
          if (detail) detail.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Approvals tabs
    this.apprTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-approvals-tab");
        this.setApprovalsTab(key);
      });
    });

    // Approvals overview jump buttons
    this.apprJumpBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.approvalsJump;
        if (key) this.setApprovalsTab(key);
      });
    });

    // Approvals search inputs
    this.apprSearchInputs.forEach(inp => {
      inp.addEventListener("input", () => {
        const q = (inp.value || "").trim().toLowerCase();
        this.filterRowsInNearestTable(inp, q);
      });
    });

    // Orders tabs
    this.orderTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-orders-tab");
        this.setOrdersTab(key);
      });
    });

    // Orders overview jump
    this.orderJumpBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.ordersJump;
        if (key) this.setOrdersTab(key);
      });
    });

    // Orders search
    this.orderSearchInputs.forEach(inp => {
      inp.addEventListener("input", () => {
        const q = (inp.value || "").trim().toLowerCase();
        this.filterOrdersInNearestView(inp, q);
      });
    });

    // Orders status filter
    this.orderStatusSelects.forEach(sel => {
      sel.addEventListener("change", () => {
        this.applyOrdersStatusInNearestView(sel, sel.value || "all");
      });
    });
  }

  /* =============== Mobile sidebar =============== */
  setSideOpen(open) {
    this.root.classList.toggle("ops--sideOpen", !!open);
    document.documentElement.classList.toggle("opsNoScroll", !!open);
    document.body.classList.toggle("opsNoScroll", !!open);

    if (this.sideOverlay) {
      if (open) this.sideOverlay.removeAttribute("hidden");
      else this.sideOverlay.setAttribute("hidden", "hidden");
    }
  }

  autoCloseSideOnSmall() {
    if (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) {
      this.setSideOpen(false);
    }
  }

  /* =============== Accordion =============== */
  toggleAccordion(key) {
    // close all first
    const groups = Array.from(this.root.querySelectorAll(".opsNavGroup"));
    groups.forEach(g => g.classList.remove("is-open"));

    this.accButtons.forEach(b => {
      b.setAttribute("aria-expanded", "false");
      b.classList.remove("is-open");
    });

    const btn = this.accButtons.find(b => b.dataset.accBtn === key);
    if (!btn) return;

    const group = btn.closest(".opsNavGroup");
    if (!group) return;

    // open selected
    group.classList.add("is-open");
    btn.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  }

  /* =============== Views =============== */
  setView(viewKey) {
    this.navButtons.forEach(b => b.classList.remove("is-active"));
    const btn = this.navButtons.find(b => b.getAttribute("data-view-btn") === viewKey);
    if (btn) btn.classList.add("is-active");

    this.views.forEach(v => v.classList.remove("is-active"));
    const view = this.views.find(v => v.getAttribute("data-view") === viewKey);
    if (view) view.classList.add("is-active");

    // When switching to messages, reapply filters
    if (viewKey === "messages") this.applyMessagesFilters();
  }

  /* =============== Messages =============== */
  setMessagesFilter(key) {
    this.msgFilter = key || "all";

    this.msgFilterBtns.forEach(b => b.classList.remove("is-active"));
    const active = this.msgFilterBtns.find(b => (b.dataset.msgFilterBtn || "all") === this.msgFilter);
    if (active) active.classList.add("is-active");

    this.applyMessagesFilters();
  }

  applyMessagesFilters() {
    const rows = Array.from(this.root.querySelectorAll(".opsMsgRow"));
    rows.forEach(r => {
      const text = (r.textContent || "").toLowerCase();
      const platform = (r.dataset.platform || "");
      const passQuery = (!this.msgQuery || text.includes(this.msgQuery));
      const passPlatform = (this.msgFilter === "all" || platform === this.msgFilter);

      r.style.display = (passQuery && passPlatform) ? "" : "none";
    });
  }

  /* =============== Approvals =============== */
  setApprovalsPlatform(platformKey) {
    const key = platformKey || "dot63";
    this.apprPlatformBlocks.forEach(b => b.classList.remove("is-active"));

    const block = this.apprPlatformBlocks.find(b => b.dataset.apprPlatformView === key);
    if (block) block.classList.add("is-active");

    // default tab on .63
    if (key === "dot63") this.setApprovalsTab("overview");
  }

  setApprovalsTab(key) {
    this.apprTabs.forEach(t => t.classList.remove("is-active"));
    const tab = this.apprTabs.find(t => t.getAttribute("data-approvals-tab") === key);
    if (tab) tab.classList.add("is-active");

    this.apprViews.forEach(v => v.classList.remove("is-active"));
    const view = this.apprViews.find(v => v.getAttribute("data-approvals-view") === key);
    if (view) view.classList.add("is-active");

    // Clear searches + reset rows
    this.apprSearchInputs.forEach(i => (i.value = ""));
    this.showAllSearchRows();
  }

  filterRowsInNearestTable(inputEl, q) {
    const tabView = inputEl.closest(".opsTabView");
    if (!tabView) return;

    const rows = Array.from(tabView.querySelectorAll("tr[data-searchrow]"));
    rows.forEach(r => {
      const text = (r.textContent || "").toLowerCase();
      r.style.display = (!q || text.includes(q)) ? "" : "none";
    });
  }

  showAllSearchRows() {
    const rows = Array.from(this.root.querySelectorAll("tr[data-searchrow]"));
    rows.forEach(r => (r.style.display = ""));
  }

  /* =============== Orders =============== */
  setOrdersTab(key) {
    this.orderTabs.forEach(t => t.classList.remove("is-active"));
    const tab = this.orderTabs.find(t => t.getAttribute("data-orders-tab") === key);
    if (tab) tab.classList.add("is-active");

    this.orderViews.forEach(v => v.classList.remove("is-active"));
    const view = this.orderViews.find(v => v.getAttribute("data-orders-view") === key);
    if (view) view.classList.add("is-active");

    // Clear filters on switch
    this.orderSearchInputs.forEach(i => (i.value = ""));
    this.orderStatusSelects.forEach(s => (s.value = "all"));
    this.showAllOrderRows();
  }

  filterOrdersInNearestView(inputEl, q) {
    const tabView = inputEl.closest(".opsTabView");
    if (!tabView) return;

    const rows = Array.from(tabView.querySelectorAll("tr[data-order-row]"));
    rows.forEach(r => {
      const text = (r.textContent || "").toLowerCase();
      const pass = (!q || text.includes(q));

      if (r.dataset._statusHidden === "1") {
        r.style.display = "none";
      } else {
        r.style.display = pass ? "" : "none";
      }
      r.dataset._searchHidden = pass ? "0" : "1";
    });
  }

  applyOrdersStatusInNearestView(selectEl, status) {
    const tabView = selectEl.closest(".opsTabView");
    if (!tabView) return;

    const rows = Array.from(tabView.querySelectorAll("tr[data-order-row]"));
    rows.forEach(r => {
      const rowStatus = r.getAttribute("data-status") || "";
      const pass = (status === "all" || rowStatus === status);

      r.dataset._statusHidden = pass ? "0" : "1";
      const searchHidden = r.dataset._searchHidden === "1";
      r.style.display = (pass && !searchHidden) ? "" : "none";
    });
  }

  showAllOrderRows() {
    const rows = Array.from(this.root.querySelectorAll("tr[data-order-row]"));
    rows.forEach(r => {
      r.style.display = "";
      r.dataset._statusHidden = "0";
      r.dataset._searchHidden = "0";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".ops");
  if (root) new OpsDashboardV3(root);
});
