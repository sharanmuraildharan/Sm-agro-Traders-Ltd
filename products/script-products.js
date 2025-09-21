// Global variables
let currentFilter = 'all';
let currentView = 'grid';
let comparisonList = [];
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let currentZoom = 1;

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
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.getAttribute('data-category');
    filterProducts();
  });
});

// View toggle functionality
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
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
      card.style.animationDelay = `${visibleCount * 0.1}s`;
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

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

// Generate quick view content
function generateQuickViewContent(product) {
  return `
    <div class="quick-view-content">
      <div class="quick-view-image">
        <div class="product-image-container">
          <img src="${product.imageUrl}" alt="${product.title}" class="product-detail-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="image-placeholder fallback-placeholder" style="display: none;">
            <div class="placeholder-icon">${product.icon}</div>
          </div>
          <div class="image-zoom-overlay">
            <button class="zoom-btn" onclick="openImageZoom('${product.imageUrl}', '${product.title}')" title="View larger image">🔍</button>
          </div>
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
      imageUrl: 'https://nutrimake.in/wp-content/uploads/2024/12/soya-doc-500x500-2.webp',
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
      imageUrl: 'https://moepl.com/wp-content/uploads/2022/10/2-2-2048x1365.jpg',
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
      imageUrl: 'https://2.wlimg.com/product_images/bc-full/2024/11/14039868/defatted-soya-flour-untoasted-1730974470-7672990.jpg',
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
    },
    'flour-toasted': {
      id: 'flour-toasted',
      title: 'Defatted Soya Flour (Toasted)',
      category: 'Soya Flour',
      icon: '🍞',
      imageUrl: 'https://scratchfood.us/cdn/shop/articles/5b09d0d7549bc2ad6464860429c4d5da.png?v=1712002873',
      specs: ['48% Protein', 'Rich Flavor', 'Golden Color'],
      description: 'Toasted soya flour with enhanced flavor and improved digestibility for premium feed applications.',
      detailedSpecs: [
        'Protein Content: 48% minimum',
        'Crude Fat: 1.5% maximum',
        'Moisture: 12% maximum',
        'Particle Size: 60-80 mesh',
        'Color: Golden brown'
      ],
      applications: [
        'Enhanced palatability feeds',
        'Premium livestock nutrition',
        'Digestibility-focused formulations',
        'Flavor-enhanced feed products'
      ]
    },
    'full-fat-flour': {
      id: 'full-fat-flour',
      title: 'Full Fat Soya Flour',
      category: 'Soya Flour',
      icon: '🌟',
      imageUrl: 'https://2.wlimg.com/product_images/bc-full/dir_39/1141076/full-fat-soya-flour-1818060.jpg',
      specs: ['38% Protein', '18% Fat', 'High Energy'],
      description: 'Energy-rich full-fat soya flour providing both protein and essential fatty acids for optimal nutrition.',
      detailedSpecs: [
        'Protein Content: 38% minimum',
        'Crude Fat: 18% minimum',
        'Moisture: 12% maximum',
        'Energy Content: High',
        'Essential Fatty Acids: Present'
      ],
      applications: [
        'High-energy feed formulations',
        'Young animal nutrition',
        'Energy-dense feed applications',
        'Essential fatty acid supplementation'
      ]
    },
    'grits-untoasted': {
      id: 'grits-untoasted',
      title: 'Defatted Soya Grits (Untoasted)',
      category: 'Soya Grits',
      icon: '🌰',
      imageUrl: 'https://img500.exportersindia.com/product_images/bc-500/2023/9/5998964/soyabean-grit-1694847295-7084078.jpeg',
      specs: ['50% Protein', 'Coarse Texture', 'Natural'],
      description: 'Coarsely ground soya grits providing texture and nutrition for specialized feed formulations.',
      detailedSpecs: [
        'Protein Content: 50% minimum',
        'Crude Fat: 1.5% maximum',
        'Moisture: 12% maximum',
        'Particle Size: 8-20 mesh',
        'Texture: Coarse'
      ],
      applications: [
        'Textural variety in feeds',
        'Specialty feed formulations',
        'Uniform particle distribution',
        'Feed texture enhancement'
      ]
    },
    'grits-toasted': {
      id: 'grits-toasted',
      title: 'Soya Grits Defatted (Toasted)',
      category: 'Soya Grits',
      icon: '🔥',
      imageUrl: 'https://2.wlimg.com/product_images/bc-full/2024/11/14039868/soya-grits-defatted-toasted-1730974188-7673005.jpeg',
      specs: ['48% Protein', 'Enhanced Flavor', 'Improved Digestibility'],
      description: 'Toasted soya grits with improved palatability and digestibility for enhanced feed performance.',
      detailedSpecs: [
        'Protein Content: 48% minimum',
        'Crude Fat: 1.5% maximum',
        'Moisture: 12% maximum',
        'Particle Size: 8-20 mesh',
        'Processing: Heat treated'
      ],
      applications: [
        'Enhanced palatability feeds',
        'Better digestibility formulations',
        'Improved feed performance',
        'Premium feed applications'
      ]
    },
    'soya-flakes': {
      id: 'soya-flakes',
      title: 'Soya Flakes',
      category: 'Specialty Products',
      icon: '🥣',
      imageUrl: 'https://seasonsinternational.in/wp-content/uploads/2024/06/untoasted-defatted-soya-flakes.webp',
      specs: ['45% Protein', 'Rolled Texture', 'Easy Mixing'],
      description: 'Rolled soya flakes providing excellent mixability and uniform distribution in feed formulations.',
      detailedSpecs: [
        'Protein Content: 45% minimum',
        'Crude Fat: 1.5% maximum',
        'Moisture: 12% maximum',
        'Form: Rolled flakes',
        'Mixing: Excellent'
      ],
      applications: [
        'Superior mixing properties',
        'Uniform feed distribution',
        'Feed processing enhancement',
        'Texture improvement'
      ]
    },
    'tvp-granules': {
      id: 'tvp-granules',
      title: 'TVP Soya Granules',
      category: 'Specialty Products',
      icon: '🎯',
      imageUrl: 'https://2.wlimg.com/product_images/bc-full/2024/11/14039868/tvp-soya-granules-1730975633-7672730.jpeg',
      specs: ['52% Protein', 'Textured', 'High Absorption'],
      description: 'Textured vegetable protein granules providing superior protein content and excellent water absorption.',
      detailedSpecs: [
        'Protein Content: 52% minimum',
        'Crude Fat: 1.0% maximum',
        'Moisture: 10% maximum',
        'Water absorption: 1:3',
        'Texture: Granular'
      ],
      applications: [
        'Highest protein applications',
        'Water retention systems',
        'Textured feed products',
        'Premium nutrition formulations'
      ]
    },
    'soya-chunks': {
      id: 'soya-chunks',
      title: 'Soya Chunks',
      category: 'Specialty Products',
      icon: '🧊',
      imageUrl: 'https://uploads-ssl.webflow.com/652fa48dbb0bdb53c30277ac/65302c2a0db5313db4f7bd53_645a38c6dac5ab4121eec82d_6420b003f2602ac805f295d5_Untitled%252520design%252520(37).png',
      specs: ['50% Protein', 'Large Pieces', 'Meat-like Texture'],
      description: 'Large soya chunks providing substantial texture and protein for specialized feed applications.',
      detailedSpecs: [
        'Protein Content: 50% minimum',
        'Crude Fat: 1.5% maximum',
        'Moisture: 12% maximum',
        'Size: Large chunks',
        'Texture: Substantial'
      ],
      applications: [
        'Substantial texture feeds',
        'High protein density',
        'Specialized feed applications',
        'Texture-focused formulations'
      ]
    }
  };
  
  return products[productId] || {
    id: productId,
    title: 'Product Details',
    category: 'General',
    icon: '🌱',
    imageUrl: '/img/products/default-product.jpg',
    specs: ['Premium Quality', 'Non-GMO'],
    description: 'High-quality soy product for feed applications.',
    detailedSpecs: ['Contact us for detailed specifications'],
    applications: ['Feed manufacturing', 'Nutritional supplementation']
  };
}

// Quick view functionality
function openQuickView(productId) {
  const modal = document.getElementById('quickViewModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  const productData = getProductData(productId);
  
  modalTitle.textContent = productData.title;
  modalBody.innerHTML = generateQuickViewContent(productData);
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Enhanced image zoom with keyboard controls
function openImageZoom(imageUrl, productTitle) {
  currentZoom = 1;
  
  const zoomModal = document.createElement('div');
  zoomModal.className = 'image-zoom-modal';
  zoomModal.innerHTML = `
    <div class="zoom-modal-overlay" onclick="closeImageZoom()">
      <div class="zoom-modal-content" onclick="event.stopPropagation()">
        <div class="zoom-modal-header">
          <h3>${productTitle}</h3>
          <div class="zoom-shortcuts">
            <span>+/- to zoom • ESC to close</span>
          </div>
          <button class="zoom-close" onclick="closeImageZoom()">&times;</button>
        </div>
        <div class="zoom-image-container">
          <img src="${imageUrl}" alt="${productTitle}" class="zoomed-image">
        </div>
        <div class="zoom-controls">
          <button class="zoom-btn-control" onclick="zoomIn()">🔍+ (100%)</button>
          <button class="zoom-btn-control" onclick="zoomOut()">🔍- (100%)</button>
          <button class="zoom-btn-control" onclick="resetZoom()">⟲ Reset</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(zoomModal);
  document.body.style.overflow = 'hidden';
}

function closeImageZoom() {
  const zoomModal = document.querySelector('.image-zoom-modal');
  if (zoomModal) {
    zoomModal.remove();
    document.body.style.overflow = 'auto';
  }
}

function zoomIn() {
  const maxZoom = 3;
  if (currentZoom < maxZoom) {
    currentZoom += 0.2;
    updateZoom();
  }
}

function zoomOut() {
  const minZoom = 0.5;
  if (currentZoom > minZoom) {
    currentZoom = Math.max(minZoom, currentZoom - 0.2);
    updateZoom();
  }
}

function resetZoom() {
  currentZoom = 1;
  updateZoom();
}

function updateZoom() {
  const image = document.querySelector('.zoomed-image');
  if (image) {
    image.style.transform = `scale(${currentZoom})`;
    updateZoomButtons();
  }
}

function updateZoomButtons() {
  const zoomLevel = Math.round(currentZoom * 100);
  const zoomInBtn = document.querySelector('.zoom-btn-control[onclick="zoomIn()"]');
  const zoomOutBtn = document.querySelector('.zoom-btn-control[onclick="zoomOut()"]');
  
  if (zoomInBtn) zoomInBtn.innerHTML = `🔍+ (${zoomLevel}%)`;
  if (zoomOutBtn) zoomOutBtn.innerHTML = `🔍- (${zoomLevel}%)`;
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

// Request quote - redirects to contact page
function requestQuote(productId) {
  const productData = getProductData(productId);
  
  const quoteData = {
    productId: productData.id,
    productTitle: productData.title,
    productCategory: productData.category,
    timestamp: new Date().toISOString()
  };
  
  sessionStorage.setItem('quoteRequest', JSON.stringify(quoteData));
  showMessage(`Redirecting to contact page for ${productData.title} quote...`, 'success');
  closeModal();
  
  setTimeout(() => {
    window.location.href = '/contact-us/contact.html';
  }, 1000);
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
  
  let tableHTML = '<table class="comparison-table-content"><thead><tr><th>Feature</th>';
  comparisonList.forEach(productId => {
    const product = getProductData(productId);
    tableHTML += `<th>${product.title} <button onclick="removeFromCompare('${productId}')" class="remove-compare">×</button></th>`;
  });
  tableHTML += '</tr></thead><tbody>';
  
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
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
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
  const existingMessages = document.querySelectorAll('.toast-message');
  existingMessages.forEach(msg => msg.remove());
  
  const messageEl = document.createElement('div');
  messageEl.className = `toast-message toast-${type}`;
  messageEl.textContent = message;
  
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
  
  setTimeout(() => {
    messageEl.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => messageEl.remove(), 300);
  }, 4000);
  
  messageEl.addEventListener('click', () => {
    messageEl.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => messageEl.remove(), 300);
  });
}

// Download catalog
function downloadCatalog() {
  showMessage('Catalog download will be available soon. Please contact us for product information.', 'info');
}

// Enhanced keyboard shortcuts with zoom
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
    closeImageZoom();
  }
  
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  }
  
  const imageZoomModal = document.querySelector('.image-zoom-modal');
  if (imageZoomModal) {
    switch(e.key) {
      case '+':
      case '=':
        e.preventDefault();
        zoomIn();
        break;
      case '-':
        e.preventDefault();
        zoomOut();
        break;
      case '0':
        e.preventDefault();
        resetZoom();
        break;
    }
  }
});

// Loading animation
window.addEventListener('load', function() {
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
});

// Initialize favorites
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(updateFavoriteIcons, 1000);
});

// Enhanced search with debounce
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function(e) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filterProducts();
  }, 300);
});

// Add required CSS animations
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
  
  .zoom-shortcuts {
    font-size: 0.8rem;
    color: #666;
    opacity: 0.8;
  }
`;
document.head.appendChild(animationStyles);

console.log('SM Agro Trades Products page loaded successfully!');