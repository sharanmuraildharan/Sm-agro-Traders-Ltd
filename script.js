// Shrink navbar on scroll
window.addEventListener("scroll", function() {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("shrink");
  } else {
    navbar.classList.remove("shrink");
  }
});

// Reveal sections on scroll
const sections = document.querySelectorAll(".fade-in");

const options = {
  threshold: 0.2
};

const observer = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, options);

sections.forEach(section => {
  observer.observe(section);
});
