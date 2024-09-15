// VERIFICAR SESSION
fetch("../api/sessionCheck.php")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (data.status === "error") {
      window.location.href = "../index.html";
    }
  })
  .catch((error) => console.error("Erro ao verificar a sessão:", error));

// LOGOUT
document
  .getElementById("logout-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "../api/logout.php";
  });
