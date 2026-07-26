const input = document.getElementById("input");
const container = document.getElementById("container");

const body = document.body;
const html = document.documentElement;

input.addEventListener("click", function () {
  container.style.background = "red";
  body.style.background = "purple";
   body.style.height = "300px";
   html.style.height = "400px";
   html.style.background = "brown";

    // alert("hi");
    //
    // cajaGrande.style.height = "200px";
    // body.style.height = "300px";
    // html.style.height = "400px";

});
