const input = document.getElementById("input");
const cajaGrande = document.getElementById("caja_grande");
const body = document.body;
const html = document.documentElement;

input.addEventListener("click", function () {
    alert("hi");

    cajaGrande.style.height = "200px";
    body.style.height = "300px";
    html.style.height = "400px";

});
