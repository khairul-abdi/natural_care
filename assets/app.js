const container = document.getElementById("productContainer");
const modalBody = document.getElementById("modalBody");
const productModal = new bootstrap.Modal(document.getElementById('productModal'));

fetch("assets/products.json")
    .then(res => res.json())
    .then(products => {

        if (!products || products.length === 0) {
            container.innerHTML = '<p class="text-center">Tidak ada produk tersedia.</p>';
            return;
        }

        products.forEach((p, i) => {

            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-lg-4";

            // build carousel markup
            const placeholder = 'https://via.placeholder.com/400x300?text=No+Image';
            let imgs = [];
            if (Array.isArray(p.images) && p.images.length) {
                imgs = p.images.slice();
            } else if (p.image) {
                imgs = [p.image];
            }
            if (imgs.length === 0) {
                imgs = [placeholder];
            } else {
                imgs = imgs.map(src => src || placeholder);
            }
            const carouselId = `carousel-${p.id}`;
            let carouselInner = "";
            imgs.forEach((src, idx) => {
                carouselInner += `
                <div class="carousel-item ${idx === 0 ? 'active' : ''}">
                    <img src="${src}" class="d-block w-100" loading="lazy">
                </div>
            `;
            });

            // only add controls if more than one image
            const hasControls = imgs.length > 1 ? `
                <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                </button>
            ` : '';

            col.innerHTML = `
            <div class="card shadow-sm product-card">
                <div id="${carouselId}" class="carousel slide carousel-fade" data-bs-interval="3000" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${carouselInner}
                    </div>
                    ${hasControls}
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.name}</h5>
                    <!-- short description under the title -->
                    <p class="card-text text-muted small">${p.description}</p>
                    <div class="mt-auto d-flex gap-2">
                        <button class="btn btn-success w-50"
                            onclick='openModal(${JSON.stringify(p)})'>
                            Detail
                        </button>
                        <a href="${p.shopee}" target="_blank"
                            class="btn btn-shopee w-50">
                            🛒 Shopee
                        </a>
                    </div>
                </div>
            </div>
        `;

            container.appendChild(col);

            setTimeout(() => {
                col.querySelector('.product-card').classList.add("show");
            }, 150 * i);

        });

    });

function openModal(product) {

    modalBody.innerHTML = `
        <div class="ratio ratio-16x9 mb-3">
            <iframe id="ytVideo"
                src="https://www.youtube.com/embed/${product.youtube}"
                allowfullscreen></iframe>
        </div>
        <div class="detail-text">
            ${product.detail_description || product.description}
        </div>
        <a href="${product.shopee}" target="_blank"
           class="btn btn-shopee w-100 mt-3">
           🛒 Beli Sekarang di Shopee
        </a>
    `;

    productModal.show();
}

/* Auto Stop YouTube */
document.getElementById('productModal').addEventListener('hidden.bs.modal', function () {
    modalBody.innerHTML = "";
});

/* Dark Mode: toggle the same class referenced by CSS and persist state */
const darkToggle = document.getElementById("darkToggle");

function updateDarkButton() {
    if (document.body.classList.contains("dark")) {
        darkToggle.textContent = "☀️";
    } else {
        darkToggle.textContent = "🌙";
    }
}

// initialize from localStorage
if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
}
updateDarkButton();

darkToggle.addEventListener("click", function () {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("dark", isDark);
    updateDarkButton();
});

