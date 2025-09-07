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

// Counter animation for statistics
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const increment = target / 50;
    let current = 0;
    
    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  });
}

// Intersection Observer for animations
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
      
      // Trigger counter animation for stat cards
      if (element.classList.contains('impact-stats')) {
        setTimeout(() => animateCounters(), 300);
      }
      
      // Add stagger effect for grid items
      if (element.classList.contains('photo-item') || 
          element.classList.contains('story-card') ||
          element.classList.contains('goal-item')) {
        const delay = Array.from(element.parentElement.children).indexOf(element) * 100;
        element.style.transitionDelay = delay + 'ms';
      }
    }
  });
}, observerOptions);

// Photo gallery interactions
function initPhotoGallery() {
  const photoItems = document.querySelectorAll('.photo-item');
  
  photoItems.forEach(item => {
    // Add click handler for modal (can be expanded later)
    item.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      console.log(`Clicked photo in category: ${category}`);
      // Here you could open a modal or lightbox
    });
    
    // Enhanced hover effects
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
      this.style.boxShadow = '0 15px 40px rgba(33, 86, 0, 0.2)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(-5px) scale(1)';
      this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    });
  });
}

// Journey step animation
function animateJourneySteps() {
  const journeySteps = document.querySelectorAll('.journey-step');
  
  journeySteps.forEach((step, index) => {
    setTimeout(() => {
      step.style.opacity = '1';
      step.style.transform = 'translateY(0)';
      
      // Animate the step number with a bounce effect
      const stepNumber = step.querySelector('.step-number');
      if (stepNumber) {
        stepNumber.style.animation = 'bounceIn 0.6s ease';
      }
    }, index * 200);
  });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set initial state for animated elements
  const animatedElements = document.querySelectorAll(
    '.photo-item, .story-card, .goal-item, .stat-card, .pillar, .journey-step, .impact-stats'
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
  
  // Initialize photo gallery
  initPhotoGallery();
  
  // Special animation for hero content
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
      heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 500);
  }
  
  // Animate journey steps when in view
  const journeyGrid = document.querySelector('.journey-grid');
  if (journeyGrid) {
    const journeySteps = journeyGrid.querySelectorAll('.journey-step');
    
    journeySteps.forEach(step => {
      step.style.opacity = '0';
      step.style.transform = 'translateY(20px)';
      step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    const journeyObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateJourneySteps();
          journeyObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    journeyObserver.observe(journeyGrid);
  }
});

// Parallax effects
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const heroOverlay = document.querySelector('.hero-overlay');
  
  if (heroOverlay) {
    heroOverlay.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
  
  // Parallax for photo items
  const photoItems = document.querySelectorAll('.photo-item');
  photoItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    const speed = 0.2;
    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
      const yPos = -(scrolled * speed);
      const placeholder = item.querySelector('.photo-placeholder');
      if (placeholder) {
        placeholder.style.transform = `translateY(${yPos}px)`;
      }
    }
  });
});

// Add bounce animation CSS
const bounceAnimation = document.createElement('style');
bounceAnimation.textContent = `
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(1); }
  }
  
  .photo-item {
    will-change: transform;
  }
  
  .stat-card {
    will-change: transform;
  }
`;
document.head.appendChild(bounceAnimation);

// Loading animation
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});

// Add loading CSS
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
    background: linear-gradient(135deg, #215600, #4ade80);
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
    font-size: 4rem;
    z-index: 10000;
    animation: pulse 1.5s infinite;
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

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', createScrollProgress);

// Image placeholder interaction
document.addEventListener('DOMContentLoaded', function() {
  const placeholders = document.querySelectorAll('.photo-placeholder');
  
  placeholders.forEach(placeholder => {
    placeholder.addEventListener('click', function() {
      const noteElement = this.querySelector('.photo-note');
      if (noteElement) {
        noteElement.style.background = '#4ade80';
        noteElement.style.color = 'white';
        noteElement.style.transform = 'scale(1.05)';
        noteElement.textContent = 'Click here to upload your image!';
        
        setTimeout(() => {
          noteElement.style.background = 'rgba(255, 255, 255, 0.8)';
          noteElement.style.color = '#666';
          noteElement.style.transform = 'scale(1)';
          noteElement.textContent = noteElement.getAttribute('data-original') || 'Replace with your image';
        }, 2000);
      }
    });
  });
  
  // Store original text
  placeholders.forEach(placeholder => {
    const noteElement = placeholder.querySelector('.photo-note');
    if (noteElement) {
      noteElement.setAttribute('data-original', noteElement.textContent);
    }
  });
});

// Enhanced story card interactions
document.addEventListener('DOMContentLoaded', function() {
  const storyCards = document.querySelectorAll('.story-card');
  
  storyCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
      this.style.boxShadow = '0 20px 50px rgba(33, 86, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(-5px) scale(1)';
      this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    });
  });
});