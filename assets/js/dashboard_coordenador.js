document.addEventListener("DOMContentLoaded", function () {
    const toggleSidebarButton = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");

    // BTN MOSTRAR/ESCONDER SIDEBAR
    toggleSidebarButton.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        content.classList.toggle("sidebar-hidden");
    });
});

// LOGOUT
document
    .getElementById("logout-btn")
    .addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "../api/logout.php";
    });