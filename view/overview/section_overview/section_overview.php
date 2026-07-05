<link rel="stylesheet" href="../../view/overview/section_overview/section_overview.css?v=<?= file_exists('../../view/overview/section_overview/section_overview.css') ? filemtime('../../view/overview/section_overview/section_overview.css') : time() ?>">

<section class="section-overview">

  <?php include "../../view/global/section_sidebar_navigation/section_sidebar_navigation.php" ?>
  <div class="section-overview-responsive">
    <header class="section-overview-header">
      <h1>Operations Dashboard</h1>
      <p>Organised overview: Messages, approvals and orders by platform.</p>
    </header>



    <!-- =========================
         DETAILS CONTAINER (tabs + table)
    ========================== -->
    <div class="approvals-details-container">

      <div class="details-header">
        <h2>Approbals</h2>

        <div class="details-tabs">
          <div class="details-tab-item pending_to_construction">
            <h4>W3P</h4>
            <div class="details-tab-count"><p>3</p></div>
          </div>

          <div class="details-tab-item pending_to_construction is-active">
            <h4>.63</h4>
            <div class="details-tab-count"><p>0</p></div>
          </div>

          <div class="details-tab-item pending_to_construction">
            <h4>Amazon</h4>
            <div class="details-tab-count"><p>0</p></div>
          </div>

          <div class="details-tab-item pending_to_construction">
            <h4>eBay</h4>
            <div class="details-tab-count"><p>0</p></div>
          </div>

          <div class="details-tab-item pending_to_construction">
            <h4>Ullman Sails</h4>
            <div class="details-tab-count"><p>0</p></div>
          </div>

          <div class="details-tab-item pending_to_construction">
            <h4>Hello Print</h4>
            <div class="details-tab-count"><p>0</p></div>
          </div>
        </div>
      </div>

      <div class="details-table-scroll">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Approval type</th>
              <th>Submit by</th>
              <th>Product name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody id="table_overview_details"></tbody>
        </table>
      </div>

    </div>
  </div>

</section>

<script src="../../view/overview/section_overview/section_overview.js?v=<?= file_exists('../../view/overview/section_overview/section_overview.js') ? filemtime('../../view/overview/section_overview/section_overview.js') : time() ?>" defer></script>
