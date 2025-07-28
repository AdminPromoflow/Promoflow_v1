<style media="screen">
  .containerUsersManagerBottoms{
    position: relative;
    background-color: rgb(92,108,128);
    border-radius: 5px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 300px;
    max-width: 60%;
    border-radius: 1px solid black;
    padding: 2vw 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
  }
</style>

<section class="bodyLogin">
  <!-- Section Title -->
  <h1 class="titleBodyLogin">Orders</h1>

  <div id="organize_order_lanyards_for_you" class="containerUsersManagerBottoms">
    <h1>Buenas</h1>
  </div>

</section>

<script type="text/javascript">
  getDataOrders();
  function getDataOrders(){
    // Define the URL and the JSON data you want to send
    const url = "../../../controller/lanyards/orders_lanyards.php"; // Replace with your API endpoint URL
    const data = {
      action: "getOrdersInfo"
    };

    fetch(url, {
    method: "POST", // HTTP POST method to send data
    headers: {
      "Content-Type": "application/json" // Indicate that you're sending JSON
    },
    body: JSON.stringify(data) // Convert the JSON object to a JSON string and send it
  })
    .then(response => {
      // Check if the response status is OK (2xx range)
      if (response.ok) {
        return response.json(); // Parse the response as JSON
      }
      // For other errors, throw a general network error
      throw new Error("Network error.");
    })
    .then(data => {
    //  alert(JSON.stringify(data));
      drawOrders(data);

      console.log(JSON.stringify(data));
      // Process the response data

    })
    .catch(error => {
      // Handle specific errors (from throw in the .then block)
      console.error("Error:", error.message);
      alert(error.message); // Show the error message in an alert
    });
  }
  function drawOrders(data) {
    const container = document.getElementById("organize_order_lanyards_for_you");
    container.innerHTML = data.map(({ order, user, address, jobs }) => {
      const jobsHTML = jobs.map(job => {
        const desc = JSON.parse(job.description);

        const textHTML = job.text
          ? `<p><strong>Text:</strong> ${job.text.contentText}</p>`
          : '';

        const imageHTML = job.image
          ? `<p><strong>Image:</strong> <img src="https://www.lanyardsforyou.com/${job.image.linkImage}" style="width: 100px;"></p>`
          : '';

        const artworkHTML = job.artwork
          ? `
            <div>
              <p><strong>Artwork:</strong></p>
              <img src="https://www.lanyardsforyou.com/${job.artwork.linkLeftImage}" alt="Left Artwork" style="width: 100px; margin-right: 10px;">
              <img src="https://www.lanyardsforyou.com/${job.artwork.linkRightImage}" alt="Right Artwork" style="width: 100px;">
            </div>
          `
          : '';

        return `
          <div class="job" style="margin-left: 20px; margin-bottom: 10px;">
            <p><strong>Job Name:</strong> ${job.name}</p>
            <p><strong>Description:</strong> ${desc.material.type}, ${desc.lanyard_type.type}, ${desc.width.value}, ${desc.side_printed.side}</p>
            ${textHTML}
            ${imageHTML}
            ${artworkHTML}
          </div>
        `;
      }).join('');

      return `
        <div class="order" style="border: 1px solid #ccc; margin-bottom: 20px; padding: 10px;">
          <h3>Order #${order.idOrder}</h3>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> $${parseFloat(order.total).toFixed(2)}</p>
          <p><strong>User:</strong> ${user.name} (${user.email})</p>
          <p><strong>Address:</strong> ${address.first_name} ${address.last_name}, ${address.company_name}, ${address.street_address_1}</p>
          <div class="jobs">
            <h4>Jobs</h4>
            ${jobsHTML}
          </div>
        </div>
      `;
    }).join('');
  }

</script>
