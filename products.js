/**
 * Модуль для работы с товарами Plati Market PWA
 */

class ProductService {
    constructor() {
        this.products = {
            popular: [],
            new: [],
            search: [],
            favorites: []
        };
        this.purchases = [];
        this.currentProduct = null;
    }
    
    /**
     * Загрузка популярных товаров
     */
    loadPopularProducts() {
        // В реальном приложении здесь будет запрос к API Plati
        // Для демонстрации используем моковые данные
        this.simulateApiRequest(() => {
            this.products.popular = this.getMockProducts(8);
            this.renderProducts('popular-products', this.products.popular);
        });
    }
    
    /**
     * Загрузка новых товаров
     */
    loadNewProducts() {
        // В реальном приложении здесь будет запрос к API Plati
        // Для демонстрации используем моковые данные
        this.simulateApiRequest(() => {
            this.products.new = this.getMockProducts(8, true);
            this.renderProducts('new-products', this.products.new);
        });
    }
    
    /**
     * Поиск товаров
     */
    searchProducts(query) {
        if (!query) return Promise.reject('Поисковый запрос не указан');
        
        return new Promise((resolve, reject) => {
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации используем моковые данные
            this.simulateApiRequest(() => {
                // Имитация результатов поиска
                this.products.search = this.getMockProducts(12).map(product => {
                    // Добавляем поисковый запрос в название для демонстрации
                    return {
                        ...product,
                        title: `${query} - ${product.title}`
                    };
                });
                
                this.renderProducts('search-results', this.products.search);
                resolve(this.products.search);
            });
        });
    }
    
    /**
     * Загрузка избранных товаров
     */
    loadFavorites() {
        // В реальном приложении здесь будет запрос к API Plati
        // Для демонстрации используем моковые данные
        this.simulateApiRequest(() => {
            // Имитация избранных товаров (случайная выборка из популярных)
            this.products.favorites = this.getMockProducts(4);
            this.renderProducts('favorites-products', this.products.favorites);
        });
    }
    
    /**
     * Загрузка истории покупок
     */
    loadPurchases() {
        // В реальном приложении здесь будет запрос к API Plati
        // Для демонстрации используем моковые данные
        this.simulateApiRequest(() => {
            this.purchases = this.getMockPurchases(5);
            this.renderPurchases();
        });
    }
    
    /**
     * Загрузка детальной информации о товаре
     */
    loadProductDetails(productId) {
        return new Promise((resolve, reject) => {
            if (!productId) {
                reject('ID товара не указан');
                return;
            }
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации используем моковые данные
            this.simulateApiRequest(() => {
                // Поиск товара в существующих данных
                let product = null;
                
                for (const category in this.products) {
                    const found = this.products[category].find(p => p.id === productId);
                    if (found) {
                        product = found;
                        break;
                    }
                }
                
                // Если товар не найден, создаем моковый
                if (!product) {
                    product = this.createMockProduct(productId);
                }
                
                // Добавляем дополнительные данные для детальной страницы
                product.description = `Подробное описание товара ${product.title}. Здесь может быть длинный текст с описанием характеристик, особенностей и условий использования товара.`;
                product.rating = (Math.random() * 2 + 3).toFixed(1); // Рейтинг от 3 до 5
                product.ratingCount = Math.floor(Math.random() * 100) + 5; // Количество оценок
                product.seller = {
                    id: 's' + Math.floor(Math.random() * 10000),
                    name: 'Продавец ' + Math.floor(Math.random() * 100)
                };
                
                this.currentProduct = product;
                this.renderProductDetails();
                resolve(product);
            });
        });
    }
    
    /**
     * Добавление/удаление товара из избранного
     */
    toggleFavorite(productId) {
        if (!productId) return;
        
        // Проверяем, есть ли товар в избранном
        const index = this.products.favorites.findIndex(p => p.id === productId);
        
        if (index !== -1) {
            // Удаляем из избранного
            this.products.favorites.splice(index, 1);
            window.appService.showNotification('Товар удален из избранного');
        } else {
            // Ищем товар в других категориях
            let product = null;
            
            for (const category in this.products) {
                if (category === 'favorites') continue;
                
                const found = this.products[category].find(p => p.id === productId);
                if (found) {
                    product = found;
                    break;
                }
            }
            
            if (product) {
                // Добавляем в избранное
                this.products.favorites.push(product);
                window.appService.showNotification('Товар добавлен в избранное');
            }
        }
        
        // Обновляем иконку избранного на странице товара
        this.updateFavoriteIcon();
    }
    
    /**
     * Покупка товара
     */
    buyProduct(productId) {
        if (!productId) return;
        
        // В реальном приложении здесь будет запрос к API Plati
        // Для демонстрации показываем уведомление
        window.appService.showNotification('Функция покупки будет доступна в следующей версии');
    }
    
    /**
     * Отрисовка списка товаров
     */
    renderProducts(containerId, products) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        if (!products || products.length === 0) {
            container.innerHTML = '<div class="empty-state">Товары не найдены</div>';
            return;
        }
        
        // Добавляем карточки товаров
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-id', product.id);
            
            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <div class="product-title">${product.title}</div>
                    <div class="product-price">${product.price} руб.</div>
                </div>
            `;
            
            // Добавляем обработчик клика
            card.addEventListener('click', () => {
                window.appService.openProductPage(product.id);
            });
            
            container.appendChild(card);
        });
    }
    
    /**
     * Отрисовка истории покупок
     */
    renderPurchases() {
        const container = document.getElementById('purchases-list');
        if (!container) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        if (!this.purchases || this.purchases.length === 0) {
            container.innerHTML = '<div class="empty-state">У вас пока нет покупок</div>';
            return;
        }
        
        // Добавляем элементы покупок
        this.purchases.forEach(purchase => {
            const item = document.createElement('div');
            item.className = 'purchase-item';
            
            item.innerHTML = `
                <div class="purchase-header">
                    <div class="purchase-id">Заказ #${purchase.id}</div>
                    <div class="purchase-date">${purchase.date}</div>
                </div>
                <div class="purchase-content">
                    <img src="${purchase.product.image}" alt="${purchase.product.title}" class="purchase-image">
                    <div class="purchase-details">
                        <div class="purchase-title">${purchase.product.title}</div>
                        <div class="purchase-price">${purchase.product.price} руб.</div>
                        <div class="purchase-status ${purchase.status === 'completed' ? 'completed' : ''}">${purchase.statusText}</div>
                        <div class="purchase-actions">
                            <button class="btn btn-secondary" data-seller-id="${purchase.sellerId}" data-seller-name="${purchase.sellerName}">Чат с продавцом</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Добавляем обработчик для кнопки чата
            const chatBtn = item.querySelector('.purchase-actions button');
            if (chatBtn) {
                chatBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const sellerId = chatBtn.getAttribute('data-seller-id');
                    const sellerName = chatBtn.getAttribute('data-seller-name');
                    window.appService.openChat(sellerId, sellerName);
                });
            }
            
            container.appendChild(item);
        });
    }
    
    /**
     * Отрисовка детальной информации о товаре
     */
    renderProductDetails() {
        if (!this.currentProduct) return;
        
        const product = this.currentProduct;
        
        // Заполняем данные товара
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-price').textContent = product.price;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-rating-count').textContent = `(${product.ratingCount})`;
        document.getElementById('product-seller-name').textContent = product.seller.name;
        
        // Формируем звезды рейтинга
        const ratingStars = document.querySelector('.rating-stars');
        if (ratingStars) {
            const rating = parseFloat(product.rating);
            let starsHtml = '';
            
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    starsHtml += '★'; // Полная звезда
                } else if (i - 0.5 <= rating) {
                    starsHtml += '★½'; // Половина звезды
                } else {
                    starsHtml += '☆'; // Пустая звезда
                }
            }
            
            ratingStars.textContent = starsHtml;
        }
        
        // Обновляем иконку избранного
        this.updateFavoriteIcon();
        
        // Добавляем обработчики для кнопок
        const buyNowBtn = document.getElementById('buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                this.buyProduct(product.id);
            });
        }
        
        const chatWithSellerBtn = document.getElementById('chat-with-seller-btn');
        if (chatWithSellerBtn) {
            chatWithSellerBtn.addEventListener('click', () => {
                window.appService.openChat(product.seller.id, product.seller.name);
            });
        }
        
        const favoriteBtn = document.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                this.toggleFavorite(product.id);
            });
        }
    }
    
    /**
     * Обновление иконки избранного на странице товара
     */
    updateFavoriteIcon() {
        if (!this.currentProduct) return;
        
        const favoriteIcon = document.querySelector('.favorite-icon');
        if (!favoriteIcon) return;
        
        // Проверяем, есть ли товар в избранном
        const isFavorite = this.products.favorites.some(p => p.id === this.currentProduct.id);
        
        if (isFavorite) {
            favoriteIcon.classList.add('active');
        } else {
            favoriteIcon.classList.remove('active');
        }
    }
    
    /**
     * Имитация запроса к API с задержкой
     */
    simulateApiRequest(callback) {
        // Имитация задержки сетевого запроса
        setTimeout(() => {
            callback();
        }, 500);
    }
    
    /**
     * Создание моковых данных товаров
     */
    getMockProducts(count = 10, isNew = false) {
        const products = [];
        const categories = ['Игры', 'Карты', 'ПО для ПК', 'iTunes & App Store', 'Игровые аккаунты'];
        const gameNames = ['Cyberpunk 2077', 'HELLDIVERS 2', 'Doom Eternal', 'RoadCraft', 'World of Warcraft', 'Ведьмак 3', 'Assassin\'s Creed', 'The Elder Scrolls', 'Minecraft', 'Fortnite'];
        
        for (let i = 0; i < count; i++) {
            const id = 'p' + Math.floor(Math.random() * 10000);
            const category = categories[Math.floor(Math.random() * categories.length)];
            const title = isNew 
                ? `[NEW] ${gameNames[Math.floor(Math.random() * gameNames.length)]}`
                : `${category} - ${gameNames[Math.floor(Math.random() * gameNames.length)]}`;
            const price = Math.floor(Math.random() * 2000) + 100;
            
            // Генерируем URL изображения с использованием placeholder
            const imageId = Math.floor(Math.random() * 100) + 100;
            const image = `https://picsum.photos/id/${imageId}/300/200`;
            
            products.push({
                id,
                title,
                price,
                image,
                category
            });
        }
        
        return products;
    }
    
    /**
     * Создание мокового товара по ID
     */
    createMockProduct(id) {
        const categories = ['Игры', 'Карты', 'ПО для ПК', 'iTunes & App Store', 'Игровые аккаунты'];
        const gameNames = ['Cyberpunk 2077', 'HELLDIVERS 2', 'Doom Eternal', 'RoadCraft', 'World of Warcraft', 'Ведьмак 3', 'Assassin\'s Creed', 'The Elder Scrolls', 'Minecraft', 'Fortnite'];
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        const title = `${category} - ${gameNames[Math.floor(Math.random() * gameNames.length)]}`;
        const price = Math.floor(Math.random() * 2000) + 100;
        
        // Генерируем URL изображения с использованием placeholder
        const imageId = Math.floor(Math.random() * 100) + 100;
        const image = `https://picsum.photos/id/${imageId}/300/200`;
        
        return {
            id,
            title,
            price,
            image,
            category
        };
    }
    
    /**
     * Создание моковых данных покупок
     */
    getMockPurchases(count = 5) {
        const purchases = [];
        const statuses = [
            { code: 'completed', text: 'Завершено' },
            { code: 'processing', text: 'В обработке' },
            { code: 'delivered', text: 'Доставлено' }
        ];
        
        // Генерируем случайные даты за последние 30 дней
        const getRandomDate = () => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            return date.toLocaleDateString('ru-RU');
        };
        
        for (let i = 0; i < count; i++) {
            const id = Math.floor(Math.random() * 10000);
            const product = this.createMockProduct('purchase' + id);
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const date = getRandomDate();
            const sellerId = 's' + Math.floor(Math.random() * 10000);
            const sellerName = 'Продавец ' + Math.floor(Math.random() * 100);
            
            purchases.push({
                id,
                product,
                status: status.code,
                statusText: status.text,
                date,
                sellerId,
                sellerName
            });
        }
        
        return purchases;
    }
}

// Создаем экземпляр сервиса товаров
window.productService = new ProductService();
