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

          if (data.status === "success") {
            messageContainer.innerHTML = `<p class="text-success">Login realizado com sucesso! Bem-vindo, ${data.user.nome} (${data.user.tipo})</p>`;
          } else {
            messageContainer.innerHTML = `<p class="text-danger">${data.message}</p>`;
          }
        })
        .catch((error) => console.error("Erro:", error));
    });
});
