// Smooth scroll for anchor links
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

// Intersection Observer for fade-in animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections with fade-in class
document.querySelectorAll('.fade-in').forEach(element => {
  observer.observe(element);
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav__links--active');
  });
}

// Copy to clipboard functionality
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

// Toast notification system
const showToast = (message) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Trigger reflow
  toast.offsetHeight;
  
  toast.classList.add('toast--show');
  
  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
});

// Form validation and submission
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Basic form validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    if (!isValid) {
      showToast('Please fill in all required fields');
      return;
    }
    
    // Form submission logic here
    try {
      const formData = new FormData(form);
      // Add your form submission logic here
      showToast('Form submitted successfully!');
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      showToast('Something went wrong. Please try again.');
    }
  });
});

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scroll behavior to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Load structured data
const structuredDataScript = document.createElement('script');
structuredDataScript.src = 'js/structured-data.js';
document.head.appendChild(structuredDataScript);

// Product Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const productToggle = document.querySelector('.product-toggle__container');
  const productOptions = document.querySelectorAll('.product-toggle__option');
  const shopSection = document.querySelector('.section--shop');
  
  if (!productToggle || !productOptions.length || !shopSection) return;
  
  // Set initial state
  shopSection.setAttribute('data-product', 'hoodie');
  productToggle.setAttribute('data-active', 'hoodie');
  
  // Handle toggle clicks
  productOptions.forEach(option => {
    option.addEventListener('click', function() {
      const productType = this.getAttribute('data-product');
      
      // Don't do anything if already active
      if (productToggle.getAttribute('data-active') === productType) return;
      
      // Update active state
      productOptions.forEach(opt => opt.classList.remove('product-toggle__option--active'));
      this.classList.add('product-toggle__option--active');
      
      // Update container state
      productToggle.setAttribute('data-active', productType);
      
      // Update shop section state with a slight delay for animation
      setTimeout(() => {
        shopSection.setAttribute('data-product', productType);
        
        // Smooth scroll to top of shop section
        shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      
      // Add a subtle animation to the toggle
      productToggle.classList.add('product-toggle__container--animating');
      setTimeout(() => {
        productToggle.classList.remove('product-toggle__container--animating');
      }, 300);
    });
  });
  
  // Add touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  productToggle.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  productToggle.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const currentProduct = productToggle.getAttribute('data-active');
    
    if (touchEndX < touchStartX - swipeThreshold && currentProduct === 'hoodie') {
      // Swipe left - switch to t-shirt
      productOptions[1].click();
    } else if (touchEndX > touchStartX + swipeThreshold && currentProduct === 'tshirt') {
      // Swipe right - switch to hoodie
      productOptions[0].click();
    }
  }
}); 