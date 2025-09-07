// Global variables
let currentFilter = 'all';
let currentView = 'grid';
let comparisonList = [];
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  filterProducts();
});

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Remove active class from all filter buttons
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    this.classList.add('active');
    
    currentFilter = this.getAttribute('data-category');
    filterProducts();
  });
});

// View toggle functionality
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Remove active class from all view buttons
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    this.classList.add('active');
    
    currentView = this.getAttribute('data-view');
    toggleView();
  });
});

// Filter products function
function filterProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const productCards = document.querySelectorAll('.product-card');
  const noResults = document.getElementById('noResults');
  let visibleCount = 0;

  productCards.forEach((card, index) => {
    const category = card.getAttribute('data-category');
    const name = card.getAttribute('data-name');
    const title = card.querySelector('.product-title').textContent.toLowerCase();
    
    const matchesFilter = currentFilter === 'all' || category === currentFilter;
    const matchesSearch = searchTerm === '' || 
                         name.includes(searchTerm) || 
                         title.includes(searchTerm);
    
    if (matchesFilter && matchesSearch) {
      card.style.display = 'block';
      // Add staggered animation
      card.style.animationDelay = `${visibleCount * 0.1}s`;
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Show/hide no results message
  if (visibleCount === 0) {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
  }
}

// Toggle view function
function toggleView() {
  const productsGrid = document.getElementById('productsGrid');
  
  if (currentView === 'list') {
    productsGrid.classList.add('list-view');
  } else {
    productsGrid.classList.remove('list-view');
  }
}

// Clear filters function
function clearFilters() {
  currentFilter = 'all';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
  filterProducts();
}

// Quick view functionality
function openQuickView(productId) {
  const modal = document.getElementById('quickViewModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  // Product data (in a real application, this would come from an API)
  const productData = getProductData(productId);
  
  modalTitle.textContent = productData.title;
  modalBody.innerHTML = generateQuickViewContent(productData);
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Generate quick view content
function generateQuickViewContent(product) {
  return `
    <div class="quick-view-content">
      <div class="quick-view-image">
        <div class="image-placeholder">
          <div class="placeholder-icon">${product.icon}</div>
        </div>
      </div>
      <div class="quick-view-details">
        <div class="product-category">${product.category}</div>
        <h3>${product.title}</h3>
        <div class="product-specs">
          ${product.specs.map(spec => `<span class="spec">${spec}</span>`).join('')}
        </div>
        <p class="product-description">${product.description}</p>
        <div class="detailed-specs">
          <h4>Specifications:</h4>
          <ul>
            ${product.detailedSpecs.map(spec => `<li>${spec}</li>`).join('')}
          </ul>
        </div>
        <div class="applications">
          <h4>Applications:</h4>
          <ul>
            ${product.applications.map(app => `<li>${app}</li>`).join('')}
          </ul>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" onclick="requestQuote('${product.id}')">Request Quote</button>
          <button class="btn-secondary" onclick="addToCompare('${product.id}')">Add to Compare</button>
        </div>
      </div>
    </div>
  `;
}

// Get product data
function getProductData(productId) {
  const products = {
    'soybean-meal-doc': {
      id: 'soybean-meal-doc',
      title: 'Soybean Meal (DOC) - 46% Protein',
      category: 'Soybean Meal',
      icon: '🌾',
      specs: ['46% Protein', 'Non-GMO', 'Premium Grade'],
      description: 'High-quality defatted soybean meal perfect for poultry and livestock feed with consistent protein content.',
      detailedSpecs: [
        'Protein Content: 46% minimum',
        'Crude Fat: 1.5% maximum',
        'Crude Fiber: 7% maximum',
        'Moisture: 12% maximum',
        'Ash Content: 6.5% maximum'
      ],
      applications: [
        'Poultry feed formulation',
        'Livestock feed supplement',
        'Aquaculture feed ingredient',
        'Pet food manufacturing'
      ]
    },
    'hipro-soybean': {
      id: 'hipro-soybean',
      title: 'Indian Non-GMO Hi-Pro Soybean Meal',
      category: 'Soybean Meal',
      icon: '🏆',
      specs: ['48-50% Protein', 'Non-GMO', 'Hi-Pro Grade'],
      description: 'Premium high-protein soybean meal with enhanced nutritional value for superior feed performance.',
      detailedSpecs: [
        'Protein Content: 48-50%',
        'Crude Fat: 1.0% maximum',
        'Crude Fiber: 6% maximum',
        'Moisture: 12% maximum',
        'Urease Activity: 0.05-0.30 pH units'
      ],
      applications: [
        'High-performance poultry feeds',
        'Premium livestock nutrition',
        'Export-quality feed manufacturing',
        'Specialty animal nutrition'
      ]
    },
    'flour-untoasted': {
      id: 'flour-untoasted',
      title: 'Defatted Soya Flour (Untoasted)',
      category: 'Soya Flour',
      icon: '🥛',
      specs: ['50% Protein', 'Light Color', 'Fine Texture'],
      description: 'Light-colored, fine-textured soya flour ideal for specialized feed applications requiring mild flavor.',
      detailedSpecs: [
        'Protein Content: 50% minimum',
        'Crude Fat: 1.5% maximum',
        'Moisture: 12% maximum',
        'Particle Size: 60-80 mesh',
        'Color: Light cream'
      ],
      applications: [
        'Young animal feed',
        'Specialty feed formulations',
        'Milk replacer ingredients',
        'Fine-textured feed applications'
      ]
    }
  };
  
  return products[productId] || {
    id: productId,
    title: 'Product Details',
    category: 'General',
    icon: '🌱',
    specs: ['Premium Quality', 'Non-GMO'],
    description: 'High-quality soy product for feed applications.',
    detailedSpecs: ['Contact us for detailed specifications'],
    applications: ['Feed manufacturing', 'Nutritional supplementation']
  };
}

// Close modal
function closeModal() {
  const modal = document.getElementById('quickViewModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('quickViewModal');
  if (event.target === modal) {
    closeModal();
  }
});

// Request quote functionality
function requestQuote(productId) {
  // Show quote request message
  showMessage(`Quote request submitted for ${productId}. We'll contact you soon!`, 'success');
  
  // In a real application, this would send data to your server
  console.log(`Quote requested for product: ${productId}`);
  
  // Close modal if it's open
  closeModal();
}

// View details functionality
function viewDetails(productId) {
  openQuickView(productId);
}

// Add to compare functionality
function addToCompare(productId) {
  if (comparisonList.includes(productId)) {
    showMessage('Product already in comparison list', 'info');
    return;
  }
  
  if (comparisonList.length >= 3) {
    showMessage('Maximum 3 products can be compared at once', 'warning');
    return;
  }
  
  comparisonList.push(productId);
  updateComparisonSection();
  showMessage('Product added to comparison', 'success');
}

// Remove from compare
function removeFromCompare(productId) {
  comparisonList = comparisonList.filter(id => id !== productId);
  updateComparisonSection();
  showMessage('Product removed from comparison', 'info');
}

// Update comparison section
function updateComparisonSection() {
  const comparisonSection = document.getElementById('comparisonSection');
  const comparisonTable = document.getElementById('comparisonTable');
  
  if (comparisonList.length === 0) {
    comparisonSection.style.display = 'none';
    return;
  }
  
  comparisonSection.style.display = 'block';
  
  // Generate comparison table
  let tableHTML = '<table class="comparison-table-content"><thead><tr><th>Feature</th>';
  comparisonList.forEach(productId => {
    const product = getProductData(productId);
    tableHTML += `<th>${product.title} <button onclick="removeFromCompare('${productId}')" class="remove-compare">×</button></th>`;
  });
  tableHTML += '</tr></thead><tbody>';
  
  // Add comparison rows
  const features = ['Category', 'Protein Content', 'Applications'];
  features.forEach(feature => {
    tableHTML += `<tr><td><strong>${feature}</strong></td>`;
    comparisonList.forEach(productId => {
      const product = getProductData(productId);
      let value = '';
      switch(feature) {
        case 'Category':
          value = product.category;
          break;
        case 'Protein Content':
          value = product.specs[0];
          break;
        case 'Applications':
          value = product.applications.slice(0, 2).join(', ');
          break;
      }
      tableHTML += `<td>${value}</td>`;
    });
    tableHTML += '</tr>';
  });
  
  tableHTML += '</tbody></table>';
  comparisonTable.innerHTML = tableHTML;
}

// Close comparison
function closeComparison() {
  comparisonList = [];
  updateComparisonSection();
}

// Toggle favorite
function toggleFavorite(productId) {
  const index = favorites.indexOf(productId);
  if (index > -1) {
    favorites.splice(index, 1);
    showMessage('Removed from favorites', 'info');
  } else {
    favorites.push(productId);
    showMessage('Added to favorites', 'success');
  }
  
  // Store in localStorage
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  // Update heart icon
  updateFavoriteIcons();
}

// Update favorite icons
function updateFavoriteIcons() {
  document.querySelectorAll('.product-card').forEach(card => {
    const productId = card.querySelector('.btn-icon[title="Favorite"]').getAttribute('onclick').match(/'([^']+)'/)[1];
    const heartIcon = card.querySelector('.btn-icon[title="Favorite"]');
    
    if (favorites.includes(productId)) {
      heartIcon.innerHTML = '❤️';
      heartIcon.style.color = '#ef4444';
    } else {
      heartIcon.innerHTML = '♡';
      heartIcon.style.color = 'white';
    }
  });
}

// Show message function
function showMessage(message, type = 'info') {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.toast-message');
  existingMessages.forEach(msg => msg.remove());
  
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `toast-message toast-${type}`;
  messageEl.textContent = message;
  
  // Style the message
  const colors = {
    success: { bg: '#d1fae5', color: '#065f46', border: '#10b981' },
    error: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' },
    warning: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
    info: { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' }
  };
  
  const style = colors[type] || colors.info;
  
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 350px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    background: ${style.bg};
    color: ${style.color};
    border-left: 4px solid ${style.border};
    cursor: pointer;
  `;
  
  document.body.appendChild(messageEl);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    messageEl.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => messageEl.remove(), 300);
  }, 4000);
  
  // Remove on click
  messageEl.addEventListener('click', () => {
    messageEl.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => messageEl.remove(), 300);
  });
}

// Download catalog
function downloadCatalog() {
  showMessage('Catalog download will be available soon. Please contact us for product information.', 'info');
}

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

// Loading animation for page
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  
  // Initialize product card animations with stagger
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
});

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .toast-message {
    transition: all 0.3s ease;
  }
  
  .toast-message:hover {
    opacity: 0.9;
    transform: translateX(-5px);
  }
  
  .comparison-table-content {
    width: 100%;
    border-collapse: collapse;
  }
  
  .comparison-table-content th,
  .comparison-table-content td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e5f5f0;
  }
  
  .comparison-table-content th {
    background: #f8fffe;
    font-weight: 600;
    color: #215600;
    position: relative;
  }
  
  .remove-compare {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 0.8rem;
    line-height: 1;
  }
  
  .quick-view-content {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
  }
  
  .quick-view-image .image-placeholder {
    height: 150px;
    border-radius: 10px;
  }
  
  .detailed-specs ul,
  .applications ul {
    margin: 0.5rem 0 1rem 1rem;
    color: #666;
  }
  
  .detailed-specs li,
  .applications li {
    margin-bottom: 0.25rem;
  }
  
  .modal-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  @media (max-width: 768px) {
    .quick-view-content {
      grid-template-columns: 1fr;
    }
    
    .modal-actions {
      flex-direction: column;
    }
  }
`;
document.head.appendChild(animationStyles);

// Initialize favorites on load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(updateFavoriteIcons, 1000); // Wait for cards to load
});

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

// Enhanced search with debounce
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function(e) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filterProducts();
  }, 300);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Escape key closes modal
  if (e.key === 'Escape') {
    closeModal();
  }
  
  // Ctrl/Cmd + K focuses search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  }
});

console.log('SM Agro Trades Products page loaded successfully!');