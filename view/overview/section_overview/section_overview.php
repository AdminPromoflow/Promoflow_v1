<link rel="stylesheet" href="../../view/overview/section_overview/section_overview.css?v=<?= file_exists('../../view/overview/section_overview/section_overview.css') ? filemtime('../../view/overview/section_overview/section_overview.css') : time() ?>">

<section class="section-overview">

  <?php include "../../view/global/section_sidebar_navigation/section_sidebar_navigation.php" ?>
  <div class="section-overview-responsive">
    <header class="section-overview-header">
      <h1>Operations Dashboard</h1>
      <p>Organised overview: Messages, approvals and orders by platform.</p>
    </header>

    <!-- =========================
         TOP 3 CARDS
    ========================== -->
    <div class="overview-cards-container">

      <!-- Messages card -->
      <div class="overview-card messages-card">
        <div class="overview-card-top">
          <h2>Messages</h2>
        </div>

        <div class="overview-card-mid">
          <h1 class="overview-card-number">2</h1>
          <p>Open threads</p>
        </div>

        <div class="overview-card-actions">
          <button type="button">Quick view</button>
          <button type="button">View details</button>
        </div>
      </div>

      <!-- Approvals card -->
      <div class="overview-card approvals-card">
        <div class="overview-card-top">
          <h2>Approbals</h2>
        </div>

        <div class="overview-card-mid">
          <h1 class="overview-card-number">7</h1>
          <p>Pending requests</p>
        </div>

        <div class="overview-card-actions">
          <button type="button">Quick view</button>
          <button type="button">View details</button>
        </div>
      </div>

      <!-- Orders card -->
      <div class="overview-card orders-card">
        <div class="overview-card-top">
          <h2>Orders</h2>
        </div>

        <div class="overview-card-mid">
          <h1 class="overview-card-number">5</h1>
          <p>Open / at risk</p>
        </div>

        <div class="overview-card-actions">
          <button type="button">Quick view</button>
          <button type="button">View details</button>
        </div>
      </div>

    </div>

    <!-- =========================
         DETAILS CONTAINER (tabs + table)
         This area will change depending on selected card:
         Messages / Approbals / Orders
    ========================== -->
    <div class="approvals-details-container">

      <!-- Header inside details container -->
      <div class="details-header">
        <h2>Approbals</h2>

        <!-- Company tabs container -->
        <div class="details-tabs">
          <div class="details-tab-item">
            <h4>W3P</h4>
            <div class="details-tab-count"><p>3</p></div>
          </div>

          <div class="details-tab-item is-active">
            <h4>.63</h4>
            <div class="details-tab-count"><p>1</p></div>
          </div>

          <div class="details-tab-item">
            <h4>Amazon</h4>
            <div class="details-tab-count"><p>2</p></div>
          </div>

          <div class="details-tab-item">
            <h4>eBay</h4>
            <div class="details-tab-count"><p>0</p></div>
          </div>

          <div class="details-tab-item">
            <h4>Ullman Sails</h4>
            <div class="details-tab-count"><p>1</p></div>
          </div>

          <div class="details-tab-item">
            <h4>Hello Print</h4>
            <div class="details-tab-count"><p>4</p></div>
          </div>
        </div>
      </div>

      <!-- Scroll container (table) -->
      <div class="details-table-scroll">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Approval Type</th>
              <th>Submit by</th>
              <th>SKU</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody id="table_overview_details">
          <!--  <tr>
              <td>1</td>
              <td>2025-12-21</td>
              <td>Category</td>
              <td>W3P Supplier A</td>
              <td>CAT-2002</td>
              <td>Pending</td>
              <td>Review</td>
            </tr>

            <tr>
              <td>2</td>
              <td>2025-12-20</td>
              <td>Product Group</td>
              <td>W3P Supplier B</td>
              <td>GRP-3110</td>
              <td>Pending</td>
              <td>Review</td>
            </tr>

            <tr>
              <td>3</td>
              <td>2025-12-19</td>
              <td>Product Launch</td>
              <td>.63 Supplier</td>
              <td>PRD-20251211</td>
              <td>Ready</td>
              <td>Launch</td>
            </tr>-->
          </tbody>
        </table>
      </div>

    </div>
  </div>

</section>

<script src="../../view/overview/section_overview/section_overview.js?v=<?= file_exists('../../view/overview/section_overview/section_overview.js') ? filemtime('../../view/overview/section_overview/section_overview.js') : time() ?>" defer></script>
