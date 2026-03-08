// Khởi tạo dữ liệu
let data = {};
let settings = JSON.parse(localStorage.getItem('adminSettings')) || {
    confirmDelete: true,
    showNotifications: true
};
let websiteSettings = {};

// Biến lưu trạng thái
let selectedMainCategoryId = null;
let selectedSubCategoryId = null;

// Load dữ liệu
function loadData() {
    const savedData = localStorage.getItem('shopData');
    if (savedData) {
        data = JSON.parse(savedData);
    } else {
        // Dữ liệu mẫu
        data = {
            mainCategories: [
                { id: 1, name: "Điện thoại", image: "https://via.placeholder.com/100x100/3498db/ffffff?text=Phone", subCategories: [1, 2] },
                { id: 2, name: "Laptop", image: "https://via.placeholder.com/100x100/e74c3c/ffffff?text=Laptop", subCategories: [3, 4] },
                { id: 3, name: "Phụ kiện", image: "https://via.placeholder.com/100x100/f1c40f/000000?text=Accessories", subCategories: [5, 6, 7] },
                { id: 4, name: "Free Fire", image: "https://via.placeholder.com/100x100/ff6b6b/ffffff?text=Free+Fire", subCategories: [8, 9] }
            ],
            subCategories: [
                { id: 1, name: "iPhone", image: "https://via.placeholder.com/100x100/3498db/ffffff?text=iPhone", mainCategoryId: 1, products: [1, 2] },
                { id: 2, name: "Samsung", image: "https://via.placeholder.com/100x100/3498db/ffffff?text=Samsung", mainCategoryId: 1, products: [3, 4] },
                { id: 3, name: "MacBook", image: "https://via.placeholder.com/100x100/e74c3c/ffffff?text=MacBook", mainCategoryId: 2, products: [5] },
                { id: 4, name: "Dell", image: "https://via.placeholder.com/100x100/e74c3c/ffffff?text=Dell", mainCategoryId: 2, products: [6] },
                { id: 5, name: "Tai nghe", image: "https://via.placeholder.com/100x100/f1c40f/000000?text=Headphones", mainCategoryId: 3, products: [7, 8] },
                { id: 6, name: "Sạc dự phòng", image: "https://via.placeholder.com/100x100/f1c40f/000000?text=Powerbank", mainCategoryId: 3, products: [9] },
                { id: 7, name: "Ốp lưng", image: "https://via.placeholder.com/100x100/f1c40f/000000?text=Case", mainCategoryId: 3, products: [10] },
                { id: 8, name: "Nhân vật", image: "https://via.placeholder.com/100x100/ff6b6b/ffffff?text=Characters", mainCategoryId: 4, products: [] },
                { id: 9, name: "Vũ khí", image: "https://via.placeholder.com/100x100/ff6b6b/ffffff?text=Weapons", mainCategoryId: 4, products: [] }
            ],
            products: [
                { id: 1, code: "IP14PM", name: "iPhone 14 Pro Max", price: 33990000, images: ["https://via.placeholder.com/800x600/3498db/ffffff?text=iPhone+14+Pro+Max+1", "https://via.placeholder.com/800x600/3498db/ffffff?text=iPhone+14+Pro+Max+2", "https://via.placeholder.com/800x600/3498db/ffffff?text=iPhone+14+Pro+Max+3"], status: "online", description: "iPhone 14 Pro Max - Siêu phẩm mới nhất từ Apple", subCategoryId: 1, zalo: "https://zalo.me/0123456789", telegram: "https://t.me/shoponline" },
                { id: 2, code: "IP14P", name: "iPhone 14 Pro", price: 29990000, images: ["https://via.placeholder.com/800x600/3498db/ffffff?text=iPhone+14+Pro+1", "https://via.placeholder.com/800x600/3498db/ffffff?text=iPhone+14+Pro+2"], status: "online", description: "iPhone 14 Pro - Màn hình Always-On", subCategoryId: 1, zalo: "https://zalo.me/0123456789", telegram: "https://t.me/shoponline" },
                { id: 3, code: "SS23U", name: "Samsung Galaxy S23 Ultra", price: 28990000, images: ["https://via.placeholder.com/800x600/3498db/ffffff?text=S23+Ultra+1", "https://via.placeholder.com/800x600/3498db/ffffff?text=S23+Ultra+2", "https://via.placeholder.com/800x600/3498db/ffffff?text=S23+Ultra+3", "https://via.placeholder.com/800x600/3498db/ffffff?text=S23+Ultra+4"], status: "maintenance", description: "Galaxy S23 Ultra - Camera 200MP", subCategoryId: 2, zalo: "https://zalo.me/0123456789", telegram: "https://t.me/shoponline" },
                { id: 4, code: "SSZF5", name: "Samsung Galaxy Z Fold5", price: 41990000, images: ["https://via.placeholder.com/800x600/3498db/ffffff?text=Z+Fold5+1", "https://via.placeholder.com/800x600/3498db/ffffff?text=Z+Fold5+2"], status: "online", description: "Galaxy Z Fold5 - Điện thoại màn hình gập", subCategoryId: 2, zalo: "https://zalo.me/0123456789", telegram: "https://t.me/shoponline" },
                { id: 5, code: "MBP14", name: "MacBook Pro 14 M3", price: 54990000, images: ["https://via.placeholder.com/800x600/e74c3c/ffffff?text=MacBook+Pro+1", "https://via.placeholder.com/800x600/e74c3c/ffffff?text=MacBook+Pro+2", "https://via.placeholder.com/800x600/e74c3c/ffffff?text=MacBook+Pro+3"], status: "online", description: "MacBook Pro với chip M3 Pro", subCategoryId: 3, zalo: "https://zalo.me/0123456789", telegram: "https://t.me/shoponline" },
                { id: 6, code: "DXPS15", name: "Dell XPS 15", price: 45990000, images: ["https://via.placeholder.com/800x600/e74c3c/ffffff?text=Dell+XPS+1", "https://via.placeholder.com/800x600/e74c3c/ffffff?text=Dell+XPS+2"], status: "maintenance", description: "Dell XPS 15 - Laptop cao cấp", subCategoryId: 4, zalo: "https://zalo.me/0123456789", telegram: "https://t.me/shoponline" },
                { id: 7, code: "AP2", name: "Tai nghe AirPods Pro 2", price: 6790000, images: ["https://via.placeholder.com/800x600/f1c40f/000000?text=AirPods+Pro+1", "https://via.placeholder.com/800x600/f1c40f/000000?text=AirPods+Pro+2", "https://via.placeholder.com/800x600/f1c40f/000000?text=AirPods+Pro+3"], status: "online", description: "AirPods Pro 2 - Chống ồn chủ động", subCategoryId: 5, zalo: "https://zalo.me/0123456789", telegram: "https://t.me/shoponline" },
                { id: 8, code: "SONY5", name: "Tai nghe Sony WH-1000XM5", price: 8990000, images: ["https://via.placeholder.com/800x600/f1c40f/000000?text=Sony+WH-1000XM5+1", "https://via.placeholder.com/800x600/f1c40f/000000?text=Sony+WH-1000XM5+2"], status: "online", description: "Tai nghe chống ồn cao cấp", subCategoryId: 5, zalo: "https://zalo.me/0123456789", telegram: "https://t.me/shoponline" },
                { id: 9, code: "ANKER20", name: "Sạc dự phòng Anker 20000mAh", price: 1290000, images: ["https://via.placeholder.com/800x600/f1c40f/000000?text=Anker+Powerbank+1", "https://via.placeholder.com/800x600/f1c40f/000000?text=Anker+Powerbank+2", "https://via.placeholder.com/800x600/f1c40f/000000?text=Anker+Powerbank+3"], status: "online", description: "Sạc dự phòng dung lượng lớn", subCategoryId: 6, zalo: "https://zalo.me/0123456789", telegram: "https://t.me/shoponline" },
                { id: 10, code: "OP14", name: "Ốp lưng MagSafe iPhone 14", price: 890000, images: ["https://via.placeholder.com/800x600/f1c40f/000000?text=MagSafe+Case+1", "https://via.placeholder.com/800x600/f1c40f/000000?text=MagSafe+Case+2"], status: "maintenance", description: "Ốp lưng chính hãng Apple", subCategoryId: 7, zalo: "https://zalo.me/0123456789", telegram: "https://t.me/shoponline" }
            ]
        };
        saveData();
    }

    // Load cài đặt website
    const savedSettings = localStorage.getItem('websiteSettings');
    if (savedSettings) {
        websiteSettings = JSON.parse(savedSettings);
    } else {
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
        saveWebsiteSettings();
    }
}

// Lưu dữ liệu
function saveData() {
    localStorage.setItem('shopData', JSON.stringify(data));
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'shopData',
        newValue: JSON.stringify(data)
    }));
}

function saveWebsiteSettings() {
    localStorage.setItem('websiteSettings', JSON.stringify(websiteSettings));
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'websiteSettings',
        newValue: JSON.stringify(websiteSettings)
    }));
}

// Format tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Hiển thị thông báo
function showNotification(message, type = 'success') {
    if (!settings.showNotifications) return;
    
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Cập nhật dashboard
function updateDashboardStats() {
    document.getElementById('totalProducts').textContent = data.products.length;
    document.getElementById('totalMainCategories').textContent = data.mainCategories.length;
    document.getElementById('totalSubCategories').textContent = data.subCategories.length;
    document.getElementById('totalOnline').textContent = data.products.filter(p => p.status === 'online').length;
    
    const recentProducts = data.products.slice(-5).reverse();
    const tbody = document.querySelector('#recentProducts tbody');
    if (tbody) {
        tbody.innerHTML = recentProducts.map(product => {
            const subCat = data.subCategories.find(s => s.id === product.subCategoryId);
            return `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.code}</td>
                    <td>${product.name}</td>
                    <td>${formatPrice(product.price)}</td>
                    <td><span class="status-badge status-${product.status}">${product.status === 'online' ? 'Online' : 'Bảo trì'}</span></td>
                    <td>${subCat ? subCat.name : 'N/A'}</td>
                </tr>
            `;
        }).join('');
    }
}

// Render grid danh mục phụ cho sản phẩm
function renderSubCategoryGrid() {
    const grid = document.getElementById('subCategoryGrid');
    if (!grid) return;
    
    grid.innerHTML = data.subCategories.map(sub => {
        const mainCat = data.mainCategories.find(m => m.id === sub.mainCategoryId);
        const productCount = sub.products.length;
        const isActive = selectedSubCategoryId === sub.id;
        
        return `
            <div class="subcategory-card ${isActive ? 'active' : ''}" onclick="selectSubCategory(${sub.id})">
                <div class="subcategory-card-image">
                    <img src="${sub.image}" alt="${sub.name}" onerror="if(!this.src.includes('data:image')) this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'150\' viewBox=\'0 0 150 150\'%3E%3Crect width=\'150\' height=\'150\' fill=\'%23cccccc\'/%3E%3Ctext x=\'30\' y=\'85\' font-size=\'18\' fill=\'%23000\'%3EError%3C/text%3E%3C/svg%3E';">
                </div>
                <div class="subcategory-card-info">
                    <h4>${sub.name}</h4>
                    <div class="main-category-name">${mainCat ? mainCat.name : 'Không có danh mục'}</div>
                    <span class="product-count-badge">${productCount} sản phẩm</span>
                </div>
            </div>
        `;
    }).join('');
}

// Chọn danh mục phụ
function selectSubCategory(subCatId) {
    selectedSubCategoryId = subCatId;
    renderSubCategoryGrid();
    
    const subCat = data.subCategories.find(s => s.id === subCatId);
    if (!subCat) return;
    
    document.getElementById('selectedSubCategoryTitle').textContent = `Sản phẩm danh mục: ${subCat.name}`;
    document.getElementById('productDetailArea').style.display = 'block';
    renderProductsTable(subCatId);
    
    setTimeout(() => {
        document.getElementById('productDetailArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Ẩn khu vực chi tiết sản phẩm
function hideProductDetail() {
    selectedSubCategoryId = null;
    document.getElementById('productDetailArea').style.display = 'none';
    renderSubCategoryGrid();
}

// Render bảng sản phẩm theo danh mục phụ
function renderProductsTable(subCatId = null) {
    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) return;
    
    let products = [];
    if (subCatId) {
        products = data.products.filter(p => p.subCategoryId === subCatId);
    } else if (selectedSubCategoryId) {
        products = data.products.filter(p => p.subCategoryId === selectedSubCategoryId);
    } else {
        products = [];
    }
    
    tbody.innerHTML = products.map(product => {
        return `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/50x50/cccccc/000000?text=No+Image'}" alt="${product.name}" onerror="if(!this.src.includes('data:image')) this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'50\' height=\'50\' viewBox=\'0 0 50 50\'%3E%3Crect width=\'50\' height=\'50\' fill=\'%23cccccc\'/%3E%3Ctext x=\'5\' y=\'30\' font-size=\'12\' fill=\'%23000\'%3ENo img%3C/text%3E%3C/svg%3E';"></td>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${formatPrice(product.price)}</td>
                <td><span class="status-badge status-${product.status}">${product.status === 'online' ? 'Online' : 'Bảo trì'}</span></td>
                <td>
                    <button class="btn-edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// Render bảng danh mục chính
function renderMainCategoriesTable() {
    const tbody = document.querySelector('#mainCategoriesTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = data.mainCategories.map(cat => {
        const subCount = data.subCategories.filter(s => s.mainCategoryId === cat.id).length;
        return `
            <tr>
                <td>${cat.id}</td>
                <td><img src="${cat.image}" alt="${cat.name}" onerror="if(!this.src.includes('data:image')) this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'50\' height=\'50\' viewBox=\'0 0 50 50\'%3E%3Crect width=\'50\' height=\'50\' fill=\'%23cccccc\'/%3E%3Ctext x=\'5\' y=\'30\' font-size=\'12\' fill=\'%23000\'%3EError%3C/text%3E%3C/svg%3E';"></td>
                <td>${cat.name}</td>
                <td>${subCount}</td>
                <td>
                    <button class="btn-edit" onclick="editMainCategory(${cat.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="deleteMainCategory(${cat.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// Render grid danh mục chính
function renderMainCategoryGrid() {
    const grid = document.getElementById('mainCategoryGrid');
    if (!grid) return;
    
    grid.innerHTML = data.mainCategories.map(cat => {
        const subCount = data.subCategories.filter(s => s.mainCategoryId === cat.id).length;
        const totalProducts = data.subCategories
            .filter(s => s.mainCategoryId === cat.id)
            .reduce((total, sub) => total + sub.products.length, 0);
        
        const isActive = selectedMainCategoryId === cat.id;
        
        return `
            <div class="main-category-card ${isActive ? 'active' : ''}" onclick="selectMainCategory(${cat.id})">
                <div class="main-category-image">
                    <img src="${cat.image}" alt="${cat.name}" onerror="if(!this.src.includes('data:image')) this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'150\' viewBox=\'0 0 150 150\'%3E%3Crect width=\'150\' height=\'150\' fill=\'%23cccccc\'/%3E%3Ctext x=\'30\' y=\'85\' font-size=\'18\' fill=\'%23000\'%3EError%3C/text%3E%3C/svg%3E';">
                </div>
                <div class="main-category-info">
                    <h4>${cat.name}</h4>
                    <div class="sub-count">${subCount} danh mục phụ</div>
                    <span class="product-count-badge">${totalProducts} sản phẩm</span>
                </div>
            </div>
        `;
    }).join('');
}

// Chọn danh mục chính
function selectMainCategory(mainCatId) {
    selectedMainCategoryId = mainCatId;
    renderMainCategoryGrid();
    
    const mainCat = data.mainCategories.find(c => c.id === mainCatId);
    if (!mainCat) return;
    
    document.getElementById('selectedMainCategoryTitle').textContent = `Danh mục phụ của: ${mainCat.name}`;
    document.getElementById('subCategoryDetailArea').style.display = 'block';
    renderSubCategoriesTable(mainCatId);
    
    setTimeout(() => {
        document.getElementById('subCategoryDetailArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Ẩn khu vực chi tiết
function hideSubCategoryDetail() {
    selectedMainCategoryId = null;
    document.getElementById('subCategoryDetailArea').style.display = 'none';
    renderMainCategoryGrid();
}

// Render bảng danh mục phụ
function renderSubCategoriesTable(mainCatId = null) {
    const tbody = document.querySelector('#subCategoriesTable tbody');
    if (!tbody) return;
    
    let subCats = [];
    if (mainCatId) {
        subCats = data.subCategories.filter(s => s.mainCategoryId === mainCatId);
    } else if (selectedMainCategoryId) {
        subCats = data.subCategories.filter(s => s.mainCategoryId === selectedMainCategoryId);
    } else {
        subCats = [];
    }
    
    tbody.innerHTML = subCats.map(sub => {
        return `
            <tr>
                <td>${sub.id}</td>
                <td><img src="${sub.image}" alt="${sub.name}" onerror="if(!this.src.includes('data:image')) this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'50\' height=\'50\' viewBox=\'0 0 50 50\'%3E%3Crect width=\'50\' height=\'50\' fill=\'%23cccccc\'/%3E%3Ctext x=\'5\' y=\'30\' font-size=\'12\' fill=\'%23000\'%3EError%3C/text%3E%3C/svg%3E';"></td>
                <td>${sub.name}</td>
                <td>${sub.products.length}</td>
                <td>
                    <button class="btn-edit" onclick="editSubCategory(${sub.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="deleteSubCategory(${sub.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// Render cài đặt lên form
function renderSettingsForm() {
    document.getElementById('settingLogo').value = websiteSettings.logo || '';
    document.getElementById('settingAboutText').value = websiteSettings.aboutText || '';
    document.getElementById('settingPhone').value = websiteSettings.phone || '';
    document.getElementById('settingEmail').value = websiteSettings.email || '';
    document.getElementById('settingAddress').value = websiteSettings.address || '';
    document.getElementById('settingWorkingHours').value = websiteSettings.workingHours || '';
    document.getElementById('settingFacebook').value = websiteSettings.facebook || '';
    document.getElementById('settingInstagram').value = websiteSettings.instagram || '';
    document.getElementById('settingYoutube').value = websiteSettings.youtube || '';
    document.getElementById('settingTiktok').value = websiteSettings.tiktok || '';
    document.getElementById('settingZaloQR').value = websiteSettings.zaloQR || '';
    document.getElementById('settingCopyright').value = websiteSettings.footerCopyright || '';
}

// Lưu cài đặt từ form
function saveSettings() {
    websiteSettings = {
        logo: document.getElementById('settingLogo').value,
        aboutText: document.getElementById('settingAboutText').value,
        phone: document.getElementById('settingPhone').value,
        email: document.getElementById('settingEmail').value,
        address: document.getElementById('settingAddress').value,
        workingHours: document.getElementById('settingWorkingHours').value,
        facebook: document.getElementById('settingFacebook').value,
        instagram: document.getElementById('settingInstagram').value,
        youtube: document.getElementById('settingYoutube').value,
        tiktok: document.getElementById('settingTiktok').value,
        zaloQR: document.getElementById('settingZaloQR').value,
        footerCopyright: document.getElementById('settingCopyright').value
    };
    saveWebsiteSettings();
    showNotification('Đã lưu cài đặt thành công!');
}

// Render tất cả bảng
function renderAdminTables() {
    renderSubCategoryGrid();
    renderMainCategoriesTable();
    renderMainCategoryGrid();
    if (selectedMainCategoryId) {
        renderSubCategoriesTable(selectedMainCategoryId);
    }
    if (selectedSubCategoryId) {
        renderProductsTable(selectedSubCategoryId);
    }
    updateDashboardStats();
    renderSettingsForm();
}

// Tab switching
document.querySelectorAll('.sidebar-menu li').forEach(item => {
    item.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        
        document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(tabId + '-tab').classList.add('active');
        
        document.getElementById('pageTitle').textContent = this.querySelector('span').textContent;

        if (tabId === 'settings') {
            renderSettingsForm();
        }
    });
});

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Product functions
function showAddProductModal() {
    document.getElementById('productModalTitle').textContent = 'Thêm sản phẩm';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    
    const select = document.getElementById('productSubCategory');
    select.innerHTML = data.subCategories.map(sub => 
        `<option value="${sub.id}">${sub.name}</option>`
    ).join('');
    
    document.getElementById('productImagesContainer').innerHTML = `
        <div class="image-input-group">
            <input type="url" class="product-image-input" placeholder="URL ảnh 1" required>
        </div>
    `;
    
    document.getElementById('productModal').style.display = 'block';
}

function editProduct(id) {
    const product = data.products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('productModalTitle').textContent = 'Sửa sản phẩm';
    document.getElementById('productId').value = product.id;
    document.getElementById('productCode').value = product.code;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStatus').value = product.status;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productZalo').value = product.zalo || '';
    document.getElementById('productTelegram').value = product.telegram || '';
    
    const select = document.getElementById('productSubCategory');
    select.innerHTML = data.subCategories.map(sub => 
        `<option value="${sub.id}" ${sub.id === product.subCategoryId ? 'selected' : ''}>${sub.name}</option>`
    ).join('');
    
    const imagesContainer = document.getElementById('productImagesContainer');
    imagesContainer.innerHTML = '';
    if (product.images && product.images.length > 0) {
        product.images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'image-input-group';
            div.innerHTML = `
                <input type="url" class="product-image-input" value="${img}" placeholder="URL ảnh ${index + 1}" required>
                <button type="button" class="btn-remove-image" onclick="removeImageInput(this)"><i class="fas fa-times"></i></button>
            `;
            imagesContainer.appendChild(div);
        });
    } else {
        imagesContainer.innerHTML = '<div class="image-input-group"><input type="url" class="product-image-input" placeholder="URL ảnh 1" required></div>';
    }
    
    document.getElementById('productModal').style.display = 'block';
}

function addImageInput() {
    const container = document.getElementById('productImagesContainer');
    const index = container.children.length + 1;
    const div = document.createElement('div');
    div.className = 'image-input-group';
    div.innerHTML = `
        <input type="url" class="product-image-input" placeholder="URL ảnh ${index}" required>
        <button type="button" class="btn-remove-image" onclick="removeImageInput(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(div);
}

function removeImageInput(button) {
    const container = document.getElementById('productImagesContainer');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        showNotification('Phải có ít nhất 1 ảnh', 'warning');
    }
}

function saveProduct(event) {
    event.preventDefault();
    
    const id = document.getElementById('productId').value;
    
    const imageInputs = document.querySelectorAll('.product-image-input');
    const images = Array.from(imageInputs).map(input => input.value.trim()).filter(url => url !== '');
    
    if (images.length === 0) {
        showNotification('Vui lòng nhập ít nhất 1 URL ảnh', 'error');
        return;
    }
    
    const productData = {
        code: document.getElementById('productCode').value,
        name: document.getElementById('productName').value,
        price: parseInt(document.getElementById('productPrice').value),
        images: images,
        subCategoryId: parseInt(document.getElementById('productSubCategory').value),
        status: document.getElementById('productStatus').value,
        description: document.getElementById('productDescription').value,
        zalo: document.getElementById('productZalo').value,
        telegram: document.getElementById('productTelegram').value
    };
    
    if (id) {
        const index = data.products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            const oldProduct = data.products[index];
            data.products[index] = { ...oldProduct, ...productData };
            
            if (oldProduct.subCategoryId !== productData.subCategoryId) {
                const oldSubCat = data.subCategories.find(s => s.id === oldProduct.subCategoryId);
                if (oldSubCat) {
                    oldSubCat.products = oldSubCat.products.filter(pid => pid !== parseInt(id));
                }
                
                const newSubCat = data.subCategories.find(s => s.id === productData.subCategoryId);
                if (newSubCat) {
                    newSubCat.products.push(parseInt(id));
                }
            }
            
            showNotification('Cập nhật sản phẩm thành công!');
        }
    } else {
        const newId = Math.max(...data.products.map(p => p.id), 0) + 1;
        const newProduct = { id: newId, ...productData };
        data.products.push(newProduct);
        
        const subCat = data.subCategories.find(s => s.id === productData.subCategoryId);
        if (subCat) {
            subCat.products.push(newId);
        }
        
        showNotification('Thêm sản phẩm thành công!');
    }
    
    saveData();
    
    renderSubCategoryGrid();
    renderMainCategoryGrid();
    if (selectedSubCategoryId) {
        renderProductsTable(selectedSubCategoryId);
    }
    if (selectedMainCategoryId) {
        renderSubCategoriesTable(selectedMainCategoryId);
    }
    
    updateDashboardStats();
    closeModal('productModal');
}

function deleteProduct(id) {
    if (settings.confirmDelete && !confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    
    const product = data.products.find(p => p.id === id);
    if (!product) return;
    
    const subCat = data.subCategories.find(s => s.id === product.subCategoryId);
    if (subCat) {
        subCat.products = subCat.products.filter(pid => pid !== id);
    }
    
    data.products = data.products.filter(p => p.id !== id);
    
    saveData();
    
    renderSubCategoryGrid();
    renderMainCategoryGrid();
    if (selectedSubCategoryId) {
        renderProductsTable(selectedSubCategoryId);
    }
    if (selectedMainCategoryId) {
        renderSubCategoriesTable(selectedMainCategoryId);
    }
    
    updateDashboardStats();
    showNotification('Xóa sản phẩm thành công!');
}

// Main Category functions
function showAddMainCategoryModal() {
    document.getElementById('mainCategoryModalTitle').textContent = 'Thêm danh mục chính';
    document.getElementById('mainCategoryForm').reset();
    document.getElementById('mainCategoryId').value = '';
    document.getElementById('mainCategoryModal').style.display = 'block';
}

function editMainCategory(id) {
    const category = data.mainCategories.find(c => c.id === id);
    if (!category) return;
    
    document.getElementById('mainCategoryModalTitle').textContent = 'Sửa danh mục chính';
    document.getElementById('mainCategoryId').value = category.id;
    document.getElementById('mainCategoryName').value = category.name;
    document.getElementById('mainCategoryImage').value = category.image;
    document.getElementById('mainCategoryModal').style.display = 'block';
}

function saveMainCategory(event) {
    event.preventDefault();
    
    const id = document.getElementById('mainCategoryId').value;
    const categoryData = {
        name: document.getElementById('mainCategoryName').value,
        image: document.getElementById('mainCategoryImage').value
    };
    
    if (id) {
        const index = data.mainCategories.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            data.mainCategories[index] = { ...data.mainCategories[index], ...categoryData };
            showNotification('Cập nhật danh mục chính thành công!');
        }
    } else {
        const newId = Math.max(...data.mainCategories.map(c => c.id), 0) + 1;
        data.mainCategories.push({ id: newId, ...categoryData, subCategories: [] });
        showNotification('Thêm danh mục chính thành công!');
    }
    
    saveData();
    renderMainCategoriesTable();
    renderMainCategoryGrid();
    updateDashboardStats();
    closeModal('mainCategoryModal');
}

function deleteMainCategory(id) {
    if (settings.confirmDelete && !confirm('Bạn có chắc muốn xóa danh mục chính này? Các danh mục phụ và sản phẩm liên quan sẽ bị xóa!')) {
        return;
    }
    
    const subCats = data.subCategories.filter(s => s.mainCategoryId === id);
    
    subCats.forEach(sub => {
        data.products = data.products.filter(p => !sub.products.includes(p.id));
    });
    
    data.subCategories = data.subCategories.filter(s => s.mainCategoryId !== id);
    data.mainCategories = data.mainCategories.filter(c => c.id !== id);
    
    if (selectedMainCategoryId === id) {
        hideSubCategoryDetail();
    }
    
    saveData();
    renderMainCategoriesTable();
    renderMainCategoryGrid();
    renderSubCategoryGrid();
    renderProductsTable();
    updateDashboardStats();
    showNotification('Xóa danh mục chính thành công!');
}

// SubCategory functions
function showAddSubCategoryModal() {
    document.getElementById('subCategoryModalTitle').textContent = 'Thêm danh mục phụ';
    document.getElementById('subCategoryForm').reset();
    document.getElementById('subCategoryId').value = '';
    
    const select = document.getElementById('subCategoryMain');
    select.innerHTML = data.mainCategories.map(cat => 
        `<option value="${cat.id}">${cat.name}</option>`
    ).join('');
    
    document.getElementById('subCategoryModal').style.display = 'block';
}

function editSubCategory(id) {
    const subCat = data.subCategories.find(s => s.id === id);
    if (!subCat) return;
    
    document.getElementById('subCategoryModalTitle').textContent = 'Sửa danh mục phụ';
    document.getElementById('subCategoryId').value = subCat.id;
    document.getElementById('subCategoryName').value = subCat.name;
    document.getElementById('subCategoryImage').value = subCat.image;
    
    const select = document.getElementById('subCategoryMain');
    select.innerHTML = data.mainCategories.map(cat => 
        `<option value="${cat.id}" ${cat.id === subCat.mainCategoryId ? 'selected' : ''}>${cat.name}</option>`
    ).join('');
    
    document.getElementById('subCategoryModal').style.display = 'block';
}

function saveSubCategory(event) {
    event.preventDefault();
    
    const id = document.getElementById('subCategoryId').value;
    const mainCatId = parseInt(document.getElementById('subCategoryMain').value);
    const subCatData = {
        name: document.getElementById('subCategoryName').value,
        image: document.getElementById('subCategoryImage').value,
        mainCategoryId: mainCatId
    };
    
    if (id) {
        const index = data.subCategories.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            const oldSubCat = data.subCategories[index];
            
            if (oldSubCat.mainCategoryId !== mainCatId) {
                const oldMainCat = data.mainCategories.find(m => m.id === oldSubCat.mainCategoryId);
                if (oldMainCat) {
                    oldMainCat.subCategories = oldMainCat.subCategories.filter(sid => sid !== parseInt(id));
                }
                
                const newMainCat = data.mainCategories.find(m => m.id === mainCatId);
                if (newMainCat) {
                    newMainCat.subCategories.push(parseInt(id));
                }
            }
            
            data.subCategories[index] = { ...oldSubCat, ...subCatData };
            showNotification('Cập nhật danh mục phụ thành công!');
        }
    } else {
        const newId = Math.max(...data.subCategories.map(s => s.id), 0) + 1;
        const newSubCat = { id: newId, ...subCatData, products: [] };
        data.subCategories.push(newSubCat);
        
        const mainCat = data.mainCategories.find(m => m.id === mainCatId);
        if (mainCat) {
            mainCat.subCategories.push(newId);
        }
        
        showNotification('Thêm danh mục phụ thành công!');
    }
    
    saveData();
    
    renderMainCategoriesTable();
    renderMainCategoryGrid();
    renderSubCategoryGrid();
    if (selectedMainCategoryId === mainCatId) {
        renderSubCategoriesTable(mainCatId);
    }
    
    updateDashboardStats();
    closeModal('subCategoryModal');
}

function deleteSubCategory(id) {
    if (settings.confirmDelete && !confirm('Bạn có chắc muốn xóa danh mục phụ này? Các sản phẩm liên quan sẽ bị xóa!')) {
        return;
    }
    
    const subCat = data.subCategories.find(s => s.id === id);
    if (!subCat) return;
    
    const mainCatId = subCat.mainCategoryId;
    
    data.products = data.products.filter(p => !subCat.products.includes(p.id));
    
    const mainCat = data.mainCategories.find(m => m.id === mainCatId);
    if (mainCat) {
        mainCat.subCategories = mainCat.subCategories.filter(sid => sid !== id);
    }
    
    data.subCategories = data.subCategories.filter(s => s.id !== id);
    
    saveData();
    
    renderMainCategoriesTable();
    renderMainCategoryGrid();
    renderSubCategoryGrid();
    if (selectedMainCategoryId === mainCatId) {
        renderSubCategoriesTable(mainCatId);
    }
    if (selectedSubCategoryId === id) {
        hideProductDetail();
    }
    
    renderProductsTable();
    updateDashboardStats();
    showNotification('Xóa danh mục phụ thành công!');
}

// Lắng nghe sự kiện thay đổi từ tab khác
window.addEventListener('storage', function(e) {
    if (e.key === 'shopData') {
        console.log('Dữ liệu sản phẩm thay đổi, cập nhật lại...');
        loadData();
        renderAdminTables();
        showNotification('Dữ liệu sản phẩm đã được cập nhật từ tab khác!', 'info');
    }
    if (e.key === 'websiteSettings') {
        console.log('Cài đặt website thay đổi, cập nhật lại...');
        websiteSettings = JSON.parse(e.newValue);
        renderSettingsForm();
        showNotification('Cài đặt đã được cập nhật từ tab khác!', 'info');
    }
});

// Khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderAdminTables();
    
    window.onclick = function(event) {
        if (event.target.classList.contains('admin-modal')) {
            event.target.style.display = 'none';
        }
    };
    
    window.closeModal = closeModal;
    window.showAddProductModal = showAddProductModal;
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
    window.addImageInput = addImageInput;
    window.removeImageInput = removeImageInput;
    window.showAddMainCategoryModal = showAddMainCategoryModal;
    window.editMainCategory = editMainCategory;
    window.deleteMainCategory = deleteMainCategory;
    window.showAddSubCategoryModal = showAddSubCategoryModal;
    window.editSubCategory = editSubCategory;
    window.deleteSubCategory = deleteSubCategory;
    window.saveProduct = saveProduct;
    window.saveMainCategory = saveMainCategory;
    window.saveSubCategory = saveSubCategory;
    window.selectMainCategory = selectMainCategory;
    window.hideSubCategoryDetail = hideSubCategoryDetail;
    window.selectSubCategory = selectSubCategory;
    window.hideProductDetail = hideProductDetail;
    window.saveSettings = saveSettings;
});