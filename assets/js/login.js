document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      fetch("./api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, senha: senha }),
      })
        .then((response) => response.json())
        .then((data) => {
          const messageContainer = document.getElementById("response-message");

          if (data.status === "success" && data.user) {
            if (data.user.tipo === "aluno") {
              window.location.href = "./pages/dashboard_aluno.php";
            } else if (data.user.tipo === "professor") {
              window.location.href = "ainda não fiz";
            } else if (data.user.tipo === "coordenador") {
              window.location.href = "ainda não fiz";
            }
          } else {
            messageContainer.innerHTML = `<p class="text-danger">${data.message || "Erro no login"}</p>`;
          }
        })
        .catch((error) => console.error("Erro:", error));
    });
});
