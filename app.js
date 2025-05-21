/**
 * Основной модуль приложения Plati Market PWA
 */

class AppService {
    constructor() {
        this.currentScreen = 'splash-screen';
        this.screens = [
            'splash-screen', 'auth-screen', 'main-screen', 'product-screen',
            'chat-list-screen', 'chat-screen', 'purchases-screen', 'favorites-screen',
            'search-screen'
        ];
        
        // Инициализация обработчиков событий
        this.initEventListeners();
    }
    
    /**
     * Инициализация обработчиков событий
     */
    initEventListeners() {
        // Обработчик для бокового меню
        const menuBtn = document.getElementById('menu-btn');
        const sideMenu = document.querySelector('.side-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        
        if (menuBtn && sideMenu && menuOverlay) {
            menuBtn.addEventListener('click', () => {
                sideMenu.classList.add('active');
                menuOverlay.classList.add('active');
            });
            
            menuOverlay.addEventListener('click', () => {
                sideMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
            });
        }
        
        // Обработчики для пунктов меню
        const menuItems = document.querySelectorAll('.menu-nav li[data-screen]');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const screenId = item.getAttribute('data-screen');
                this.navigateToScreen(screenId);
                
                // Закрываем боковое меню
                sideMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                
                // Обновляем активный пункт меню
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
            });
        });
        
        // Обработчики для нижней навигации
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const screenId = item.getAttribute('data-screen');
                this.navigateToScreen(screenId);
                
                // Обновляем активный пункт нижней навигации
                navItems.forEach(ni => ni.classList.remove('active'));
                item.classList.add('active');
            });
        });
        
        // Обработчики для кнопок "Назад"
        const backButtons = document.querySelectorAll('.back-btn');
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetScreen = btn.getAttribute('data-back');
                this.navigateToScreen(targetScreen);
            });
        });
        
        // Обработчик для поиска
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.handleSearch(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(searchInput.value);
                }
            });
        }
        
        // Обработчик для поиска на странице поиска
        const searchPageInput = document.getElementById('search-page-input');
        const searchPageBtn = document.getElementById('search-page-btn');
        
        if (searchPageInput && searchPageBtn) {
            searchPageBtn.addEventListener('click', () => {
                this.handleSearch(searchPageInput.value);
            });
            
            searchPageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(searchPageInput.value);
                }
            });
        }
    }
    
    /**
     * Переход на указанный экран
     */
    navigateToScreen(screenId) {
        if (!screenId || !this.screens.includes(screenId)) {
            console.error('Неверный ID экрана:', screenId);
            return;
        }
        
        // Скрываем текущий экран
        const currentScreenElement = document.getElementById(this.currentScreen);
        if (currentScreenElement) {
            currentScreenElement.classList.remove('active');
        }
        
        // Показываем новый экран
        const newScreenElement = document.getElementById(screenId);
        if (newScreenElement) {
            newScreenElement.classList.add('active');
            this.currentScreen = screenId;
        }
        
        // Дополнительные действия при переходе на определенные экраны
        if (screenId === 'main-screen' && window.productService) {
            window.productService.loadPopularProducts();
            window.productService.loadNewProducts();
        } else if (screenId === 'purchases-screen' && window.productService) {
            window.productService.loadPurchases();
        } else if (screenId === 'favorites-screen' && window.productService) {
            window.productService.loadFavorites();
        } else if (screenId === 'chat-list-screen' && window.chatService) {
            window.chatService.loadChatList();
        }
    }
    
    /**
     * Обработка поискового запроса
     */
    handleSearch(query) {
        if (!query || query.trim() === '') {
            this.showNotification('Введите поисковый запрос');
            return;
        }
        
        // Переходим на экран поиска
        this.navigateToScreen('search-screen');
        
        // Устанавливаем значение в поле поиска на странице поиска
        const searchPageInput = document.getElementById('search-page-input');
        if (searchPageInput) {
            searchPageInput.value = query;
        }
        
        // Выполняем поиск
        if (window.productService) {
            window.productService.searchProducts(query);
        }
    }
    
    /**
     * Показать уведомление
     */
    showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
        if (notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.classList.add('active');
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    }
    
    /**
     * Открыть страницу товара
     */
    openProductPage(productId) {
        if (!productId) {
            console.error('ID товара не указан');
            return;
        }
        
        // Загружаем данные товара
        if (window.productService) {
            window.productService.loadProductDetails(productId)
                .then(() => {
                    // Переходим на экран товара
                    this.navigateToScreen('product-screen');
                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных товара:', error);
                    this.showNotification('Не удалось загрузить информацию о товаре');
                });
        }
    }
    
    /**
     * Открыть чат с продавцом
     */
    openChat(sellerId, sellerName) {
        if (!sellerId) {
            console.error('ID продавца не указан');
            return;
        }
        
        // Устанавливаем имя продавца в заголовке чата
        const chatSellerNameElement = document.getElementById('chat-seller-name');
        if (chatSellerNameElement) {
            chatSellerNameElement.textContent = sellerName || 'Продавец';
        }
        
        // Загружаем историю чата
        if (window.chatService) {
            window.chatService.loadChatHistory(sellerId)
                .then(() => {
                    // Переходим на экран чата
                    this.navigateToScreen('chat-screen');
                })
                .catch(error => {
                    console.error('Ошибка при загрузке истории чата:', error);
                    this.showNotification('Не удалось загрузить историю чата');
                });
        } else {
            // Если сервис чата не инициализирован, просто переходим на экран
            this.navigateToScreen('chat-screen');
        }
    }
}

// Создаем экземпляр сервиса приложения
window.appService = new AppService();

// Инициализация приложения после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    // Здесь можно выполнить дополнительные действия при загрузке страницы
    console.log('Plati Market PWA инициализировано');
});
