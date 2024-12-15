// You can add interactive scripts here (e.g., form validation, animations, etc.)

// Example: Scroll-to-top functionality
const ctaButton = document.querySelector('.cta-button');

ctaButton.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});
