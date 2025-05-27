class Proizvod {
    constructor(naziv, cijena) {
        this.naziv = naziv;
        this.cijena = parseFloat(cijena.replace('€', '').replace(',', '.'));
    }
}

const cart = [];


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
let cartCount = 0;

// Funkcionalnost kategorija
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

let cartCount2 = 0;

//kosarica
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        const naziv = productCard.querySelector('.product-name').innerText;
        const cijena = productCard.querySelector('.product-price').innerText;

        const proizvod = new Proizvod(naziv, cijena);
        cart.push(proizvod);

        // Ažuriraj broj
        const cartCountElement = document.querySelector('.cart-count');
        cartCountElement.textContent = cart.length;

        // Animacija
        cartCountElement.classList.add('bump');
        setTimeout(() => {
            cartCountElement.classList.remove('bump');
        }, 300);
    });
});

// Funkcionalnost brzog pregleda
document.querySelectorAll('.quick-view').forEach(button => {
    button.addEventListener('click', function () {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        alert('Brzi pregled: ' + productName + '\n\nOva funkcionalnost će biti implementirana uskoro!');
    });
});

// Funkcionalnost pretrage
document.querySelector('.navbar .icons input').addEventListener('input', function () {
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

// Animacija učitavanja proizvoda
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

// Funkcionalnost košarice (klik na ikonu košarice)
document.querySelector('.cart-icon').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Košarica je prazna!");
        return;
    }

    let poruka = "Stavke u košarici:\n";
    let ukupno = 0;

    cart.forEach((item, index) => {
        poruka += `${index + 1}. ${item.naziv} - €${item.cijena.toFixed(2)}\n`;
        ukupno += item.cijena;
    });

    poruka += `\nUkupno: €${ukupno.toFixed(2)}`;

    alert(poruka);
});