// Tham chiếu Firebase
const shopDataRef = database.ref('shopData');
const settingsRef = database.ref('websiteSettings');

// Dữ liệu toàn cục
let data = {};
let settings = JSON.parse(localStorage.getItem('adminSettings')) || {
    confirmDelete: true,
    showNotifications: true
};
let websiteSettings = {};

// Biến trạng thái
let selectedMainCategoryId = null;
let selectedSubCategoryId = null;

// Hàm chuẩn hóa dữ liệu (đảm bảo các mảng tồn tại)
function normalizeData() {
    data.products = data.products || [];
    
    data.mainCategories = (data.mainCategories || []).map(cat => ({
        ...cat,
        subCategories: cat.subCategories || []
    }));
    
    data.subCategories = (data.subCategories || []).map(sub => ({
        ...sub,
        products: sub.products || []
    }));
}

// Lắng nghe dữ liệu sản phẩm
shopDataRef.on('value', (snapshot) => {
    console.log('shopData changed');
    const val = snapshot.val();
    if (val) {
        data = val;
        normalizeData(); // <<< THÊM DÒNG NÀY
    } else {
        // Khởi tạo cấu trúc rỗng
        data = {
            mainCategories: [],
            subCategories: [],
            products: []
        };
        shopDataRef.set(data);
    }
    renderAdminTables();
});

// Lắng nghe cài đặt website
settingsRef.on('value', (snapshot) => {
    console.log('settings changed');
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
            // Các checkbox hiển thị
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
            showCopyright: true
        };
        settingsRef.set(websiteSettings);
    }
    renderSettingsForm();
});

// Hàm lưu dữ liệu
function saveData() {
    shopDataRef.set(data);
}

function saveWebsiteSettings() {
    settingsRef.set(websiteSettings);
}

// Format tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Hiển thị thông báo
function showNotification(message, type = 'success') {
    if (!settings.showNotifications) return;
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Cập nhật dashboard
function updateDashboardStats() {
    const totalProductsEl = document.getElementById('totalProducts');
    if (totalProductsEl) totalProductsEl.textContent = data.products.length;
    const totalMainCategoriesEl = document.getElementById('totalMainCategories');
    if (totalMainCategoriesEl) totalMainCategoriesEl.textContent = data.mainCategories.length;
    const totalSubCategoriesEl = document.getElementById('totalSubCategories');
    if (totalSubCategoriesEl) totalSubCategoriesEl.textContent = data.subCategories.length;
    const totalOnlineEl = document.getElementById('totalOnline');
    if (totalOnlineEl) totalOnlineEl.textContent = data.products.filter(p => p.status === 'online').length;
    
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

// Render grid danh mục phụ
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
    
    const titleEl = document.getElementById('selectedSubCategoryTitle');
    if (titleEl) titleEl.textContent = `Sản phẩm danh mục: ${subCat.name}`;
    const areaEl = document.getElementById('productDetailArea');
    if (areaEl) areaEl.style.display = 'block';
    renderProductsTable(subCatId);
    
    setTimeout(() => {
        const areaEl = document.getElementById('productDetailArea');
        if (areaEl) areaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Ẩn khu vực chi tiết sản phẩm
function hideProductDetail() {
    selectedSubCategoryId = null;
    const areaEl = document.getElementById('productDetailArea');
    if (areaEl) areaEl.style.display = 'none';
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
    
    const titleEl = document.getElementById('selectedMainCategoryTitle');
    if (titleEl) titleEl.textContent = `Danh mục phụ của: ${mainCat.name}`;
    const areaEl = document.getElementById('subCategoryDetailArea');
    if (areaEl) areaEl.style.display = 'block';
    renderSubCategoriesTable(mainCatId);
    
    setTimeout(() => {
        const areaEl = document.getElementById('subCategoryDetailArea');
        if (areaEl) areaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Ẩn khu vực chi tiết
function hideSubCategoryDetail() {
    selectedMainCategoryId = null;
    const areaEl = document.getElementById('subCategoryDetailArea');
    if (areaEl) areaEl.style.display = 'none';
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
    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value || '';
    };
    const setChecked = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.checked = value === true;
    };

    set('settingShopName', websiteSettings.shopName);
    set('settingLogo', websiteSettings.logo);
    set('settingAboutText', websiteSettings.aboutText);
    set('settingPhone', websiteSettings.phone);
    set('settingEmail', websiteSettings.email);
    set('settingAddress', websiteSettings.address);
    set('settingWorkingHours', websiteSettings.workingHours);
    set('settingFacebook', websiteSettings.facebook);
    set('settingInstagram', websiteSettings.instagram);
    set('settingYoutube', websiteSettings.youtube);
    set('settingTiktok', websiteSettings.tiktok);
    set('settingZaloQR', websiteSettings.zaloQR);
    set('settingCopyright', websiteSettings.footerCopyright);

    // Cập nhật checkbox
    setChecked('showShopName', websiteSettings.showShopName);
    setChecked('showLogo', websiteSettings.showLogo);
    setChecked('showAboutText', websiteSettings.showAboutText);
    setChecked('showPhone', websiteSettings.showPhone);
    setChecked('showEmail', websiteSettings.showEmail);
    setChecked('showAddress', websiteSettings.showAddress);
    setChecked('showWorkingHours', websiteSettings.showWorkingHours);
    setChecked('showFacebook', websiteSettings.showFacebook);
    setChecked('showInstagram', websiteSettings.showInstagram);
    setChecked('showYoutube', websiteSettings.showYoutube);
    setChecked('showTiktok', websiteSettings.showTiktok);
    setChecked('showZaloQR', websiteSettings.showZaloQR);
    setChecked('showCopyright', websiteSettings.showCopyright);
}

// Lưu cài đặt từ form
function saveSettings() {
    websiteSettings = {
        shopName: document.getElementById('settingShopName')?.value || '',
        logo: document.getElementById('settingLogo')?.value || '',
        aboutText: document.getElementById('settingAboutText')?.value || '',
        phone: document.getElementById('settingPhone')?.value || '',
        email: document.getElementById('settingEmail')?.value || '',
        address: document.getElementById('settingAddress')?.value || '',
        workingHours: document.getElementById('settingWorkingHours')?.value || '',
        facebook: document.getElementById('settingFacebook')?.value || '',
        instagram: document.getElementById('settingInstagram')?.value || '',
        youtube: document.getElementById('settingYoutube')?.value || '',
        tiktok: document.getElementById('settingTiktok')?.value || '',
        zaloQR: document.getElementById('settingZaloQR')?.value || '',
        footerCopyright: document.getElementById('settingCopyright')?.value || '',

        // Checkbox
        showShopName: document.getElementById('showShopName')?.checked || false,
        showLogo: document.getElementById('showLogo')?.checked || false,
        showAboutText: document.getElementById('showAboutText')?.checked || false,
        showPhone: document.getElementById('showPhone')?.checked || false,
        showEmail: document.getElementById('showEmail')?.checked || false,
        showAddress: document.getElementById('showAddress')?.checked || false,
        showWorkingHours: document.getElementById('showWorkingHours')?.checked || false,
        showFacebook: document.getElementById('showFacebook')?.checked || false,
        showInstagram: document.getElementById('showInstagram')?.checked || false,
        showYoutube: document.getElementById('showYoutube')?.checked || false,
        showTiktok: document.getElementById('showTiktok')?.checked || false,
        showZaloQR: document.getElementById('showZaloQR')?.checked || false,
        showCopyright: document.getElementById('showCopyright')?.checked || false
    };
    saveWebsiteSettings();
    showNotification('Đã lưu cài đặt thành công!');
}

// Render tất cả bảng
function renderAdminTables() {
    console.log('renderAdminTables');
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
        const tabEl = document.getElementById(tabId + '-tab');
        if (tabEl) tabEl.classList.add('active');
        
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) pageTitle.textContent = this.querySelector('span')?.textContent || '';

        if (tabId === 'settings') {
            renderSettingsForm();
        }
    });
});

// Modal functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Product functions
function showAddProductModal() {
    const titleEl = document.getElementById('productModalTitle');
    if (titleEl) titleEl.textContent = 'Thêm sản phẩm';
    const form = document.getElementById('productForm');
    if (form) form.reset();
    const idEl = document.getElementById('productId');
    if (idEl) idEl.value = '';
    
    const select = document.getElementById('productSubCategory');
    if (select) {
        select.innerHTML = data.subCategories.map(sub => 
            `<option value="${sub.id}">${sub.name}</option>`
        ).join('');
    }
    
    const container = document.getElementById('productImagesContainer');
    if (container) {
        container.innerHTML = `
            <div class="image-input-group">
                <input type="url" class="product-image-input" placeholder="URL ảnh 1" required>
            </div>
        `;
    }
    
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'block';
}

function editProduct(id) {
    const product = data.products.find(p => p.id === id);
    if (!product) return;
    
    const titleEl = document.getElementById('productModalTitle');
    if (titleEl) titleEl.textContent = 'Sửa sản phẩm';
    const idEl = document.getElementById('productId');
    if (idEl) idEl.value = product.id;
    const codeEl = document.getElementById('productCode');
    if (codeEl) codeEl.value = product.code;
    const nameEl = document.getElementById('productName');
    if (nameEl) nameEl.value = product.name;
    const priceEl = document.getElementById('productPrice');
    if (priceEl) priceEl.value = product.price;
    const statusEl = document.getElementById('productStatus');
    if (statusEl) statusEl.value = product.status;
    const descEl = document.getElementById('productDescription');
    if (descEl) descEl.value = product.description || '';
    const zaloEl = document.getElementById('productZalo');
    if (zaloEl) zaloEl.value = product.zalo || '';
    const teleEl = document.getElementById('productTelegram');
    if (teleEl) teleEl.value = product.telegram || '';
    
    const select = document.getElementById('productSubCategory');
    if (select) {
        select.innerHTML = data.subCategories.map(sub => 
            `<option value="${sub.id}" ${sub.id === product.subCategoryId ? 'selected' : ''}>${sub.name}</option>`
        ).join('');
    }
    
    const imagesContainer = document.getElementById('productImagesContainer');
    if (imagesContainer) {
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
    }
    
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'block';
}

function addImageInput() {
    const container = document.getElementById('productImagesContainer');
    if (!container) return;
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
    if (!container) return;
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        showNotification('Phải có ít nhất 1 ảnh', 'warning');
    }
}

function saveProduct(event) {
    event.preventDefault();
    
    const id = document.getElementById('productId')?.value;
    
    const imageInputs = document.querySelectorAll('.product-image-input');
    const images = Array.from(imageInputs).map(input => input.value.trim()).filter(url => url !== '');
    
    if (images.length === 0) {
        showNotification('Vui lòng nhập ít nhất 1 URL ảnh', 'error');
        return;
    }
    
    const productData = {
        code: document.getElementById('productCode')?.value,
        name: document.getElementById('productName')?.value,
        price: parseInt(document.getElementById('productPrice')?.value),
        images: images,
        subCategoryId: parseInt(document.getElementById('productSubCategory')?.value),
        status: document.getElementById('productStatus')?.value,
        description: document.getElementById('productDescription')?.value,
        zalo: document.getElementById('productZalo')?.value,
        telegram: document.getElementById('productTelegram')?.value
    };
    
    if (id) {
        // Edit
        const index = data.products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            const oldProduct = data.products[index];
            data.products[index] = { ...oldProduct, ...productData };
            
            // Nếu chuyển danh mục phụ, cập nhật mảng products của cả hai danh mục
            if (oldProduct.subCategoryId !== productData.subCategoryId) {
                const oldSubCat = data.subCategories.find(s => s.id === oldProduct.subCategoryId);
                if (oldSubCat) {
                    oldSubCat.products = oldSubCat.products.filter(pid => pid !== parseInt(id));
                }
                
                const newSubCat = data.subCategories.find(s => s.id === productData.subCategoryId);
                if (newSubCat) {
                    if (!newSubCat.products) newSubCat.products = []; // an toàn
                    newSubCat.products.push(parseInt(id));
                }
            }
            
            showNotification('Cập nhật sản phẩm thành công!');
        }
    } else {
        // Add mới
        const newId = Math.max(...data.products.map(p => p.id), 0) + 1;
        const newProduct = { id: newId, ...productData };
        data.products.push(newProduct);
        
        const subCat = data.subCategories.find(s => s.id === productData.subCategoryId);
        if (subCat) {
            if (!subCat.products) subCat.products = []; // an toàn
            subCat.products.push(newId);
        }
        
        showNotification('Thêm sản phẩm thành công!');
    }
    
    saveData();
    closeModal('productModal');
}

function deleteProduct(id) {
    if (settings.confirmDelete && !confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    
    const product = data.products.find(p => p.id === id);
    if (!product) return;
    
    const subCat = data.subCategories.find(s => s.id === product.subCategoryId);
    if (subCat && subCat.products) {
        subCat.products = subCat.products.filter(pid => pid !== id);
    }
    
    data.products = data.products.filter(p => p.id !== id);
    
    saveData();
    showNotification('Xóa sản phẩm thành công!');
}

// Main Category functions
function showAddMainCategoryModal() {
    const titleEl = document.getElementById('mainCategoryModalTitle');
    if (titleEl) titleEl.textContent = 'Thêm danh mục chính';
    const form = document.getElementById('mainCategoryForm');
    if (form) form.reset();
    const idEl = document.getElementById('mainCategoryId');
    if (idEl) idEl.value = '';
    const modal = document.getElementById('mainCategoryModal');
    if (modal) modal.style.display = 'block';
}

function editMainCategory(id) {
    const category = data.mainCategories.find(c => c.id === id);
    if (!category) return;
    
    const titleEl = document.getElementById('mainCategoryModalTitle');
    if (titleEl) titleEl.textContent = 'Sửa danh mục chính';
    const idEl = document.getElementById('mainCategoryId');
    if (idEl) idEl.value = category.id;
    const nameEl = document.getElementById('mainCategoryName');
    if (nameEl) nameEl.value = category.name;
    const imgEl = document.getElementById('mainCategoryImage');
    if (imgEl) imgEl.value = category.image;
    const modal = document.getElementById('mainCategoryModal');
    if (modal) modal.style.display = 'block';
}

function saveMainCategory(event) {
    event.preventDefault();
    
    const id = document.getElementById('mainCategoryId')?.value;
    const categoryData = {
        name: document.getElementById('mainCategoryName')?.value,
        image: document.getElementById('mainCategoryImage')?.value
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
    showNotification('Xóa danh mục chính thành công!');
}

// SubCategory functions
function showAddSubCategoryModal() {
    const titleEl = document.getElementById('subCategoryModalTitle');
    if (titleEl) titleEl.textContent = 'Thêm danh mục phụ';
    const form = document.getElementById('subCategoryForm');
    if (form) form.reset();
    const idEl = document.getElementById('subCategoryId');
    if (idEl) idEl.value = '';
    
    const select = document.getElementById('subCategoryMain');
    if (select) {
        select.innerHTML = data.mainCategories.map(cat => 
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');
    }
    
    const modal = document.getElementById('subCategoryModal');
    if (modal) modal.style.display = 'block';
}

function editSubCategory(id) {
    const subCat = data.subCategories.find(s => s.id === id);
    if (!subCat) return;
    
    const titleEl = document.getElementById('subCategoryModalTitle');
    if (titleEl) titleEl.textContent = 'Sửa danh mục phụ';
    const idEl = document.getElementById('subCategoryId');
    if (idEl) idEl.value = subCat.id;
    const nameEl = document.getElementById('subCategoryName');
    if (nameEl) nameEl.value = subCat.name;
    const imgEl = document.getElementById('subCategoryImage');
    if (imgEl) imgEl.value = subCat.image;
    
    const select = document.getElementById('subCategoryMain');
    if (select) {
        select.innerHTML = data.mainCategories.map(cat => 
            `<option value="${cat.id}" ${cat.id === subCat.mainCategoryId ? 'selected' : ''}>${cat.name}</option>`
        ).join('');
    }
    
    const modal = document.getElementById('subCategoryModal');
    if (modal) modal.style.display = 'block';
}

function saveSubCategory(event) {
    event.preventDefault();
    
    const id = document.getElementById('subCategoryId')?.value;
    const mainCatId = parseInt(document.getElementById('subCategoryMain')?.value);
    const subCatData = {
        name: document.getElementById('subCategoryName')?.value,
        image: document.getElementById('subCategoryImage')?.value,
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
                    if (!newMainCat.subCategories) newMainCat.subCategories = [];
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
            if (!mainCat.subCategories) mainCat.subCategories = [];
            mainCat.subCategories.push(newId);
        }
        
        showNotification('Thêm danh mục phụ thành công!');
    }
    
    saveData();
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
    if (selectedSubCategoryId === id) {
        hideProductDetail();
    }
    showNotification('Xóa danh mục phụ thành công!');
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', function() {
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