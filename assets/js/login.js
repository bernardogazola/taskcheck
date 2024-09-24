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
              window.location.href = "/aluno";
            } else if (data.user.tipo === "professor") {
              window.location.href = "ainda não fiz";
            } else if (data.user.tipo === "coordenador") {
              window.location.href = "/coordenador";
            }
          } else {
            messageContainer.innerHTML = `<p class="text-danger">${data.message || "Erro no login"}</p>`;
          }
        })
        .catch((error) => console.error("Erro:", error));
    });

    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('senha');
    const eyeIcon = document.getElementById('eye-icon');

    togglePassword.addEventListener('click', function (e) {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === 'text') {
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    });
});
