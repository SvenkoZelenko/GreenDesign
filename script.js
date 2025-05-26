let images = [
    "https://i.pinimg.com/736x/69/41/36/694136938e83fdd761b673cbd838856e.jpg",
    "https://i.pinimg.com/736x/69/41/36/694136938e83fdd761b673cbd838856e.jpg"
];
let currentIndex = 0;

function rotateHeroImage() {
    const img = document.querySelector(".hero-image img");
    if (!img) return;

    currentIndex = (currentIndex + 1) % images.length;
    img.src = images[currentIndex];
}
setInterval(rotateHeroImage, 5000);

let cart = [];
let cartCount = 0;

document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        
        this.classList.add('active');
        
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

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        cart.push({
            name: productName,
            price: productPrice
        });
        
        cartCount++;
        
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
            
            const cartIcon = document.querySelector('.cart-icon');
            if (cartIcon) {
                cartIcon.style.transform = 'scale(1.2)';
                cartIcon.style.transition = 'transform 0.3s ease';
                
                setTimeout(() => {
                    cartIcon.style.transform = 'scale(1)';
                }, 300);
            }
        }

        this.style.background = '#85c7a3';
        this.style.transition = 'all 0.3s ease';
        this.textContent = 'Dodano!';

        setTimeout(() => {
            this.style.background = '#2a5d43';
            this.textContent = 'Dodaj u Košaricu';
        }, 1500);
    });
});

document.querySelectorAll('.quick-view').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        alert('Brzi pregled: ' + productName + '\n\nOva funkcionalnost će biti implementirana uskoro!');
    });
});

document.querySelector('.navbar .icons input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});