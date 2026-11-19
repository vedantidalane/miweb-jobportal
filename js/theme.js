// js/theme.js
// Simple dark/light mode toggle using class on body and storing preference in localStorage

(() => {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const setTheme = (dark) => {
        document.body.classList.toggle('dark-mode', dark);
        // Adjust navbar colors
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.toggle('navbar-dark-mode', dark);
        localStorage.setItem('darkMode', dark ? '1' : '0');
    };
    // Load saved preference
    const saved = localStorage.getItem('darkMode');
    setTheme(saved === '1');
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isDark = document.body.classList.contains('dark-mode');
        setTheme(!isDark);
    });
})();