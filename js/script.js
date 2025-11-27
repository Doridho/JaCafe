// Menu Data
const menuData = {
  hotCoffee: [
    { id: 1, name: "Choco Latte", price: 20000 },
    { id: 2, name: "Cappuccino", price: 18000 },
    { id: 3, name: "Matcha Latte", price: 18000 },
    { id: 4, name: "Americano", price: 28000 },
  ],
  coldCoffee: [
    { id: 5, name: "Iced Coffee", price: 30000 },
    { id: 6, name: "Cold Brew", price: 38000 },
  ],
  specialty: [
    { id: 7, name: "Affogato", price: 40000 },
    { id: 8, name: "Mocha", price: 38000 },
  ],
};

// Cart State
let cart = [];

// DOM Elements
const navbar = document.getElementById("navbar");
const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const closeCartBtn = document.getElementById("closeCartBtn");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const submitBtn = document.getElementById("submitBtn");

// Render Menu Items
function renderMenu() {
  const hotCoffeeGrid = document.getElementById("hotCoffeeGrid");
  const coldCoffeeGrid = document.getElementById("coldCoffeeGrid");
  const specialtyGrid = document.getElementById("specialtyGrid");

  hotCoffeeGrid.innerHTML = menuData.hotCoffee
    .map((item) => createMenuItemHTML(item))
    .join("");
  coldCoffeeGrid.innerHTML = menuData.coldCoffee
    .map((item) => createMenuItemHTML(item))
    .join("");
  specialtyGrid.innerHTML = menuData.specialty
    .map((item) => createMenuItemHTML(item))
    .join("");
}

function createMenuItemHTML(item) {
  return `
        <div class="menu-item">
            <h4>${item.name}</h4>
            <p class="price">Rp ${item.price.toLocaleString("id-ID")}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${item.id}, '${
    item.name
  }', ${item.price})">
                Tambah ke Keranjang
            </button>
        </div>
    `;
}

// Add to Cart
function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }

  updateCart();
  showNotification("Item ditambahkan ke keranjang!");
}

// Remove from Cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

// Update Quantity
function updateQty(id, change) {
  const item = cart.find((item) => item.id === id);

  if (item) {
    item.qty += change;

    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      updateCart();
    }
  }
}

// Update Cart Display
function updateCart() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? "flex" : "none";

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Keranjang kosong</p>';
    document.getElementById("cartFooter").style.display = "none";
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-header">
                    <h4>${item.name}</h4>
                    <button class="remove-btn" onclick="removeFromCart(${
                      item.id
                    })">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <p class="price">Rp ${item.price.toLocaleString("id-ID")}</p>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateQty(${
                      item.id
                    }, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${
                      item.id
                    }, 1)">+</button>
                </div>
            </div>
        `
      )
      .join("");

    document.getElementById("cartFooter").style.display = "block";
  }

  // Update total price
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalPrice.textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

// Open/Close Cart
function openCart() {
  cartSidebar.classList.add("open");
  overlay.classList.add("active");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("active");
}

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemsList = cart.map((item) => `${item.name} x${item.qty}`).join(", ");

  alert(
    `Checkout berhasil!\n\nItem: ${itemsList}\nTotal: Rp ${total.toLocaleString(
      "id-ID"
    )}\n\nTerima kasih atas pesanan Anda!`
  );

  cart = [];
  updateCart();
  closeCart();
});

// Contact Form
submitBtn.addEventListener("click", () => {
  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;
  const message = document.getElementById("messageInput").value;

  if (name && email && message) {
    alert("Pesan Anda telah terkirim!\n\nTerima kasih telah menghubungi kami.");
    document.getElementById("Masukkan Nama Anda").value = "";
    document.getElementById("Masukkan Email Anda").value = "";
    document.getElementById("Masukkan Pesan").value = "";
  } else {
    alert("Mohon lengkapi semua field!");
  }
});

// Notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(to right, #374151, #111827);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 100;
        animation: slideIn 0.3s ease-out;
        border: 1px solid #4b5563;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Navbar Scroll Effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 64;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Event Listeners
cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
mobileMenuBtn.addEventListener("click", () => {
  alert("Menu mobile akan ditampilkan di sini");
});

// Add CSS for notification animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize
renderMenu();
updateCart();
