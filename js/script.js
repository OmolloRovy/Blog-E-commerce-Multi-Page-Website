document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    mobileMenuBtn.addEventListener('click', function() {
        navList.classList.toggle('active');
        this.innerHTML = navList.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
        return count;
    }
    
    updateCartCount();

    // Cart Dropdown Functionality
    const cartIcon = document.getElementById("cart-icon");
    const cartDropdown = document.getElementById("cart-dropdown");
    const closeCart = document.querySelector(".close-cart");

    // Toggle dropdown visibility when cart icon is clicked
    cartIcon.addEventListener("click", () => {
        cartDropdown.classList.toggle("hidden");
    });

    // Hide dropdown when close button is clicked
    closeCart.addEventListener("click", () => {
        cartDropdown.classList.add("hidden");
    });

    // Load cart items in dropdown
    function loadCartDropdown() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            return;
        }
        
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-dropdown-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-dropdown-item-details">
                    <h4 class="cart-dropdown-item-title">${item.name}</h4>
                    <p class="cart-dropdown-item-price">$${item.price.toFixed(2)}</p>
                    <p class="cart-dropdown-item-quantity">Qty: ${item.quantity}</p>
                    <button class="remove-item-dropdown">Remove</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item-dropdown').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.closest('.cart-dropdown-item').dataset.id);
                removeItemFromCart(itemId);
                loadCartDropdown();
                updateCartCount();
                updateCartSummary();
            });
        });
        
        updateCartSummary();
    }

    // Update cart summary in dropdown
    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const cartSubtotal = document.getElementById('cart-subtotal');
        if (cartSubtotal) {
            cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        }
    }

    // Remove item from cart
    function removeItemFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update item quantity in cart
    function updateCartItemQuantity(itemId, newQuantity) {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }

    // Add to cart function
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if (cartDropdown) {
            loadCartDropdown();
        }
        
        return existingItem ? existingItem.quantity : 1;
    }

    // Product filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productGrid = document.getElementById('product-grid');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const category = this.dataset.category;
                filterProducts(category);
            });
        });
    }

    // Load products
    if (productGrid) {
        loadProducts();
    }

    // Load featured content on homepage
    const featuredPosts = document.getElementById('featured-posts');
    const featuredProducts = document.getElementById('featured-products');
    
    if (featuredPosts) {
        loadFeaturedPosts();
    }
    
    if (featuredProducts) {
        loadFeaturedProducts();
    }

    // Functions
    function filterProducts(category) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    function loadProducts() {
        // In a real app, this would come from an API
        const products = [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 99.99,
                image: "../images/headphones.png",
                category: "electronics"
            },
            {
                id: 2,
                name: "Cotton T-Shirt",
                price: 24.99,
                image: "https://www.shutterstock.com/image-photo/blank-tshirt-template-fashion-merch-designers-2526104397",
                category: "clothing"
            },
            {
                id: 3,
                name: "JavaScript Programming Book",
                price: 39.99,
                image: "https://www.shutterstock.com/image-vector/programming-language-concept-php-css-xml-1035577024",
                category: "books"
            },
            {
                id: 4,
                name: "Smart Watch",
                price: 199.99,
                image: "https://www.shutterstock.com/image-photo/3d-smartwatches-set-isolated-on-white-background-2499554249",
                category: "electronics"
            }
        ];

        productGrid.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">Kes ${product.price.toFixed(2)}</p>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');

        // Add event listeners to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const product = products.find(p => p.id === productId);
                const quantity = addToCart(product);
                
                // Show added to cart feedback
                this.textContent = `Added (${quantity})`;
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                }, 2000);
            });
        });
    }

    function loadFeaturedPosts() {
        // In a real app, this would come from an API
        const posts = [
            {
                title: "10 Tips for Better Productivity",
                excerpt: "Discover practical tips to boost your productivity.",
                date: "2025-05-15",
                image: "https://www.shutterstock.com/image-photo/discover-explore-variety-effective-tips-that-2545571209"
            },
            {
                title: "The Future of Web Development",
                excerpt: "Exploring the latest trends in web development.",
                date: "2025-05-10",
                image: "https://www.shutterstock.com/image-photo/software-engineer-development-concepts-programming-various-2485654259"
            }
        ];

        featuredPosts.innerHTML = posts.map(post => `
            <article class="blog-card">
                <img src="${post.image}" alt="${post.title}">
                <div class="blog-content">
                    <h2><a href="blog/post.html">${post.title}</a></h2>
                    <p class="meta">Posted on <time datetime="${post.date}">${new Date(post.date).toLocaleDateString()}</time></p>
                    <p>${post.excerpt}</p>
                    <a href="blog/post.html" class="read-more">Read More</a>
                </div>
            </article>
        `).join('');
    }

    function loadFeaturedProducts() {
        // In a real app, this would come from an API
        const products = [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 2099.99,
                image: "../images/headphones.png",
                category: "electronics"
            },
            {
                id: 2,
                name: "Cotton T-Shirt",
                price: 2024.99,
                image: "https://www.shutterstock.com/image-photo/blank-tshirt-template-fashion-merch-designers-2526104397",
                category: "clothing"
            }
        ];

        featuredProducts.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');

        // Add event listeners to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const product = products.find(p => p.id === productId);
                const quantity = addToCart(product);
                
                // Show added to cart feedback
                this.textContent = `Added (${quantity})`;
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                }, 2000);
            });
        });
    }
});

// Product Page Specific Functionality
if (document.querySelector('.product-detail')) {
    // Thumbnail image switching
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumbnail
            this.classList.add('active');
            // Update main image
            mainImage.src = this.dataset.image;
            mainImage.alt = this.alt;
        });
    });
    
    // Quantity selector
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    minusBtn.addEventListener('click', function(e) {
        e.preventDefault();
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function(e) {
        e.preventDefault();
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
        }
    });
    
    // Tab switching
    const tabNavItems = document.querySelectorAll('.tab-nav li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update tab navigation
            tabNavItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Update tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Star rating for reviews
    const ratingStars = document.querySelectorAll('.rating-input i');
    const ratingInput = document.getElementById('review-rating');
    
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingInput.value = rating;
            
            // Update star display
            ratingStars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('active');
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });
    
    // Load related products
    const relatedProductsContainer = document.getElementById('related-products');
    
    if (relatedProductsContainer) {
        // In a real app, this would come from an API
        const relatedProducts = [
            {
                id: 4,
                name: "Bluetooth Speaker",
                price: 59.99,
                image: "https://www.shutterstock.com/image-photo/blue-portable-wireless-bluetooth-speaker-isolated-2498124455"
            },
            {
                id: 5,
                name: "Earbuds",
                price: 39.99,
                image: "https://www.shutterstock.com/image-photo/front-view-blue-wireless-earbuds-charging-2314405417",
                category: "electronics"
            },
            {
                id: 6,
                name: "Headphone Stand",
                price: 24.99,
                image: "https://www.shutterstock.com/image-photo/wireless-headphones-microphone-computer-games-black-1781437439",
                category: "accessories"
            }
        ];
        
        relatedProductsContainer.innerHTML = relatedProducts.map(product => `
            <div class="product-card" data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const product = relatedProducts.find(p => p.id === productId);
                const quantity = addToCart(product);
                
                // Show added to cart feedback
                this.textContent = `Added (${quantity})`;
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                }, 2000);
            });
        });
    }
}

// Cart Page Functionality
if (document.getElementById('cart-items')) {
    // Load cart items
    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            document.querySelector('.empty-cart-message').style.display = 'flex';
            document.querySelector('.checkout-btn').style.display = 'none';
            return;
        } else {
            document.querySelector('.empty-cart-message').style.display = 'none';
            document.querySelector('.checkout-btn').style.display = 'block';
        }
        
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-variant">Color: Black</p>
                    <p class="cart-item-price">Kes ${item.price.toFixed(2)}</p>
                    <div class="cart-item-actions">
                        <button class="remove-item">Remove</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                        <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                    </div>
                    <p class="cart-item-total-price">Kes ${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="update-cart">Update</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        addCartItemEventListeners();
        
        // Update cart summary
        updateCartSummary();
    }
        // cart Icon reveal 
    document.getElementById('cart-icon').addEventListener('click', function() {
        alert('Checkout functionality would be implemented here!');
        // In a real app, this would redirect to a checkout page
    });
    
    // Add event listeners to cart items
    function addCartItemEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.nextElementSibling;
                let value = parseInt(input.value);
                if (value > 1) {
                    input.value = value - 1;
                    updateItemTotal(this);
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                let value = parseInt(input.value);
                if (value < 10) {
                    input.value = value + 1;
                    updateItemTotal(this);
                }
            });
        });
        
        // Quantity input changes
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                let value = parseInt(this.value);
                if (isNaN(value)) {
                    this.value = 1;
                } else if (value < 1) {
                    this.value = 1;
                } else if (value > 10) {
                    this.value = 10;
                }
                updateItemTotal(this);
            });
        });
        
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const itemId = parseInt(cartItem.dataset.id);
                removeItemFromCart(itemId);
                cartItem.remove();
                updateCartSummary();
                updateCartCount();
                
                // Show empty message if cart is empty
                if (document.querySelectorAll('.cart-item').length === 0) {
                    document.querySelector('.empty-cart-message').style.display = 'flex';
                    document.querySelector('.checkout-btn').style.display = 'none';
                }
            });
        });
        
        // Update buttons
        document.querySelectorAll('.update-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const itemId = parseInt(cartItem.dataset.id);
                const newQuantity = parseInt(cartItem.querySelector('.quantity-input').value);
                updateCartItemQuantity(itemId, newQuantity);
                updateCartSummary();
                updateCartCount();
            });
        });
    }
    
    // Update individual item total
    function updateItemTotal(element) {
        const cartItem = element.closest('.cart-item');
        const price = parseFloat(cartItem.querySelector('.cart-item-price').textContent.replace('$', ''));
        const quantity = parseInt(cartItem.querySelector('.quantity-input').value);
        const total = price * quantity;
        cartItem.querySelector('.cart-item-total-price').textContent = `Kes ${total.toFixed(2)}`;
    }
    
    // Update cart summary
    function updateCartSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.08; // 8% tax
        
        document.getElementById('subtotal').textContent = `Kes ${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `Kes ${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `Kes ${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `Kes ${(subtotal + shipping + tax).toFixed(2)}`;
    }
    
    // Load recommended products
    function loadRecommendedProducts() {
        const recommendedContainer = document.getElementById('recommended-products');
        
        // In a real app, this would come from an API based on cart contents
        const recommendedProducts = [
            {
                id: 7,
                name: "Phone Stand",
                price: 14.99,
                image: "https://www.shutterstock.com/image-vector/tripod-stand-monopod-smartphone-vertical-horizontal-2159099075",
                category: "accessories"
            },
            {
                id: 8,
                name: "Screen Cleaner",
                price: 9.99,
                image: "https://www.dreamstime.com/stock-photo-close-up-woman-cleaning-mobile-smart-phone-fabric-dark-background-blank-text-selective-focus-finger-image57518594",
                category: "accessories"
            },
            {
                id: 9,
                name: "USB-C Cable",
                price: 12.99,
                image: "https://www.dreamstime.com/detail-front-entrance-usb-c-cable-plug-port-smartphone-front-entrance-usb-c-cable-plug-port-smartphone-image157990822",
                category: "electronics"
            }
        ];
        
        recommendedContainer.innerHTML = recommendedProducts.map(product => `
            <div class="product-card" data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const product = recommendedProducts.find(p => p.id === productId);
                const quantity = addToCart(product);
                
                // Show added to cart feedback
                this.textContent = `Added (${quantity})`;
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                }, 2000);
                
                loadCartItems();
            });
        });
    }
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        alert('Checkout functionality would be implemented here!');
        // In a real app, this would redirect to a checkout page
    });
    
    // Initialize cart page
    loadCartItems();
    loadRecommendedProducts();
}