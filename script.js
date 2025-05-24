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