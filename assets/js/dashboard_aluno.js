// LOGOUT
document
  .getElementById("logout-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "../api/logout.php";
  });
