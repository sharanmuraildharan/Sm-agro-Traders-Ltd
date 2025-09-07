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

// Animation on scroll functionality
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;
      
      // Add fade-in animation
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      
      // Add stagger effect for grid items
      if (element.classList.contains('value-card') || 
          element.classList.contains('advantage-item') ||
          element.classList.contains('step')) {
        const delay = parseInt(element.dataset.aosDelay) || 0;
        element.style.transitionDelay = delay + 'ms';
      }
      
      // Animate counters for stats
      if (element.classList.contains('stat-item')) {
        animateCounter(element.querySelector('h3'));
      }
    }
  });
}, observerOptions);

// Counter animation function
function animateCounter(element) {
  const target = element.textContent;
  const isNumber = /^\d+$/.test(target);
  
  if (isNumber) {
    const targetNumber = parseInt(target);
    let current = 0;
    const increment = targetNumber / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        element.textContent = targetNumber;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 30);
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set initial state for animated elements
  const animatedElements = document.querySelectorAll(
    '.value-card, .advantage-item, .step, .stat-item, .visual-card, .chart-item'
  );
  
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Observe all animated elements
  animatedElements.forEach(element => {
    animateOnScroll.observe(element);
  });
  
  // Special animations for hero elements
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
      heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 300);
  }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const heroOverlay = document.querySelector('.hero-overlay');
  
  if (heroOverlay) {
    heroOverlay.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Interactive hover effects for value cards
document.addEventListener('DOMContentLoaded', function() {
  const valueCards = document.querySelectorAll('.value-card');
  
  valueCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(-10px) scale(1)';
    });
  });
});

// Process chart animation
function animateProcessChart() {
  const chartItems = document.querySelectorAll('.chart-item');
  const arrows = document.querySelectorAll('.arrow');
  
  chartItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
      
      // Animate arrow after item
      if (arrows[index]) {
        setTimeout(() => {
          arrows[index].style.opacity = '1';
          arrows[index].style.transform = 'scale(1)';
        }, 200);
      }
    }, index * 300);
  });
}

// Trigger process chart animation when in view
const processChart = document.querySelector('.process-chart');
if (processChart) {
  // Set initial state
  const chartItems = processChart.querySelectorAll('.chart-item');
  const arrows = processChart.querySelectorAll('.arrow');
  
  chartItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  arrows.forEach(arrow => {
    arrow.style.opacity = '0';
    arrow.style.transform = 'scale(0)';
    arrow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
  
  const chartObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateProcessChart();
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  chartObserver.observe(processChart);
}

// Add loading animation for the page
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
  body:not(.loaded) {
    overflow: hidden;
  }
  
  body:not(.loaded)::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #215600;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  body:not(.loaded)::after {
    content: '🌱';
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    z-index: 10000;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.2); }
  }
  
  body.loaded::before,
  body.loaded::after {
    display: none;
  }
`;

document.head.appendChild(loadingStyles);

// Scroll progress indicator
function createScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #4ade80, #22c55e);
    z-index: 10001;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// Initialize scroll progress on DOM load
document.addEventListener('DOMContentLoaded', createScrollProgress);

// Add smooth reveal animation for sections
function addSectionReveal() {
  const sections = document.querySelectorAll('section:not(.hero-about)');
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });
  
  const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}

// Initialize section reveal on DOM load
document.addEventListener('DOMContentLoaded', addSectionReveal);