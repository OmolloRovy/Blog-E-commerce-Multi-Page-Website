document.addEventListener('DOMContentLoaded', function () {
    // ============================
    // Mobile Menu Toggle
    // ============================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', function () {
            navList.classList.toggle('active');
            this.innerHTML = navList.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    // ============================
    // Cart Functionality
    // ============================
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    const closeCart = document.querySelector('.close-cart');

    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCount) cartCount.textContent = count;
    }

    // Load cart dropdown
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
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-dropdown-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-dropdown-item-details">
                        <h4 class="cart-dropdown-item-title">${item.name}</h4>
                        <p class="cart-dropdown-item-price">Kes ${item.price.toFixed(2)}</p>
                        <p class="cart-dropdown-item-quantity">Qty: ${item.quantity}</p>
                        <button class="remove-item-dropdown">Remove</button>
                    </div>
                </div>
            `).join('');
        }

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item-dropdown').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = parseInt(this.closest('.cart-dropdown-item').dataset.id);
                removeItemFromCart(itemId);
                loadCartDropdown();
                updateCartCount();
                updateCartSummary();
            });
        });

        updateCartSummary();
    }

    // Update cart summary
    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const cartSubtotal = document.getElementById('cart-subtotal');
        if (cartSubtotal) {
            cartSubtotal.textContent = `Kes ${subtotal.toFixed(2)}`;
        }
    }

    // Remove item from cart
    function removeItemFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Add to cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if (cartDropdown) loadCartDropdown();
    }

    // Toggle cart dropdown visibility
    if (cartIcon && cartDropdown) {
        cartIcon.addEventListener('click', () => {
            cartDropdown.classList.toggle('hidden');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartDropdown.classList.add('hidden');
        });
    }

    updateCartCount();

    // ============================
    // Product Filtering
    // ============================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productGrid = document.getElementById('product-grid');

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

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const category = this.dataset.category;
                filterProducts(category);
            });
        });
    }

    // ============================
    // Load Products
    // ============================
    function loadProducts() {
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

        if (productGrid) {
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

            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', function () {
                    const productId = parseInt(this.dataset.id);
                    const product = products.find(p => p.id === productId);
                    addToCart(product);

                    this.textContent = 'Added!';
                    setTimeout(() => {
                        this.textContent = 'Add to Cart';
                    }, 2000);
                });
            });
        }
    }

    loadProducts();

    // Load featured blog posts and popular products
    loadFeaturedPosts();
    loadPopularProducts();

    // ============================
    // Load Featured Posts
    // ============================
    function loadFeaturedPosts() {
        const featuredPosts = [
            {
                id: 1,
                title: "How to Start a Blog",
                excerpt: "Learn the basics of starting your own blog and sharing your ideas with the world.",
                image: "https://via.placeholder.com/300x200",
                link: "blog/index.html"
            },
            {
                id: 2,
                title: "Top 10 Gadgets of 2025",
                excerpt: "Discover the most innovative gadgets of the year and how they can improve your life.",
                image: "https://via.placeholder.com/300x200",
                link: "blog/index.html"
            }
        ];

        const featuredPostsContainer = document.getElementById("featured-posts");
        if (featuredPostsContainer) {
            featuredPostsContainer.innerHTML = featuredPosts.map(post => `
                <div class="featured-post">
                    <img src="${post.image}" alt="${post.title}">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="${post.link}" class="btn">Read More</a>
                </div>
            `).join('');
        }
    }

    // ============================
    // Load Popular Products
    // ============================
    function loadPopularProducts() {
        const popularProducts = [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 99.99,
                image: "../images/headphones.png",
                link: "shop/product1.html"
            },
            {
                id: 2,
                name: "Smart Watch",
                price: 199.99,
                image: "../images/smartwatch.png",
                link: "shop/product2.html"
            }
        ];

        const featuredProductsContainer = document.getElementById("featured-products");
        if (featuredProductsContainer) {
            featuredProductsContainer.innerHTML = popularProducts.map(product => `
                <div class="featured-product">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">Kes ${product.price.toFixed(2)}</p>
                    <a href="${product.link}" class="btn">View Product</a>
                </div>
            `).join('');
        }
    }
});