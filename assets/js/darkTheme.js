// Get the root element
$(document).ready(function () {
    const root = document.documentElement;
    console.log(root);
    // Get the toggle button
    const toggle = document.getElementById("toggle");
    // Get the user's preference from localStorage
    const darkMode = localStorage.getItem("dark-mode");
    var navbar = document.querySelector(".nav-element");
    console.log(navbar)

    // Check if the user has already chosen a theme
    if (darkMode) {
        // If yes, apply it to the root element
        root.classList.add("dark-theme");
        navbar.classList.add("dark-theme")
    }
    // Add an event listener to the toggle button
    toggle.addEventListener("click", () => {
        // Toggle the dark-theme class on the root element
        root.classList.toggle("dark-theme");
        navbar.classList.toggle("dark-theme");
        console.log(navbar.classList)
        // Store or remove the user's preference in localStorage
        if (root.classList.contains("dark-theme")) {
            localStorage.setItem("dark-mode", true);
        } else {
            localStorage.removeItem("dark-mode");
        }
    });
});