// Tham chiếu Firebase
const shopDataRef = database.ref('shopData');
const settingsRef = database.ref('websiteSettings');
const redirectCodesRef = database.ref('redirectCodes');

// Dữ liệu toàn cục
let data = {};
let settings = JSON.parse(localStorage.getItem('adminSettings')) || {
    confirmDelete: true,
    showNotifications: true
};
let websiteSettings = {};
let redirectCodes = [];

// Biến trạng thái
let selectedMainCategoryId = null;
let selectedSubCategoryId = null;

// Biến lưu đối tượng Sortable cho danh mục chính và phụ
let mainCategorySortable = null;
let subCategorySortable = null;

// Hàm chuẩn hóa dữ liệu
function normalizeData() {
    data.products = data.products || [];
    data.products = data.products.map(p => {
        if (!p.prices && p.price) {
            p.prices = [{ price: p.price, duration: 'Giá' }];
        } else if (!p.prices) {
            p.prices = [];
        }
        return p;
    });
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
    const val = snapshot.val();
    if (val) {
        data = val;
        normalizeData();
    } else {
        data = { mainCategories: [], subCategories: [], products: [] };
        shopDataRef.set(data);
    }
    renderAdminTables();
});

// Lắng nghe cài đặt website
settingsRef.on('value', (snapshot) => {
    const val = snapshot.val();
    if (val) {
        websiteSettings = val;
    } else {
        // Giá trị mặc định (đã thêm chatZalo, chatTelegram)
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
    renderSettingsForm();
});

// Lắng nghe mã chuyển hướng
redirectCodesRef.on('value', (snapshot) => {
    const val = snapshot.val();
    if (val) {
        redirectCodes = val;
    } else {
        redirectCodes = [];
        redirectCodesRef.set([]);
    }
    renderRedirectsTable();
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
    document.getElementById('totalProducts') && (document.getElementById('totalProducts').textContent = data.products.length);
    document.getElementById('totalMainCategories') && (document.getElementById('totalMainCategories').textContent = data.mainCategories.length);
    document.getElementById('totalSubCategories') && (document.getElementById('totalSubCategories').textContent = data.subCategories.length);
    document.getElementById('totalOnline') && (document.getElementById('totalOnline').textContent = data.products.filter(p => p.status === 'online').length);

    const recentProducts = data.products.slice(-5).reverse();
    const tbody = document.querySelector('#recentProducts tbody');
    if (tbody) {
        tbody.innerHTML = recentProducts.map(product => {
            const subCat = data.subCategories.find(s => s.id === product.subCategoryId);
            let displayPrice = '';
            if (product.prices && product.prices.length > 0) {
                const minPrice = Math.min(...product.prices.map(p => p.price));
                displayPrice = formatPrice(minPrice);
            } else {
                displayPrice = 'Liên hệ';
            }
            return `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.code}</td>
                    <td>${product.name}</td>
                    <td>${displayPrice}</td>
                    <td><span class="status-badge status-${product.status}">${product.status === 'online' ? 'Online' : 'Bảo trì'}</span></td>
                    <td>${subCat ? subCat.name : 'N/A'}</td>
                </tr>
            `;
        }).join('');
    }
}

// ==================== RENDER CÁC BẢNG ====================
function renderSubCategoryGrid() {
    const grid = document.getElementById('subCategoryGrid');
    if (!grid) return;
    grid.innerHTML = data.subCategories.map(sub => {
        const mainCat = data.mainCategories.find(m => m.id === sub.mainCategoryId);
        const productCount = sub.products.length;
        const isActive = selectedSubCategoryId === sub.id;
        return `
            <div class="subcategory-card ${isActive ? 'active' : ''}" data-id="${sub.id}" onclick="selectSubCategory(${sub.id})">
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

    // Khởi tạo kéo thả cho danh mục phụ
    initSubCategoryDragDrop();
}

function selectSubCategory(subCatId) {
    selectedSubCategoryId = subCatId;
    renderSubCategoryGrid();
    const subCat = data.subCategories.find(s => s.id === subCatId);
    if (!subCat) return;
    document.getElementById('selectedSubCategoryTitle') && (document.getElementById('selectedSubCategoryTitle').textContent = `Sản phẩm danh mục: ${subCat.name}`);
    document.getElementById('productDetailArea') && (document.getElementById('productDetailArea').style.display = 'block');
    renderProductsTable(subCatId);
    setTimeout(() => {
        document.getElementById('productDetailArea') && document.getElementById('productDetailArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function hideProductDetail() {
    selectedSubCategoryId = null;
    document.getElementById('productDetailArea') && (document.getElementById('productDetailArea').style.display = 'none');
    renderSubCategoryGrid();
}

function renderProductsTable(subCatId = null) {
    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) return;
    let products = [];
    if (subCatId) {
        products = data.products.filter(p => p.subCategoryId === subCatId);
    } else if (selectedSubCategoryId) {
        products = data.products.filter(p => p.subCategoryId === selectedSubCategoryId);
    }
    tbody.innerHTML = products.map(product => {
        let displayPrice = '';
        if (product.prices && product.prices.length > 0) {
            const minPrice = Math.min(...product.prices.map(p => p.price));
            displayPrice = formatPrice(minPrice);
            if (product.prices.length > 1) displayPrice = 'Từ ' + displayPrice;
        } else {
            displayPrice = 'Liên hệ';
        }
        return `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/50x50/cccccc/000000?text=No+Image'}" alt="${product.name}" onerror="if(!this.src.includes('data:image')) this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'50\' height=\'50\' viewBox=\'0 0 50 50\'%3E%3Crect width=\'50\' height=\'50\' fill=\'%23cccccc\'/%3E%3Ctext x=\'5\' y=\'30\' font-size=\'12\' fill=\'%23000\'%3ENo img%3C/text%3E%3C/svg%3E';"></td>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${displayPrice}</td>
                <td><span class="status-badge status-${product.status}">${product.status === 'online' ? 'Online' : 'Bảo trì'}</span></td>
                <td>
                    <button class="btn-edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

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

// Hàm khởi tạo kéo thả cho danh mục chính
function initMainCategoryDragDrop() {
    const grid = document.getElementById('mainCategoryGrid');
    if (!grid) return;

    // Hủy sortable cũ nếu tồn tại
    if (mainCategorySortable) {
        mainCategorySortable.destroy();
    }

    // Khởi tạo Sortable mới
    mainCategorySortable = new Sortable(grid, {
        animation: 150,
        handle: '.main-category-card', // chỉ kéo được khi click vào card
        draggable: '.main-category-card',
        onEnd: function(evt) {
            // Lấy thứ tự ID từ các phần tử trong DOM sau khi kéo
            const newIds = Array.from(grid.children).map(card => parseInt(card.dataset.id));

            // Sắp xếp lại mảng data.mainCategories theo thứ tự mới
            const orderedCategories = newIds.map(id => data.mainCategories.find(cat => cat.id === id));
            data.mainCategories = orderedCategories;

            // Lưu lên Firebase
            saveData();
        }
    });
}

// Hàm khởi tạo kéo thả cho danh mục phụ
function initSubCategoryDragDrop() {
    const grid = document.getElementById('subCategoryGrid');
    if (!grid) return;

    // Hủy sortable cũ nếu tồn tại
    if (subCategorySortable) {
        subCategorySortable.destroy();
    }

    // Khởi tạo Sortable mới
    subCategorySortable = new Sortable(grid, {
        animation: 150,
        draggable: '.subcategory-card',
        onEnd: function(evt) {
            // Lấy thứ tự ID từ các phần tử trong DOM sau khi kéo
            const newIds = Array.from(grid.children).map(card => parseInt(card.dataset.id));

            // Sắp xếp lại mảng data.subCategories theo thứ tự mới
            const orderedSubs = newIds.map(id => data.subCategories.find(sub => sub.id === id));
            data.subCategories = orderedSubs;

            // Lưu lên Firebase
            saveData();
        }
    });
}

// Hàm renderMainCategoryGrid đã thêm data-id và gọi initMainCategoryDragDrop
function renderMainCategoryGrid() {
    const grid = document.getElementById('mainCategoryGrid');
    if (!grid) return;
    grid.innerHTML = data.mainCategories.map(cat => {
        const subCount = data.subCategories.filter(s => s.mainCategoryId === cat.id).length;
        const totalProducts = data.subCategories.filter(s => s.mainCategoryId === cat.id).reduce((total, sub) => total + sub.products.length, 0);
        const isActive = selectedMainCategoryId === cat.id;
        return `
            <div class="main-category-card ${isActive ? 'active' : ''}" data-id="${cat.id}" onclick="selectMainCategory(${cat.id})">
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

    // Sau khi render, khởi tạo kéo thả
    initMainCategoryDragDrop();
}

function selectMainCategory(mainCatId) {
    selectedMainCategoryId = mainCatId;
    renderMainCategoryGrid();
    const mainCat = data.mainCategories.find(c => c.id === mainCatId);
    if (!mainCat) return;
    document.getElementById('selectedMainCategoryTitle') && (document.getElementById('selectedMainCategoryTitle').textContent = `Danh mục phụ của: ${mainCat.name}`);
    document.getElementById('subCategoryDetailArea') && (document.getElementById('subCategoryDetailArea').style.display = 'block');
    renderSubCategoriesTable(mainCatId);
    setTimeout(() => {
        document.getElementById('subCategoryDetailArea') && document.getElementById('subCategoryDetailArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function hideSubCategoryDetail() {
    selectedMainCategoryId = null;
    document.getElementById('subCategoryDetailArea') && (document.getElementById('subCategoryDetailArea').style.display = 'none');
    renderMainCategoryGrid();
}

function renderSubCategoriesTable(mainCatId = null) {
    const tbody = document.querySelector('#subCategoriesTable tbody');
    if (!tbody) return;
    let subCats = [];
    if (mainCatId) {
        subCats = data.subCategories.filter(s => s.mainCategoryId === mainCatId);
    } else if (selectedMainCategoryId) {
        subCats = data.subCategories.filter(s => s.mainCategoryId === selectedMainCategoryId);
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

// ==================== CÀI ĐẶT ====================
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
    // Link hỗ trợ cũ
    set('settingSupportZalo', websiteSettings.supportZalo);
    set('settingSupportTelegram', websiteSettings.supportTelegram);
    // THÊM MỚI: Link riêng cho bong bóng chat
    set('settingChatZalo', websiteSettings.chatZalo);
    set('settingChatTelegram', websiteSettings.chatTelegram);

    // Các checkbox
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
        supportZalo: document.getElementById('settingSupportZalo')?.value || '',
        supportTelegram: document.getElementById('settingSupportTelegram')?.value || '',
        // THÊM MỚI
        chatZalo: document.getElementById('settingChatZalo')?.value || '',
        chatTelegram: document.getElementById('settingChatTelegram')?.value || '',

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

// ==================== MÃ CHUYỂN HƯỚNG ====================
function renderRedirectsTable() {
    const tbody = document.querySelector('#redirectsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = redirectCodes.map(rc => `
        <tr>
            <td>${rc.id}</td>
            <td><strong>${rc.code}</strong></td>
            <td><a href="${rc.url}" target="_blank">${rc.url}</a></td>
            <td>${rc.currentUses || 0} / ${rc.maxUses === 0 ? '∞' : rc.maxUses}</td>
            <td>${rc.description || ''}</td>
            <td>
                <button class="btn-edit" onclick="editRedirect(${rc.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" onclick="deleteRedirect(${rc.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function showAddRedirectModal() {
    document.getElementById('redirectModalTitle').textContent = 'Thêm mã chuyển hướng';
    document.getElementById('redirectForm').reset();
    document.getElementById('redirectId').value = '';
    document.getElementById('redirectModal').style.display = 'block';
}

function editRedirect(id) {
    const rc = redirectCodes.find(r => r.id === id);
    if (!rc) return;
    document.getElementById('redirectModalTitle').textContent = 'Sửa mã chuyển hướng';
    document.getElementById('redirectId').value = rc.id;
    document.getElementById('redirectCode').value = rc.code;
    document.getElementById('redirectUrl').value = rc.url;
    document.getElementById('redirectMaxUses').value = rc.maxUses;
    document.getElementById('redirectDescription').value = rc.description || '';
    document.getElementById('redirectModal').style.display = 'block';
}

function saveRedirect(event) {
    event.preventDefault();
    const id = document.getElementById('redirectId').value;
    const code = document.getElementById('redirectCode').value.trim();
    const url = document.getElementById('redirectUrl').value.trim();
    const maxUses = parseInt(document.getElementById('redirectMaxUses').value) || 0;
    const description = document.getElementById('redirectDescription').value.trim();
    if (!code || !url) return;
    if (id) {
        const index = redirectCodes.findIndex(r => r.id === parseInt(id));
        if (index !== -1) {
            redirectCodes[index] = { ...redirectCodes[index], code, url, maxUses, description };
        }
    } else {
        const newId = Math.max(...redirectCodes.map(r => r.id), 0) + 1;
        redirectCodes.push({ id: newId, code, url, maxUses, currentUses: 0, description });
    }
    redirectCodesRef.set(redirectCodes);
    closeModal('redirectModal');
    showNotification('Đã lưu mã thành công!');
}

function deleteRedirect(id) {
    if (!confirm('Xóa mã này?')) return;
    redirectCodes = redirectCodes.filter(r => r.id !== id);
    redirectCodesRef.set(redirectCodes);
    showNotification('Đã xóa mã!');
}

// ==================== RENDER TẤT CẢ ====================
function renderAdminTables() {
    renderSubCategoryGrid();
    renderMainCategoriesTable();
    renderMainCategoryGrid();
    if (selectedMainCategoryId) renderSubCategoriesTable(selectedMainCategoryId);
    if (selectedSubCategoryId) renderProductsTable(selectedSubCategoryId);
    updateDashboardStats();
    renderSettingsForm();
    renderRedirectsTable();
}

// ==================== TAB SWITCHING ====================
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
        if (tabId === 'settings') renderSettingsForm();
        if (tabId === 'redirects') renderRedirectsTable();
    });
});

// ==================== MODAL FUNCTIONS ====================
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// ==================== HÀM XỬ LÝ DÒNG GIÁ ====================
function addPricingRow(duration = '', price = '') {
    const container = document.getElementById('pricingContainer');
    if (!container) return;
    const rowDiv = document.createElement('div');
    rowDiv.className = 'image-input-group';
    rowDiv.innerHTML = `
        <input type="number" class="pricing-price" placeholder="Giá" value="${price}" min="0" required style="width: 120px;">
        <input type="text" class="pricing-duration" placeholder="Mô tả (vd: Ngày)" value="${duration}" required style="flex: 1;">
        <button type="button" class="btn-remove-image" onclick="removePricingRow(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(rowDiv);
}
function removePricingRow(button) {
    const container = document.getElementById('pricingContainer');
    if (!container) return;
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        showNotification('Phải có ít nhất một mức giá', 'warning');
    }
}

// ==================== PRODUCT FUNCTIONS ====================
function showAddProductModal() {
    document.getElementById('productModalTitle').textContent = 'Thêm sản phẩm';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    const select = document.getElementById('productSubCategory');
    if (select) {
        select.innerHTML = data.subCategories.map(sub => `<option value="${sub.id}">${sub.name}</option>`).join('');
    }
    const pricingContainer = document.getElementById('pricingContainer');
    if (pricingContainer) {
        pricingContainer.innerHTML = '';
        addPricingRow();
    }
    const container = document.getElementById('productImagesContainer');
    if (container) {
        container.innerHTML = '<div class="image-input-group"><input type="url" class="product-image-input" placeholder="URL ảnh 1" required></div>';
    }
    document.getElementById('productModal').style.display = 'block';
}

function editProduct(id) {
    const product = data.products.find(p => p.id === id);
    if (!product) return;
    document.getElementById('productModalTitle').textContent = 'Sửa sản phẩm';
    document.getElementById('productId').value = product.id;
    document.getElementById('productCode').value = product.code;
    document.getElementById('productName').value = product.name;
    document.getElementById('productStatus').value = product.status;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productZalo').value = product.zalo || '';
    document.getElementById('productTelegram').value = product.telegram || '';
    const select = document.getElementById('productSubCategory');
    if (select) {
        select.innerHTML = data.subCategories.map(sub => `<option value="${sub.id}" ${sub.id === product.subCategoryId ? 'selected' : ''}>${sub.name}</option>`).join('');
    }
    const pricingContainer = document.getElementById('pricingContainer');
    if (pricingContainer) {
        pricingContainer.innerHTML = '';
        const prices = product.prices && product.prices.length > 0 ? product.prices : [{ price: product.price || 0, duration: 'Giá' }];
        prices.forEach(p => addPricingRow(p.duration, p.price));
    }
    const imagesContainer = document.getElementById('productImagesContainer');
    if (imagesContainer) {
        imagesContainer.innerHTML = '';
        if (product.images && product.images.length > 0) {
            product.images.forEach((img, index) => {
                const div = document.createElement('div');
                div.className = 'image-input-group';
                div.innerHTML = `<input type="url" class="product-image-input" value="${img}" placeholder="URL ảnh ${index + 1}" required><button type="button" class="btn-remove-image" onclick="removeImageInput(this)"><i class="fas fa-times"></i></button>`;
                imagesContainer.appendChild(div);
            });
        } else {
            imagesContainer.innerHTML = '<div class="image-input-group"><input type="url" class="product-image-input" placeholder="URL ảnh 1" required></div>';
        }
    }
    document.getElementById('productModal').style.display = 'block';
}

function addImageInput() {
    const container = document.getElementById('productImagesContainer');
    if (!container) return;
    const index = container.children.length + 1;
    const div = document.createElement('div');
    div.className = 'image-input-group';
    div.innerHTML = `<input type="url" class="product-image-input" placeholder="URL ảnh ${index}" required><button type="button" class="btn-remove-image" onclick="removeImageInput(this)"><i class="fas fa-times"></i></button>`;
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
    const priceRows = document.querySelectorAll('#pricingContainer .image-input-group');
    const prices = [];
    for (let row of priceRows) {
        const priceInput = row.querySelector('.pricing-price');
        const durationInput = row.querySelector('.pricing-duration');
        if (priceInput && durationInput && priceInput.value && durationInput.value) {
            prices.push({ price: parseInt(priceInput.value), duration: durationInput.value.trim() });
        }
    }
    if (prices.length === 0) {
        showNotification('Vui lòng nhập ít nhất một mức giá', 'error');
        return;
    }
    const imageInputs = document.querySelectorAll('.product-image-input');
    const images = Array.from(imageInputs).map(input => input.value.trim()).filter(url => url !== '');
    if (images.length === 0) {
        showNotification('Vui lòng nhập ít nhất 1 URL ảnh', 'error');
        return;
    }
    const productData = {
        code: document.getElementById('productCode')?.value,
        name: document.getElementById('productName')?.value,
        prices: prices,
        images: images,
        subCategoryId: parseInt(document.getElementById('productSubCategory')?.value),
        status: document.getElementById('productStatus')?.value,
        description: document.getElementById('productDescription')?.value,
        zalo: document.getElementById('productZalo')?.value,
        telegram: document.getElementById('productTelegram')?.value
    };
    if (id) {
        const index = data.products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            const oldProduct = data.products[index];
            data.products[index] = { ...oldProduct, ...productData };
            if (oldProduct.subCategoryId !== productData.subCategoryId) {
                const oldSubCat = data.subCategories.find(s => s.id === oldProduct.subCategoryId);
                if (oldSubCat) oldSubCat.products = oldSubCat.products.filter(pid => pid !== parseInt(id));
                const newSubCat = data.subCategories.find(s => s.id === productData.subCategoryId);
                if (newSubCat) {
                    if (!newSubCat.products) newSubCat.products = [];
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
            if (!subCat.products) subCat.products = [];
            subCat.products.push(newId);
        }
        showNotification('Thêm sản phẩm thành công!');
    }
    saveData();
    closeModal('productModal');
}

function deleteProduct(id) {
    if (settings.confirmDelete && !confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    const product = data.products.find(p => p.id === id);
    if (!product) return;
    const subCat = data.subCategories.find(s => s.id === product.subCategoryId);
    if (subCat && subCat.products) subCat.products = subCat.products.filter(pid => pid !== id);
    data.products = data.products.filter(p => p.id !== id);
    saveData();
    showNotification('Xóa sản phẩm thành công!');
}

// ==================== MAIN CATEGORY FUNCTIONS ====================
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
    if (settings.confirmDelete && !confirm('Bạn có chắc muốn xóa danh mục chính này? Các danh mục phụ và sản phẩm liên quan sẽ bị xóa!')) return;
    const subCats = data.subCategories.filter(s => s.mainCategoryId === id);
    subCats.forEach(sub => { data.products = data.products.filter(p => !sub.products.includes(p.id)); });
    data.subCategories = data.subCategories.filter(s => s.mainCategoryId !== id);
    data.mainCategories = data.mainCategories.filter(c => c.id !== id);
    if (selectedMainCategoryId === id) hideSubCategoryDetail();
    saveData();
    showNotification('Xóa danh mục chính thành công!');
}

// ==================== SUB CATEGORY FUNCTIONS ====================
function showAddSubCategoryModal() {
    document.getElementById('subCategoryModalTitle').textContent = 'Thêm danh mục phụ';
    document.getElementById('subCategoryForm').reset();
    document.getElementById('subCategoryId').value = '';
    const select = document.getElementById('subCategoryMain');
    if (select) {
        select.innerHTML = data.mainCategories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }
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
    if (select) {
        select.innerHTML = data.mainCategories.map(cat => `<option value="${cat.id}" ${cat.id === subCat.mainCategoryId ? 'selected' : ''}>${cat.name}</option>`).join('');
    }
    document.getElementById('subCategoryModal').style.display = 'block';
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
                if (oldMainCat) oldMainCat.subCategories = oldMainCat.subCategories.filter(sid => sid !== parseInt(id));
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
    if (settings.confirmDelete && !confirm('Bạn có chắc muốn xóa danh mục phụ này? Các sản phẩm liên quan sẽ bị xóa!')) return;
    const subCat = data.subCategories.find(s => s.id === id);
    if (!subCat) return;
    const mainCatId = subCat.mainCategoryId;
    data.products = data.products.filter(p => !subCat.products.includes(p.id));
    const mainCat = data.mainCategories.find(m => m.id === mainCatId);
    if (mainCat) mainCat.subCategories = mainCat.subCategories.filter(sid => sid !== id);
    data.subCategories = data.subCategories.filter(s => s.id !== id);
    saveData();
    if (selectedSubCategoryId === id) hideProductDetail();
    showNotification('Xóa danh mục phụ thành công!');
}

// ==================== KHỞI TẠO ====================
document.addEventListener('DOMContentLoaded', function() {
    window.onclick = function(event) {
        if (event.target.classList.contains('admin-modal')) {
            event.target.style.display = 'none';
        }
    };
    // Gán các hàm global
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
    window.addPricingRow = addPricingRow;
    window.removePricingRow = removePricingRow;
    window.showAddRedirectModal = showAddRedirectModal;
    window.editRedirect = editRedirect;
    window.deleteRedirect = deleteRedirect;
    window.saveRedirect = saveRedirect;
});