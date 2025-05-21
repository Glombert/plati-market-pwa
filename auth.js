/**
 * Модуль авторизации для Plati Market PWA
 */

class AuthService {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
        this.authToken = null;
        this.storageKey = 'plati_auth';
        
        // Инициализация обработчиков событий
        this.initEventListeners();
        
        // Проверка сохраненной авторизации
        this.checkSavedAuth();
    }
    
    /**
     * Инициализация обработчиков событий для форм авторизации
     */
    initEventListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
        
        const forgotPasswordLink = document.getElementById('forgot-password');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Функция восстановления пароля будет доступна в следующей версии');
            });
        }
    }
    
    /**
     * Проверка сохраненной авторизации
     */
    checkSavedAuth() {
        try {
            const savedAuth = localStorage.getItem(this.storageKey);
            if (savedAuth) {
                const authData = JSON.parse(savedAuth);
                if (authData && authData.token && authData.user) {
                    this.isAuthenticated = true;
                    this.user = authData.user;
                    this.authToken = authData.token;
                    
                    // Обновляем информацию о пользователе в интерфейсе
                    this.updateUserInfo();
                    
                    // Переходим на главный экран
                    setTimeout(() => {
                        this.navigateToMainScreen();
                    }, 1000);
                    return;
                }
            }
            
            // Если нет сохраненной авторизации, показываем экран входа
            setTimeout(() => {
                this.showAuthScreen();
            }, 1500);
        } catch (error) {
            console.error('Ошибка при проверке сохраненной авторизации:', error);
            this.showAuthScreen();
        }
    }
    
    /**
     * Авторизация пользователя
     */
    login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        if (!email || !password) {
            this.showNotification('Введите email и пароль');
            return;
        }
        
        // Имитация запроса к API
        this.simulateApiRequest(() => {
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации используем моковые данные
            const mockUser = {
                id: '12345',
                name: email.split('@')[0],
                email: email,
                avatar: null
            };
            
            const mockToken = 'mock_token_' + Date.now();
            
            this.isAuthenticated = true;
            this.user = mockUser;
            this.authToken = mockToken;
            
            // Сохраняем данные авторизации, если пользователь выбрал "Запомнить меня"
            if (remember) {
                this.saveAuthData();
            }
            
            // Обновляем информацию о пользователе в интерфейсе
            this.updateUserInfo();
            
            // Переходим на главный экран
            this.navigateToMainScreen();
        });
    }
    
    /**
     * Выход из аккаунта
     */
    logout() {
        this.isAuthenticated = false;
        this.user = null;
        this.authToken = null;
        
        // Удаляем сохраненные данные авторизации
        localStorage.removeItem(this.storageKey);
        
        // Показываем экран авторизации
        this.showAuthScreen();
    }
    
    /**
     * Сохранение данных авторизации в локальное хранилище
     */
    saveAuthData() {
        const authData = {
            token: this.authToken,
            user: this.user
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(authData));
    }
    
    /**
     * Обновление информации о пользователе в интерфейсе
     */
    updateUserInfo() {
        if (!this.user) return;
        
        const userNameElement = document.getElementById('user-name');
        const userEmailElement = document.getElementById('user-email');
        const userInitialElement = document.getElementById('user-initial');
        
        if (userNameElement) {
            userNameElement.textContent = this.user.name;
        }
        
        if (userEmailElement) {
            userEmailElement.textContent = this.user.email;
        }
        
        if (userInitialElement) {
            userInitialElement.textContent = this.user.name.charAt(0).toUpperCase();
        }
    }
    
    /**
     * Показать экран авторизации
     */
    showAuthScreen() {
        const splashScreen = document.getElementById('splash-screen');
        const authScreen = document.getElementById('auth-screen');
        const mainScreen = document.getElementById('main-screen');
        
        if (splashScreen) {
            splashScreen.classList.remove('active');
        }
        
        if (authScreen) {
            authScreen.classList.add('active');
        }
        
        if (mainScreen) {
            mainScreen.classList.remove('active');
        }
    }
    
    /**
     * Переход на главный экран
     */
    navigateToMainScreen() {
        const splashScreen = document.getElementById('splash-screen');
        const authScreen = document.getElementById('auth-screen');
        const mainScreen = document.getElementById('main-screen');
        
        if (splashScreen) {
            splashScreen.classList.remove('active');
        }
        
        if (authScreen) {
            authScreen.classList.remove('active');
        }
        
        if (mainScreen) {
            mainScreen.classList.add('active');
        }
        
        // Загружаем данные для главного экрана
        if (window.productService) {
            window.productService.loadPopularProducts();
            window.productService.loadNewProducts();
        }
    }
    
    /**
     * Имитация запроса к API с индикацией загрузки
     */
    simulateApiRequest(callback) {
        const loginForm = document.getElementById('login-form');
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Вход...';
        }
        
        // Имитация задержки сетевого запроса
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Войти';
            }
            
            callback();
        }, 1500);
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
     * Получить токен авторизации
     */
    getAuthToken() {
        return this.authToken;
    }
    
    /**
     * Проверка авторизации
     */
    isUserAuthenticated() {
        return this.isAuthenticated;
    }
    
    /**
     * Получить данные пользователя
     */
    getUserData() {
        return this.user;
    }
}

// Создаем экземпляр сервиса авторизации
window.authService = new AuthService();
