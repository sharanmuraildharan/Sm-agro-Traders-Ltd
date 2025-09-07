// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);
  
  // Basic validation
  if (!data.firstName || !data.email || !data.phone || !data.message) {
    showMessage('Please fill in all required fields.', 'error');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showMessage('Please enter a valid email address.', 'error');
    return;
  }
  
  // Simulate form submission (replace with actual form handling)
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
}