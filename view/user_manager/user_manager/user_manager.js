const users = [
     {
       name: "Alejandra Rozo",
       role: "Programadora",
       email: "ale@gmail.com",
       img: "https://randomuser.me/api/portraits/women/44.jpg"
     },
     {
       name: "Carlos Mendoza",
       role: "Diseñador UX",
       email: "carlos@gmail.com",
       img: "https://randomuser.me/api/portraits/men/32.jpg"
     },
     {
       name: "Laura Jiménez",
       role: "Gerente de proyectos",
       email: "laura@empresa.com",
       img: "https://randomuser.me/api/portraits/women/66.jpg"
     }
   ];

   const grid = document.getElementById("userGrid");

   users.forEach(user => {
     grid.innerHTML += `
       <div class="grid_item user_info">
         <div class="user_image" style="background-image: url('${user.img}')"></div>
         <span>${user.name}</span>
       </div>
       <div class="grid_item">${user.role}</div>
       <div class="grid_item">${user.email}</div>
     `;
   });


   // Information EJEMPLO
   function showUserDetails(user) {
  document.getElementById("user_fullname").innerText = user.name;
  document.getElementById("user_email").innerText = user.email;
  document.getElementById("user_last_visit").innerText = user.last_visit;
  document.getElementById("user_role").innerText = user.role;

  document.getElementById("user_details_container").style.display = "block";
}
//  Y SI SE UNA PHP
// Ejemplo de consulta SQL
$id = $_GET['id']; // con protección contra inyección, usar prepared statements
$query = "SELECT full_name, email, last_visit, role FROM users WHERE id = $id";
$result = mysqli_query($conn, $query);
$user = mysqli_fetch_assoc($result);
?>

<script>
showUserDetails({
  name: "<?= $user['full_name'] ?>",
  email: "<?= $user['email'] ?>",
  last_visit: "<?= $user['last_visit'] ?>",
  role: "<?= $user['role'] ?>"
});
