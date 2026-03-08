// Dữ liệu mẫu ban đầu (dùng khi chưa có dữ liệu trên Firebase)
const defaultData = {
    mainCategories: [
        {
            id: 1,
            name: "Điện thoại",
            image: "https://via.placeholder.com/100x100/3498db/ffffff?text=Phone",
            subCategories: [1, 2]
        },
        {
            id: 2,
            name: "Laptop",
            image: "https://via.placeholder.com/100x100/e74c3c/ffffff?text=Laptop",
            subCategories: [3, 4]
        },
        {
            id: 3,
            name: "Phụ kiện",
            image: "https://via.placeholder.com/100x100/f1c40f/000000?text=Accessories",
            subCategories: [5, 6, 7]
        }
    ],
    subCategories: [
        { id: 1, name: "iPhone", image: "https://via.placeholder.com/100x100/3498db/ffffff?text=iPhone", mainCategoryId: 1, products: [1, 2] },
        { id: 2, name: "Samsung", image: "https://via.placeholder.com/100x100/3498db/ffffff?text=Samsung", mainCategoryId: 1, products: [3, 4] },
        { id: 3, name: "MacBook", image: "https://via.placeholder.com/100x100/e74c3c/ffffff?text=MacBook", mainCategoryId: 2, products: [5] },
        { id: 4, name: "Dell", image: "https://via.placeholder.com/100x100/e74c3c/ffffff?text=Dell", mainCategoryId: 2, products: [6] },
        { id: 5, name: "Tai nghe", image: "https://via.placeholder.com/100x100/f1c40f/000000?text=Headphones", mainCategoryId: 3, products: [7, 8] },
        { id: 6, name: "Sạc dự phòng", image: "https://via.placeholder.com/100x100/f1c40f/000000?text=Powerbank", mainCategoryId: 3, products: [9] },
        { id: 7, name: "Ốp lưng", image: "https://via.placeholder.com/100x100/f1c40f/000000?text=Case", mainCategoryId: 3, products: [10] }
    ],
    products: [
        { 
            id: 1, 
            code: "IP14PM", 
            name: "iPhone 14 Pro Max", 
            price: 33990000, 
            images: ["https://via.placeholder.com/800x600/3498db/ffffff?text=iPhone+14+Pro+Max+1", "https://via.placeholder.com/800x600/3498db/ffffff?text=iPhone+14+Pro+Max+2", "https://via.placeholder.com/800x600/3498db/ffffff?text=iPhone+14+Pro+Max+3"],
            status: "online", 
            description: "iPhone 14 Pro Max - Siêu phẩm mới nhất từ Apple với chip A16 Bionic, camera 48MP\n\n• Màn hình Super Retina XDR 6.7 inch\n• Chip A16 Bionic\n• Camera chính 48MP\n• Pin lên đến 29 giờ xem video", 
            subCategoryId: 1, 
            zalo: "https://zalo.me/0123456789", 
            telegram: "https://t.me/shoponline" 
        },
        { 
            id: 2, 
            code: "IP14P", 
            name: "iPhone 14 Pro", 
            price: 29990000, 
            images: ["https://via.placeholder.com/800x600/3498db/ffffff?text=iPhone+14+Pro+1", "https://via.placeholder.com/800x600/3498db/ffffff?text=iPhone+14+Pro+2"],
            status: "online", 
            description: "iPhone 14 Pro - Màn hình Always-On, Dynamic Island đột phá\n\n• Màn hình 6.1 inch\n• Chip A16 Bionic\n• Dynamic Island tiện lợi\n• Camera 48MP", 
            subCategoryId: 1, 
            zalo: "https://zalo.me/0123456789", 
            telegram: "https://t.me/shoponline" 
        },
        { 
            id: 3, 
            code: "SS23U", 
            name: "Samsung Galaxy S23 Ultra", 
            price: 28990000, 
            images: ["https://via.placeholder.com/800x600/3498db/ffffff?text=S23+Ultra+1", "https://via.placeholder.com/800x600/3498db/ffffff?text=S23+Ultra+2", "https://via.placeholder.com/800x600/3498db/ffffff?text=S23+Ultra+3", "https://via.placeholder.com/800x600/3498db/ffffff?text=S23+Ultra+4"],
            status: "maintenance", 
            description: "Galaxy S23 Ultra - Camera 200MP, bút S-Pen tích hợp\n\n• Camera 200MP chụp ảnh siêu nét\n• Bút S-Pen tiện lợi\n• Snapdragon 8 Gen 2\n• Pin 5000mAh", 
            subCategoryId: 2, 
            zalo: "https://zalo.me/0123456789", 
            telegram: "https://t.me/shoponline" 
        },
        { 
            id: 4, 
            code: "SSZF5", 
            name: "Samsung Galaxy Z Fold5", 
            price: 41990000, 
            images: ["https://via.placeholder.com/800x600/3498db/ffffff?text=Z+Fold5+1", "https://via.placeholder.com/800x600/3498db/ffffff?text=Z+Fold5+2"],
            status: "online", 
            description: "Galaxy Z Fold5 - Điện thoại màn hình gập thế hệ mới\n\n• Màn hình chính 7.6 inch\n• Màn hình phụ 6.2 inch\n• Bản lề mới mỏng hơn\n• Snapdragon 8 Gen 2", 
            subCategoryId: 2, 
            zalo: "https://zalo.me/0123456789", 
            telegram: "https://t.me/shoponline" 
        },
        { 
            id: 5, 
            code: "MBP14", 
            name: "MacBook Pro 14 M3", 
            price: 54990000, 
            images: ["https://via.placeholder.com/800x600/e74c3c/ffffff?text=MacBook+Pro+1", "https://via.placeholder.com/800x600/e74c3c/ffffff?text=MacBook+Pro+2", "https://via.placeholder.com/800x600/e74c3c/ffffff?text=MacBook+Pro+3"],
            status: "online", 
            description: "MacBook Pro với chip M3 Pro, màn hình Liquid Retina XDR\n\n• Chip M3 Pro 12-core CPU\n• RAM 18GB\n• SSD 512GB\n• Màn hình Liquid Retina XDR 14 inch", 
            subCategoryId: 3, 
            zalo: "https://zalo.me/0123456789", 
            telegram: "https://t.me/shoponline" 
        },
        { 
            id: 6, 
            code: "DXPS15", 
            name: "Dell XPS 15", 
            price: 45990000, 
            images: ["https://via.placeholder.com/800x600/e74c3c/ffffff?text=Dell+XPS+1", "https://via.placeholder.com/800x600/e74c3c/ffffff?text=Dell+XPS+2"],
            status: "maintenance", 
            description: "Dell XPS 15 - Laptop cao cấp với màn hình OLED 4K\n\n• Intel Core i9-13900H\n• RAM 32GB\n• SSD 1TB\n• Màn hình OLED 4K 15.6 inch", 
            subCategoryId: 4, 
            zalo: "https://zalo.me/0123456789", 
            telegram: "https://t.me/shoponline" 
        },
        { 
            id: 7, 
            code: "AP2", 
            name: "Tai nghe AirPods Pro 2", 
            price: 6790000, 
            images: ["https://via.placeholder.com/800x600/f1c40f/000000?text=AirPods+Pro+1", "https://via.placeholder.com/800x600/f1c40f/000000?text=AirPods+Pro+2", "https://via.placeholder.com/800x600/f1c40f/000000?text=AirPods+Pro+3"],
            status: "online", 
            description: "AirPods Pro 2 - Chống ồn chủ động, chip H2\n\n• Chống ồn chủ động 2x tốt hơn\n• Chip H2 cho chất lượng âm thanh vượt trội\n• Thời gian pin lên đến 6 giờ\n• Sạc không dây MagSafe", 
            subCategoryId: 5, 
            zalo: "https://zalo.me/0123456789", 
            telegram: "https://t.me/shoponline" 
        },
        { 
            id: 8, 
            code: "SONY5", 
            name: "Tai nghe Sony WH-1000XM5", 
            price: 8990000, 
            images: ["https://via.placeholder.com/800x600/f1c40f/000000?text=Sony+WH-1000XM5+1", "https://via.placeholder.com/800x600/f1c40f/000000?text=Sony+WH-1000XM5+2"],
            status: "online", 
            description: "Tai nghe chống ồn cao cấp từ Sony\n\n• Chống ồn hàng đầu thị trường\n• Công nghệ Ambient Sound\n• Thời gian pin 30 giờ\n• Sạc nhanh 3 phút nghe 3 giờ", 
            subCategoryId: 5, 
            zalo: "https://zalo.me/0123456789", 
            telegram: "https://t.me/shoponline" 
        },
        { 
            id: 9, 
            code: "ANKER20", 
            name: "Sạc dự phòng Anker 20000mAh", 
            price: 1290000, 
            images: ["https://via.placeholder.com/800x600/f1c40f/000000?text=Anker+Powerbank+1", "https://via.placeholder.com/800x600/f1c40f/000000?text=Anker+Powerbank+2", "https://via.placeholder.com/800x600/f1c40f/000000?text=Anker+Powerbank+3"],
            status: "online", 
            description: "Sạc dự phòng dung lượng lớn, hỗ trợ sạc nhanh\n\n• Dung lượng 20000mAh\n• Công nghệ PowerIQ 3.0\n• Sạc nhanh 20W cho iPhone\n• 2 cổng USB-A và 1 cổng USB-C", 
            subCategoryId: 6, 
            zalo: "https://zalo.me/0123456789", 
            telegram: "https://t.me/shoponline" 
        },
        { 
            id: 10, 
            code: "OP14", 
            name: "Ốp lưng MagSafe iPhone 14", 
            price: 890000, 
            images: ["https://via.placeholder.com/800x600/f1c40f/000000?text=MagSafe+Case+1", "https://via.placeholder.com/800x600/f1c40f/000000?text=MagSafe+Case+2"],
            status: "maintenance", 
            description: "Ốp lưng chính hãng Apple, hỗ trợ MagSafe\n\n• Chất liệu silicone cao cấp\n• Hỗ trợ MagSafe\n• Lớp lót mềm mại\n• Nhiều màu sắc lựa chọn", 
            subCategoryId: 7, 
            zalo: "https://zalo.me/0123456789", 
            telegram: "https://t.me/shoponline" 
        }
    ]
};

// Tham chiếu Firebase (được khởi tạo từ HTML)
const shopDataRef = database.ref('shopData');
const settingsRef = database.ref('websiteSettings');

// Dữ liệu toàn cục
let data = {};
let websiteSettings = {};

// Lắng nghe thay đổi dữ liệu sản phẩm
shopDataRef.on('value', (snapshot) => {
    const val = snapshot.val();
    if (val) {
        data = val;
    } else {
        // Chưa có dữ liệu, tạo mới từ default
        data = JSON.parse(JSON.stringify(defaultData));
        shopDataRef.set(data);
    }
    // Cập nhật giao diện
    renderCategories();
});

// Lắng nghe thay đổi cài đặt website
settingsRef.on('value', (snapshot) => {
    const val = snapshot.val();
    if (val) {
        websiteSettings = val;
    } else {
        // Cài đặt mặc định
        websiteSettings = {
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
            footerCopyright: "© 2024 ShopOnline. Tất cả quyền được bảo lưu."
        };
        settingsRef.set(websiteSettings);
    }
    renderWebsiteSettings();
});

// Hàm lưu dữ liệu (dùng trong admin, nhưng trang chủ không ghi)
function saveData() {
    shopDataRef.set(data);
}

function saveWebsiteSettings() {
    settingsRef.set(websiteSettings);
}

// Hiển thị thông báo (giữ nguyên)
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

// ==================== CÁC HÀM RENDER ====================

// Hiển thị danh mục (chỉ main categories)
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
        const firstMainCat = data.mainCategories[0];
        showMainCategory(firstMainCat.id);
    }
}

// Hiển thị sản phẩm của danh mục chính
function showMainCategory(mainCatId) {
    const subCategories = data.subCategories.filter(sub => sub.mainCategoryId === mainCatId);
    const mainCat = data.mainCategories.find(cat => cat.id === mainCatId);
    renderSubCategoriesList(subCategories, mainCat ? mainCat.name : 'Danh mục');
}

// Hiển thị danh sách danh mục phụ (dạng card)
function renderSubCategoriesList(subCategories, title) {
    const productGrid = document.getElementById('productGrid');
    const categoryTitle = document.getElementById('categoryTitle');
    
    if (!productGrid) return;
    
    if (categoryTitle) {
        categoryTitle.textContent = title;
    }
    
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

// Lọc theo danh mục phụ
function filterBySubCategory(subCatId) {
    const products = data.products.filter(product => product.subCategoryId === subCatId);
    const subCat = data.subCategories.find(cat => cat.id === subCatId);
    renderProducts(products, subCat ? subCat.name : 'Sản phẩm');
}

// Tìm kiếm sản phẩm theo mã
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toUpperCase();
    
    if (searchTerm === '') {
        if (data.mainCategories.length > 0) {
            showMainCategory(data.mainCategories[0].id);
        }
        return;
    }
    
    const foundProducts = data.products.filter(product => 
        product.code && product.code.toUpperCase().includes(searchTerm)
    );
    
    if (foundProducts.length > 0) {
        renderProducts(foundProducts, `Kết quả tìm kiếm mã: ${searchTerm}`);
    } else {
        renderProducts([], `Không tìm thấy mã: ${searchTerm}`);
    }
}

// Hiển thị sản phẩm (dạng card)
function renderProducts(products, title) {
    const productGrid = document.getElementById('productGrid');
    const categoryTitle = document.getElementById('categoryTitle');
    
    if (!productGrid) return;
    
    if (categoryTitle) {
        categoryTitle.textContent = title;
    }
    
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
        
        productCard.innerHTML = `
            <div class="product-badge">${product.code || 'SP' + product.id}</div>
            <div class="product-image">
                <img src="${mainImage}" alt="${product.name}" onerror="if(!this.src.includes('data:image')) this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\' viewBox=\'0 0 400 300\'%3E%3Crect width=\'400\' height=\'300\' fill=\'%23cccccc\'/%3E%3Ctext x=\'100\' y=\'160\' font-size=\'30\' fill=\'%23000\'%3ENo image%3C/text%3E%3C/svg%3E';">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
                <span class="product-status ${statusClass}">${statusText}</span>
                <div class="product-actions">
                    <button class="btn-zalo" onclick="event.stopPropagation(); contactZalo('${product.zalo}')">
                        <i class="fab fa-zalo"></i>
                    </button>
                    <button class="btn-tele" onclick="event.stopPropagation(); contactTelegram('${product.telegram}')">
                        <i class="fab fa-telegram-plane"></i>
                    </button>
                    <button class="btn-view" onclick="event.stopPropagation(); showProductDetail(${product.id})">
                        <i class="fas fa-eye"></i> Chi tiết
                    </button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Liên hệ Zalo
function contactZalo(zaloUrl) {
    if (zaloUrl) {
        window.open(zaloUrl, '_blank');
    } else {
        alert('Chưa có thông tin liên hệ Zalo');
    }
}

// Liên hệ Telegram
function contactTelegram(teleUrl) {
    if (teleUrl) {
        window.open(teleUrl, '_blank');
    } else {
        alert('Chưa có thông tin liên hệ Telegram');
    }
}

// Thay đổi ảnh chính khi click thumbnail
function changeMainImage(element, imageUrl) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageUrl;
        document.querySelectorAll('.thumbnail-item').forEach(item => {
            item.classList.remove('active');
        });
        if (element) {
            element.classList.add('active');
        }
    }
}

// Hiển thị chi tiết sản phẩm
function showProductDetail(productId) {
    const product = data.products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalProductDetail');
    
    const statusClass = product.status === 'online' ? 'status-online' : 'status-maintenance';
    const statusText = product.status === 'online' ? 'Online' : 'Bảo trì';
    
    const description = product.description.replace(/\n/g, '<br>');
    
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
                ${product.images.length > 1 ? `
                <div class="thumbnail-list">
                    ${thumbnails}
                </div>
                ` : ''}
            </div>
        `;
    } else {
        galleryHtml = `
            <div class="product-detail-image">
                <img src="https://via.placeholder.com/600x400/cccccc/000000?text=No+Image" alt="No image">
            </div>
        `;
    }
    
    modalContent.innerHTML = `
        <div class="product-detail">
            ${galleryHtml}
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="product-detail-code">Mã SP: ${product.code || 'SP' + product.id}</div>
                <div class="product-detail-price">${formatPrice(product.price)}</div>
                <span class="product-detail-status ${statusClass}">${statusText}</span>
                <div class="product-detail-desc">${description}</div>
                <div class="product-detail-actions">
                    <button class="btn-zalo" onclick="contactZalo('${product.zalo}')">
                        <i class="fab fa-zalo"></i> Chat Zalo
                    </button>
                    <button class="btn-tele" onclick="contactTelegram('${product.telegram}')">
                        <i class="fab fa-telegram-plane"></i> Chat Telegram
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Đóng modal
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Cập nhật footer và logo từ settings
function renderWebsiteSettings() {
    const logoImg = document.querySelector('.logo img');
    if (logoImg) logoImg.src = websiteSettings.logo;

    const aboutText = document.getElementById('about-text');
    if (aboutText) aboutText.textContent = websiteSettings.aboutText;

    const addressEl = document.getElementById('contact-address');
    if (addressEl) addressEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${websiteSettings.address}`;
    const phoneEl = document.getElementById('contact-phone');
    if (phoneEl) phoneEl.innerHTML = `<i class="fas fa-phone"></i> ${websiteSettings.phone}`;
    const emailEl = document.getElementById('contact-email');
    if (emailEl) emailEl.innerHTML = `<i class="fas fa-envelope"></i> ${websiteSettings.email}`;
    const hoursEl = document.getElementById('contact-hours');
    if (hoursEl) hoursEl.innerHTML = `<i class="fas fa-clock"></i> ${websiteSettings.workingHours}`;

    const fbLink = document.getElementById('social-fb');
    if (fbLink) fbLink.href = websiteSettings.facebook;
    const igLink = document.getElementById('social-ig');
    if (igLink) igLink.href = websiteSettings.instagram;
    const ytLink = document.getElementById('social-yt');
    if (ytLink) ytLink.href = websiteSettings.youtube;
    const ttLink = document.getElementById('social-tt');
    if (ttLink) ttLink.href = websiteSettings.tiktok;

    const zaloQR = document.getElementById('zalo-qr');
    if (zaloQR) zaloQR.src = websiteSettings.zaloQR;

    const copyright = document.getElementById('copyright');
    if (copyright) copyright.textContent = websiteSettings.footerCopyright;
}

// Khởi tạo sự kiện
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý tìm kiếm
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
    
    // Xử lý đóng modal
    document.querySelectorAll('.close').forEach(btn => {
        btn.onclick = closeModal;
    });
    
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    };
    
    // Gán các hàm global
    window.showProductDetail = showProductDetail;
    window.filterBySubCategory = filterBySubCategory;
    window.contactZalo = contactZalo;
    window.contactTelegram = contactTelegram;
    window.searchProducts = searchProducts;
    window.changeMainImage = changeMainImage;
});