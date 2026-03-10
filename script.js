// Tham chiếu Firebase
const shopDataRef = database.ref('shopData');
const settingsRef = database.ref('websiteSettings');
const redirectCodesRef = database.ref('redirectCodes');

// Dữ liệu toàn cục
let data = {};
let websiteSettings = {};
let redirectCodes = [];

// Lắng nghe dữ liệu sản phẩm
shopDataRef.on('value', (snapshot) => {
    const val = snapshot.val();
    if (val) {
        data = val;
        // Chuyển đổi sản phẩm cũ (chỉ có price) sang định dạng mới
        if (data.products) {
            data.products = data.products.map(p => {
                if (!p.prices && p.price) {
                    p.prices = [{ price: p.price, duration: 'Giá' }];
                } else if (!p.prices) {
                    p.prices = [];
                }
                return p;
            });
        }
    } else {
        data = { mainCategories: [], subCategories: [], products: [] };
        shopDataRef.set(data);
    }
    renderCategories();
});

// Lắng nghe cài đặt website (đã thêm chatZalo, chatTelegram)
settingsRef.on('value', (snapshot) => {
    const val = snapshot.val();
    if (val) {
        websiteSettings = val;
    } else {
        websiteSettings = {
            shopName: "Tên cửa hàng",
            logo: "https://via.placeholder.com/150x50/4CAF50/ffffff?text=LOGO+SHOP",
            aboutText: "ShopOnline - Địa chỉ mua sắm tin cậy của bạn với đa dạng sản phẩm công nghệ chính hãng, chất lượng cao.",
            phone: "0123 456 789",
            email: "info@shoponline.com",
            address: "123 Đường ABC, Quận XYZ, TP.HCM",
            workingHours: "Thứ 2 - Chủ nhật: 8:00 - 22:00",
            facebook: "#",
            instagram: "#",
            youtube: "#",
            tiktok: "#",
            zaloQR: "https://via.placeholder.com/100x100/3498db/ffffff?text=QR+Code",
            footerCopyright: "© 2024 ShopOnline. Tất cả quyền được bảo lưu.",
            showShopName: true,
            showLogo: true,
            showAboutText: true,
            showPhone: true,
            showEmail: true,
            showAddress: true,
            showWorkingHours: true,
            showFacebook: true,
            showInstagram: true,
            showYoutube: true,
            showTiktok: true,
            showZaloQR: true,
            showCopyright: true,
            supportZalo: "",
            supportTelegram: "",
            // THÊM MỚI
            chatZalo: "",
            chatTelegram: ""
        };
        settingsRef.set(websiteSettings);
    }
    renderWebsiteSettings();
    updateFloatingChat(); // cập nhật link cho bong bóng chat
});

// Lắng nghe mã chuyển hướng
redirectCodesRef.on('value', (snapshot) => {
    redirectCodes = snapshot.val() || [];
});

// Hiển thị thông báo
function showNotification(message, type = 'success') {
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// ==================== RENDER DANH MỤC ====================
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    categoryList.innerHTML = '';
    data.mainCategories.forEach(mainCat => {
        const mainLi = document.createElement('li');
        const mainLink = document.createElement('a');
        mainLink.href = '#';
        mainLink.onclick = (e) => {
            e.preventDefault();
            showMainCategory(mainCat.id);
        };
        const mainImg = document.createElement('img');
        mainImg.src = mainCat.image;
        mainImg.alt = mainCat.name;
        mainImg.onerror = function() {
            if (!this.src.includes('data:image')) {
                this.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'30\' viewBox=\'0 0 30 30\'%3E%3Crect width=\'30\' height=\'30\' fill=\'%23cccccc\'/%3E%3Ctext x=\'5\' y=\'20\' font-size=\'12\' fill=\'%23000\'%3EError%3C/text%3E%3C/svg%3E';
            }
        };
        mainLink.appendChild(mainImg);
        mainLink.appendChild(document.createTextNode(mainCat.name));
        const arrowIcon = document.createElement('i');
        arrowIcon.className = 'fas fa-chevron-right arrow-icon';
        mainLink.appendChild(arrowIcon);
        mainLi.appendChild(mainLink);
        categoryList.appendChild(mainLi);
    });
    if (data.mainCategories.length > 0) {
        showMainCategory(data.mainCategories[0].id);
    }
}

function showMainCategory(mainCatId) {
    const subCategories = data.subCategories.filter(sub => sub.mainCategoryId === mainCatId);
    const mainCat = data.mainCategories.find(cat => cat.id === mainCatId);
    renderSubCategoriesList(subCategories, mainCat ? mainCat.name : 'Danh mục');
}

function renderSubCategoriesList(subCategories, title) {
    const productGrid = document.getElementById('productGrid');
    const categoryTitle = document.getElementById('categoryTitle');
    if (!productGrid) return;
    if (categoryTitle) categoryTitle.textContent = title;
    productGrid.innerHTML = '';
    if (subCategories.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; padding: 50px; color: #666;">Không có danh mục phụ nào</p>';
        return;
    }
    subCategories.forEach(subCat => {
        const subCatCard = document.createElement('div');
        subCatCard.className = 'subcategory-card';
        subCatCard.onclick = () => filterBySubCategory(subCat.id);
        subCatCard.innerHTML = `
            <div class="subcategory-image">
                <img src="${subCat.image}" alt="${subCat.name}" onerror="if(!this.src.includes('data:image')) this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'%3E%3Crect width=\'200\' height=\'200\' fill=\'%23cccccc\'/%3E%3Ctext x=\'50\' y=\'110\' font-size=\'18\' fill=\'%23000\'%3ENo image%3C/text%3E%3C/svg%3E';">
            </div>
            <div class="subcategory-info">
                <h3>${subCat.name}</h3>
                <span class="product-count">${subCat.products.length} sản phẩm</span>
            </div>
        `;
        productGrid.appendChild(subCatCard);
    });
}

function filterBySubCategory(subCatId) {
    const products = data.products.filter(product => product.subCategoryId === subCatId);
    const subCat = data.subCategories.find(cat => cat.id === subCatId);
    renderProducts(products, subCat ? subCat.name : 'Sản phẩm');
}

// ==================== RENDER SẢN PHẨM ====================
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function renderProducts(products, title) {
    const productGrid = document.getElementById('productGrid');
    const categoryTitle = document.getElementById('categoryTitle');
    if (!productGrid) return;
    if (categoryTitle) categoryTitle.textContent = title;
    productGrid.innerHTML = '';
    if (products.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; padding: 50px; color: #666;">Không có sản phẩm nào</p>';
        return;
    }
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        const statusClass = product.status === 'online' ? 'status-online' : 'status-maintenance';
        const statusText = product.status === 'online' ? 'Online' : 'Bảo trì';
        const mainImage = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x300/cccccc/000000?text=No+Image';

        let pricesHtml = '';
        if (product.prices && product.prices.length > 0) {
            pricesHtml = '<div class="product-prices">';
            product.prices.forEach(p => {
                pricesHtml += `
                    <div class="price-item">
                        <span class="price-value">${formatPrice(p.price)}</span>
                        <span class="price-duration">/ ${p.duration}</span>
                    </div>
                `;
            });
            pricesHtml += '</div>';
        } else {
            pricesHtml = '<div class="product-price">Liên hệ</div>';
        }

        productCard.innerHTML = `
            <div class="product-badge">${product.code || 'SP' + product.id}</div>
            <div class="product-image">
                <img src="${mainImage}" alt="${product.name}" onerror="if(!this.src.includes('data:image')) this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\' viewBox=\'0 0 400 300\'%3E%3Crect width=\'400\' height=\'300\' fill=\'%23cccccc\'/%3E%3Ctext x=\'100\' y=\'160\' font-size=\'30\' fill=\'%23000\'%3ENo image%3C/text%3E%3C/svg%3E';">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                ${pricesHtml}
                <span class="product-status ${statusClass}">${statusText}</span>
                <div class="product-actions">
                    <button class="btn-view" onclick="event.stopPropagation(); showProductDetail(${product.id})">
                        <i class="fas fa-eye"></i> Xem chi tiết
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// ==================== MODAL CHI TIẾT SẢN PHẨM ====================
function changeMainImage(element, imageUrl) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageUrl;
        document.querySelectorAll('.thumbnail-item').forEach(item => item.classList.remove('active'));
        if (element) element.classList.add('active');
    }
}

function showProductDetail(productId) {
    const product = data.products.find(p => p.id === productId);
    if (!product) return;
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalProductDetail');
    const statusClass = product.status === 'online' ? 'status-online' : 'status-maintenance';
    const statusText = product.status === 'online' ? 'Online' : 'Bảo trì';
    const description = product.description ? product.description.replace(/\n/g, '<br>') : '';

    let priceListHtml = '';
    if (product.prices && product.prices.length > 0) {
        priceListHtml = '<div class="product-price-list">';
        product.prices.forEach(p => {
            priceListHtml += `
                <div class="price-item">
                    <span class="price-value">${formatPrice(p.price)}</span>
                    <span class="price-duration">/ ${p.duration}</span>
                </div>
            `;
        });
        priceListHtml += '</div>';
    } else {
        priceListHtml = '<div class="product-price">Liên hệ</div>';
    }

    let galleryHtml = '';
    if (product.images && product.images.length > 0) {
        const mainImage = product.images[0];
        const thumbnails = product.images.map((img, index) => `
            <div class="thumbnail-item" onclick="changeMainImage(this, '${img}')">
                <img src="${img}" alt="${product.name} - ảnh ${index + 1}">
            </div>
        `).join('');
        galleryHtml = `
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${mainImage}" alt="${product.name}" id="mainProductImage" onerror="if(!this.src.includes('data:image')) this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'400\' viewBox=\'0 0 600 400\'%3E%3Crect width=\'600\' height=\'400\' fill=\'%23cccccc\'/%3E%3Ctext x=\'200\' y=\'210\' font-size=\'40\' fill=\'%23000\'%3ENo image%3C/text%3E%3C/svg%3E';">
                </div>
                ${product.images.length > 1 ? `<div class="thumbnail-list">${thumbnails}</div>` : ''}
            </div>
        `;
    } else {
        galleryHtml = `
            <div class="product-detail-image">
                <img src="https://via.placeholder.com/600x400/cccccc/000000?text=No+Image" alt="No image">
            </div>
        `;
    }

    // Nút Zalo/Telegram trong chi tiết sản phẩm vẫn dùng supportZalo/supportTelegram
    let zaloButton = '';
    if (websiteSettings.supportZalo) {
        zaloButton = `<button class="btn-zalo" onclick="contactZalo()"><i class="fab fa-zalo"></i> Chat Zalo</button>`;
    }
    let telegramButton = '';
    if (websiteSettings.supportTelegram) {
        telegramButton = `<button class="btn-tele" onclick="contactTelegram()"><i class="fab fa-telegram-plane"></i> Chat Telegram</button>`;
    }

    modalContent.innerHTML = `
        <div class="product-detail">
            ${galleryHtml}
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="product-detail-code">Mã SP: ${product.code || 'SP' + product.id}</div>
                ${priceListHtml}
                <span class="product-detail-status ${statusClass}">${statusText}</span>
                <div class="product-detail-desc">${description}</div>
                <div class="product-detail-actions">
                    ${zaloButton}
                    ${telegramButton}
                </div>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

// ==================== LIÊN HỆ (DÙNG LINK GLOBAL) ====================
function contactZalo() {
    if (websiteSettings.supportZalo) {
        window.open(websiteSettings.supportZalo, '_blank');
    } else {
        alert('Chưa có thông tin liên hệ Zalo');
    }
}
function contactTelegram() {
    if (websiteSettings.supportTelegram) {
        window.open(websiteSettings.supportTelegram, '_blank');
    } else {
        alert('Chưa có thông tin liên hệ Telegram');
    }
}

// ==================== ĐÓNG MODAL ====================
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// ==================== HIỂN THỊ CÀI ĐẶT WEBSITE (FOOTER, LOGO...) ====================
function renderWebsiteSettings() {
    // Logo
    const logoImg = document.getElementById('logoImg') || document.querySelector('.logo img');
    if (logoImg) {
        if (websiteSettings.showLogo) {
            logoImg.src = websiteSettings.logo;
            logoImg.style.display = 'inline';
        } else {
            logoImg.style.display = 'none';
        }
    }
    // Tên shop
    const shopNameSpan = document.getElementById('shopNameDisplay');
    if (shopNameSpan) {
        if (websiteSettings.showShopName) {
            shopNameSpan.textContent = websiteSettings.shopName || '';
            shopNameSpan.style.display = 'inline';
        } else {
            shopNameSpan.style.display = 'none';
        }
    }
    // Đoạn giới thiệu
    const aboutSection = document.getElementById('footer-about');
    if (aboutSection) {
        if (websiteSettings.showAboutText) {
            aboutSection.style.display = 'block';
            const aboutText = document.getElementById('about-text');
            if (aboutText) aboutText.textContent = websiteSettings.aboutText;
        } else {
            aboutSection.style.display = 'none';
        }
    }
    // Liên hệ
    const addressEl = document.getElementById('contact-address');
    if (addressEl) {
        if (websiteSettings.showAddress) {
            addressEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${websiteSettings.address}`;
            addressEl.style.display = 'flex';
        } else {
            addressEl.style.display = 'none';
        }
    }
    const phoneEl = document.getElementById('contact-phone');
    if (phoneEl) {
        if (websiteSettings.showPhone) {
            phoneEl.innerHTML = `<i class="fas fa-phone"></i> ${websiteSettings.phone}`;
            phoneEl.style.display = 'flex';
        } else {
            phoneEl.style.display = 'none';
        }
    }
    const emailEl = document.getElementById('contact-email');
    if (emailEl) {
        if (websiteSettings.showEmail) {
            emailEl.innerHTML = `<i class="fas fa-envelope"></i> ${websiteSettings.email}`;
            emailEl.style.display = 'flex';
        } else {
            emailEl.style.display = 'none';
        }
    }
    const hoursEl = document.getElementById('contact-hours');
    if (hoursEl) {
        if (websiteSettings.showWorkingHours) {
            hoursEl.innerHTML = `<i class="fas fa-clock"></i> ${websiteSettings.workingHours}`;
            hoursEl.style.display = 'flex';
        } else {
            hoursEl.style.display = 'none';
        }
    }
    // Mạng xã hội
    const fbLink = document.getElementById('social-fb');
    if (fbLink) {
        if (websiteSettings.showFacebook) {
            fbLink.href = websiteSettings.facebook;
            fbLink.style.display = 'flex';
        } else {
            fbLink.style.display = 'none';
        }
    }
    const igLink = document.getElementById('social-ig');
    if (igLink) {
        if (websiteSettings.showInstagram) {
            igLink.href = websiteSettings.instagram;
            igLink.style.display = 'flex';
        } else {
            igLink.style.display = 'none';
        }
    }
    const ytLink = document.getElementById('social-yt');
    if (ytLink) {
        if (websiteSettings.showYoutube) {
            ytLink.href = websiteSettings.youtube;
            ytLink.style.display = 'flex';
        } else {
            ytLink.style.display = 'none';
        }
    }
    const ttLink = document.getElementById('social-tt');
    if (ttLink) {
        if (websiteSettings.showTiktok) {
            ttLink.href = websiteSettings.tiktok;
            ttLink.style.display = 'flex';
        } else {
            ttLink.style.display = 'none';
        }
    }
    // QR Zalo
    const zaloSection = document.getElementById('footer-zalo');
    if (zaloSection) {
        if (websiteSettings.showZaloQR) {
            zaloSection.style.display = 'block';
            const zaloQR = document.getElementById('zalo-qr');
            if (zaloQR) zaloQR.src = websiteSettings.zaloQR;
        } else {
            zaloSection.style.display = 'none';
        }
    }
    // Copyright
    const copyright = document.getElementById('copyright');
    if (copyright) {
        if (websiteSettings.showCopyright) {
            copyright.textContent = websiteSettings.footerCopyright;
            copyright.style.display = 'block';
        } else {
            copyright.style.display = 'none';
        }
    }
}

// ==================== BONG BÓNG CHAT NỔI (DÙNG LINK RIÊNG) ====================
function updateFloatingChat() {
    const zaloLink = document.getElementById('floatingZalo');
    const teleLink = document.getElementById('floatingTelegram');
    if (zaloLink) {
        if (websiteSettings.chatZalo) {
            zaloLink.href = websiteSettings.chatZalo;
            zaloLink.style.display = 'flex';
        } else {
            zaloLink.style.display = 'none';
        }
    }
    if (teleLink) {
        if (websiteSettings.chatTelegram) {
            teleLink.href = websiteSettings.chatTelegram;
            teleLink.style.display = 'flex';
        } else {
            teleLink.style.display = 'none';
        }
    }
    // Không ẩn floatingChat, để nó luôn hiển thị
}

// ==================== MÃ CHUYỂN HƯỚNG ====================
function handleRedirectCode(rc) {
    if (rc.maxUses > 0 && rc.currentUses >= rc.maxUses) {
        showNotification('Mã này đã hết lượt sử dụng!', 'error');
        return;
    }
    const codeRef = database.ref('redirectCodes').child(rc.id);
    codeRef.transaction((current) => {
        if (current) {
            if (current.maxUses > 0 && current.currentUses >= current.maxUses) {
                return;
            }
            current.currentUses = (current.currentUses || 0) + 1;
        }
        return current;
    }, (error, committed, snapshot) => {
        if (error) {
            showNotification('Lỗi khi xử lý mã!', 'error');
        } else if (!committed) {
            showNotification('Mã đã hết lượt dùng!', 'error');
        } else {
            window.location.href = rc.url;
        }
    });
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toUpperCase();
    if (searchTerm === '') {
        if (data.mainCategories.length > 0) {
            showMainCategory(data.mainCategories[0].id);
        }
        return;
    }
    // Kiểm tra mã chuyển hướng trước
    const redirectCode = redirectCodes.find(rc => rc.code.toUpperCase() === searchTerm);
    if (redirectCode) {
        handleRedirectCode(redirectCode);
        return;
    }
    // Tìm sản phẩm theo mã
    const foundProducts = data.products.filter(product => 
        product.code && product.code.toUpperCase().includes(searchTerm)
    );
    if (foundProducts.length > 0) {
        renderProducts(foundProducts, `Kết quả tìm kiếm mã: ${searchTerm}`);
    } else {
        renderProducts([], `Không tìm thấy mã: ${searchTerm}`);
    }
}

// ==================== KHỞI TẠO SỰ KIỆN ====================
document.addEventListener('DOMContentLoaded', function() {
    // Tìm kiếm
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    if (searchButton) searchButton.addEventListener('click', searchProducts);
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchProducts();
        });
    }
    // Đóng modal
    document.querySelectorAll('.close').forEach(btn => {
        btn.onclick = closeModal;
    });
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) closeModal();
    };

    // Bong bóng chat
    const chatButton = document.querySelector('.chat-button');
    const chatOptions = document.getElementById('chatOptions');
    if (chatButton) {
        chatButton.addEventListener('click', function(e) {
            e.stopPropagation();
            chatOptions.classList.toggle('show');
        });
    }
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.floating-chat')) {
            if (chatOptions) chatOptions.classList.remove('show');
        }
    });

    // Gán các hàm global
    window.showProductDetail = showProductDetail;
    window.filterBySubCategory = filterBySubCategory;
    window.contactZalo = contactZalo;
    window.contactTelegram = contactTelegram;
    window.searchProducts = searchProducts;
    window.changeMainImage = changeMainImage;
});