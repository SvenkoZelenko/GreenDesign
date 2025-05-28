// Proizvod klasa
class Proizvod {
    constructor(naziv, cijena) {
        this.naziv = naziv;
        this.cijena = parseFloat(cijena.replace('€', '').replace(',', '.'));
    }
}

// Globalne varijable
const cart = [];
let images = [
    "https://i.pinimg.com/736x/69/41/36/694136938e83fdd761b673cbd838856e.jpg",
    "https://i.pinimg.com/736x/69/41/36/694136938e83fdd761b673cbd838856e.jpg"
];
let currentIndex = 0;
let cartPanelOpen = false;

// Hero image rotation
function rotateHeroImage() {
    const img = document.querySelector(".hero-image img");
    if (!img) return;

    currentIndex = (currentIndex + 1) % images.length;
    img.src = images[currentIndex];
}

// Pokreni rotaciju slika svake 5 sekunde
setInterval(rotateHeroImage, 5000);

// Inicijalizacija kad se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupCategoryTabs();
    setupAddToCart();
    setupQuickView();
    setupSearch();
    setupProductAnimations();
    setupCartIcon();
}

// Funkcionalnost kategorija
function setupCategoryTabs() {
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            // Ukloni active klasu sa svih tabova
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));

            // Dodaj active klasu na trenutni tab
            this.classList.add('active');

            // Filtriraj proizvode
            const category = this.dataset.category;
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                if (category === 'all' || product.dataset.category === category) {
                    product.style.display = 'block';
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        product.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Funkcionalnost dodavanja u košaricu
function setupAddToCart() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const naziv = productCard.querySelector('.product-name').innerText;
            const cijena = productCard.querySelector('.product-price').innerText;

            const proizvod = new Proizvod(naziv, cijena);
            
            // Provjeri da li proizvod već postoji u košarici
            const existingProduct = cart.find(item => item.naziv === proizvod.naziv);
            
            if (existingProduct) {
                existingProduct.quantity = (existingProduct.quantity || 1) + 1;
            } else {
                proizvod.quantity = 1;
                cart.push(proizvod);
            }

            updateCartCount();
            animateCartIcon();
            
            // Dodaj success feedback
            showAddToCartFeedback(button);
        });
    });
}

// Ažuriraj broj stavki u košarici
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountElement.textContent = totalItems;
        
        // Sakrij ili prikaži cart count ovisno o broju stavki
        if (totalItems === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.style.display = 'flex';
        }
    }
}

// Animacija ikone košarice
function animateCartIcon() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.classList.add('bump');
        setTimeout(() => {
            cartCountElement.classList.remove('bump');
        }, 300);
    }
}

// Feedback za dodavanje u košaricu
function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Dodano! ✓';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#2a5d43';
    }, 1500);
}

// Funkcionalnost brzog pregleda
function setupQuickView() {
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImage = productCard.querySelector('.product-image').src;
            
            showQuickViewModal(productName, productPrice, productImage);
        });
    });
}

// Modal za brzi pregled
function showQuickViewModal(name, price, image) {
    // Stvori modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">✖</button>
                <img src="${image}" alt="${name}" class="modal-image">
                <div class="modal-info">
                    <h3>${name}</h3>
                    <p class="modal-price">${price}</p>
                    <button class="modal-add-to-cart">Dodaj u Košaricu</button>
                </div>
            </div>
        </div>
    `;
    
    // Dodaj modal u dokument
    document.body.appendChild(modal);
    
    // Event listeneri za modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.body.removeChild(modal);
        }
    });
    
    modal.querySelector('.modal-add-to-cart').addEventListener('click', () => {
        const proizvod = new Proizvod(name, price);
        
        // Provjeri da li proizvod već postoji u košarici
        const existingProduct = cart.find(item => item.naziv === proizvod.naziv);
        
        if (existingProduct) {
            existingProduct.quantity = (existingProduct.quantity || 1) + 1;
        } else {
            proizvod.quantity = 1;
            cart.push(proizvod);
        }
        
        updateCartCount();
        animateCartIcon();
        document.body.removeChild(modal);
    });
}

// Funkcionalnost pretrage
function setupSearch() {
    const searchInput = document.querySelector('.navbar .icons input');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                const productName = product.querySelector('.product-name').textContent.toLowerCase();
                if (productName.includes(searchTerm) || searchTerm === '') {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
}

// Animacija učitavanja proizvoda
function setupProductAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Primijeni animaciju na sve proizvode
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Funkcionalnost ikone košarice
function setupCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Provjeri ima li proizvoda u košarici prije otvaranja
            if (cart.length === 0) {
                // Prikaži kratku poruku umjesto alert-a
                showEmptyCartMessage();
                return;
            }
            
            if (cartPanelOpen) {
                closeCartPanel();
            } else {
                openCartPanel();
            }
        });
    }
}

// Prikaži poruku za praznu košaricu
function showEmptyCartMessage() {
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    // Stvori tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'empty-cart-tooltip';
    tooltip.textContent = 'Košarica je prazna';
    
    // Pozicioniraj tooltip
    const rect = cartIcon.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = (rect.bottom + 10) + 'px';
    tooltip.style.left = (rect.left - 50) + 'px';
    tooltip.style.background = '#333';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(tooltip);
    
    // Animacija prikaza
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
    
    // Ukloni tooltip nakon 2 sekunde
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
            }
        }, 300);
    }, 2000);
}

// Otvori panel košarice
function openCartPanel() {
    // Ukloni postojeći panel ako postoji
    const existingPanel = document.querySelector('.cart-panel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    // Stvori novi panel
    const cartPanel = createCartPanel();
    cartPanel.classList.add('show'); // Dodaj show klasu za prikaz
    document.body.appendChild(cartPanel);
    
    cartPanelOpen = true;
    
    // Dodaj event listener za zatvaranje kad se klikne van panela
    setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
    }, 100);
}

// Zatvori panel košarice
function closeCartPanel() {
    const cartPanel = document.querySelector('.cart-panel');
    if (cartPanel) {
        cartPanel.classList.add('fade-leave-to');
        setTimeout(() => {
            if (document.body.contains(cartPanel)) {
                cartPanel.remove();
            }
        }, 300);
    }
    
    cartPanelOpen = false;
    document.removeEventListener('click', handleOutsideClick);
}

// Handle klikove van panela
function handleOutsideClick(e) {
    const cartPanel = document.querySelector('.cart-panel');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartPanel && !cartPanel.contains(e.target) && !cartIcon.contains(e.target)) {
        closeCartPanel();
    }
}

// Stvori panel košarice
function createCartPanel() {
    const panel = document.createElement('div');
    panel.className = 'cart-panel fade-enter-from';
    
    let panelHTML = `
        <button class="cart-close" onclick="closeCartPanel()">✖</button>
        <h2>Košarica</h2>
    `;
    
    if (cart.length === 0) {
        panelHTML += '<div class="cart-empty">Košarica je prazna</div>';
    } else {
        panelHTML += '<div class="cart-items">';
        
        cart.forEach((item, index) => {
            const quantity = item.quantity || 1;
            const totalPrice = (item.cijena * quantity).toFixed(2);
            
            panelHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <strong>${item.naziv}</strong><br>
                        <span class="cart-item-price">€${item.cijena.toFixed(2)} x ${quantity} = €${totalPrice}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                        <span class="quantity">${quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                        <button class="cart-item-remove" onclick="removeFromCart(${index})">🗑️</button>
                    </div>
                </div>
            `;
        });
        
        panelHTML += '</div>';
        
        const ukupno = cart.reduce((sum, item) => sum + (item.cijena * (item.quantity || 1)), 0);
        panelHTML += `
            <div class="cart-total">Ukupno: €${ukupno.toFixed(2)}</div>
            <button class="checkout-btn" onclick="checkout()">Završi Kupnju</button>
        `;
    }
    
    panel.innerHTML = panelHTML;
    
    // Animacija ulaska
    setTimeout(() => {
        panel.classList.remove('fade-enter-from');
        panel.classList.add('fade-enter-to');
    }, 10);
    
    return panel;
}

// Ukloni proizvod iz košarice
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    
    if (cart.length === 0) {
        closeCartPanel();
    } else {
        // Osvježi panel
        const existingPanel = document.querySelector('.cart-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        const newPanel = createCartPanel();
        document.body.appendChild(newPanel);
    }
}

// Promijeni količinu proizvoda
function changeQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity = Math.max(1, (cart[index].quantity || 1) + change);
        updateCartCount();
        
        // Osvježi panel
        const existingPanel = document.querySelector('.cart-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        const newPanel = createCartPanel();
        document.body.appendChild(newPanel);
    }
}

// Završi kupnju
function checkout() {
    if (cart.length === 0) {
        alert("Košarica je prazna!");
        return;
    }
    
    const ukupno = cart.reduce((sum, item) => sum + (item.cijena * (item.quantity || 1)), 0);
    
    let poruka = "Hvala vam na kupnji!\n\nVaša narudžba:\n";
    cart.forEach((item, index) => {
        const quantity = item.quantity || 1;
        const totalPrice = (item.cijena * quantity).toFixed(2);
        poruka += `${index + 1}. ${item.naziv} - €${item.cijena.toFixed(2)} x ${quantity} = €${totalPrice}\n`;
    });
    poruka += `\nUkupno: €${ukupno.toFixed(2)}`;
    poruka += "\n\nVaša narudžba je poslana!";
    
    alert(poruka);
    
    // Očisti košaricu
    cart.length = 0;
    updateCartCount();
    closeCartPanel();
}
// Shopping cart functionality
let cartItems = [];
let cartTotal = 0;