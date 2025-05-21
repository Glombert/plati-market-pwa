/**
 * Модуль для интеграции с API Plati.market
 * Обеспечивает взаимодействие с сайтом через эмуляцию клиентских запросов
 */

class PlatiApiService {
    constructor() {
        this.baseUrl = 'https://plati.market';
        this.isLoggedIn = false;
        this.authToken = null;
        this.userData = null;
        
        // Проверяем авторизацию при инициализации
        this.checkAuth();
    }
    
    /**
     * Проверка статуса авторизации
     */
    checkAuth() {
        // Пытаемся получить данные авторизации из локального хранилища
        const authData = localStorage.getItem('plati_auth');
        
        if (authData) {
            try {
                const parsedData = JSON.parse(authData);
                this.authToken = parsedData.token;
                this.userData = parsedData.user;
                this.isLoggedIn = true;
                
                console.log('Пользователь авторизован:', this.userData.username);
                return true;
            } catch (error) {
                console.error('Ошибка при чтении данных авторизации:', error);
                this.clearAuth();
            }
        }
        
        return false;
    }
    
    /**
     * Авторизация пользователя
     */
    async login(username, password) {
        try {
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve, reject) => {
                // Имитация задержки сетевого запроса
                setTimeout(() => {
                    // Проверяем учетные данные (для демонстрации)
                    if (username && password) {
                        // Создаем демонстрационные данные пользователя
                        const userData = {
                            username: username,
                            displayName: 'Пользователь ' + username,
                            email: username + '@example.com',
                            avatar: null
                        };
                        
                        // Создаем демонстрационный токен
                        const token = 'demo_token_' + Date.now();
                        
                        // Сохраняем данные авторизации
                        this.authToken = token;
                        this.userData = userData;
                        this.isLoggedIn = true;
                        
                        // Сохраняем в локальное хранилище
                        localStorage.setItem('plati_auth', JSON.stringify({
                            token: token,
                            user: userData
                        }));
                        
                        resolve({
                            success: true,
                            user: userData
                        });
                    } else {
                        reject({
                            success: false,
                            error: 'Неверное имя пользователя или пароль'
                        });
                    }
                }, 1000);
            });
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            throw error;
        }
    }
    
    /**
     * Выход из системы
     */
    logout() {
        this.clearAuth();
        return Promise.resolve({ success: true });
    }
    
    /**
     * Очистка данных авторизации
     */
    clearAuth() {
        this.authToken = null;
        this.userData = null;
        this.isLoggedIn = false;
        localStorage.removeItem('plati_auth');
    }
    
    /**
     * Поиск товаров
     */
    async searchProducts(query, options = {}) {
        try {
            // Формируем URL для поиска
            const searchUrl = `${this.baseUrl}/search/${encodeURIComponent(query)}/`;
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve) => {
                // Имитация задержки сетевого запроса
                setTimeout(() => {
                    // Создаем демонстрационные результаты поиска
                    const results = this.generateMockSearchResults(query, options);
                    
                    resolve({
                        success: true,
                        query: query,
                        results: results,
                        total: results.length,
                        page: options.page || 1
                    });
                }, 1000);
            });
        } catch (error) {
            console.error('Ошибка при поиске товаров:', error);
            throw error;
        }
    }
    
    /**
     * Получение категорий товаров
     */
    async getCategories() {
        try {
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve) => {
                // Имитация задержки сетевого запроса
                setTimeout(() => {
                    // Создаем демонстрационные категории
                    const categories = [
                        { id: 'games', name: 'Игры', count: 1250 },
                        { id: 'software', name: 'Программы', count: 850 },
                        { id: 'accounts', name: 'Аккаунты', count: 720 },
                        { id: 'cards', name: 'Карты оплаты', count: 540 },
                        { id: 'services', name: 'Услуги', count: 320 },
                        { id: 'social', name: 'Соц. сети', count: 280 },
                        { id: 'books', name: 'Книги и обучение', count: 150 },
                        { id: 'other', name: 'Разное', count: 95 }
                    ];
                    
                    resolve({
                        success: true,
                        categories: categories
                    });
                }, 800);
            });
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
            throw error;
        }
    }
    
    /**
     * Получение детальной информации о товаре
     */
    async getProductDetails(productId) {
        try {
            // Формируем URL для товара
            const productUrl = `${this.baseUrl}/item/${productId}/`;
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve, reject) => {
                // Имитация задержки сетевого запроса
                setTimeout(() => {
                    if (!productId) {
                        reject({
                            success: false,
                            error: 'ID товара не указан'
                        });
                        return;
                    }
                    
                    // Создаем демонстрационные данные товара
                    const product = this.generateMockProductDetails(productId);
                    
                    resolve({
                        success: true,
                        product: product
                    });
                }, 1000);
            });
        } catch (error) {
            console.error('Ошибка при получении информации о товаре:', error);
            throw error;
        }
    }
    
    /**
     * Получение истории покупок
     */
    async getPurchaseHistory() {
        try {
            // Проверяем авторизацию
            if (!this.isLoggedIn) {
                throw new Error('Требуется авторизация');
            }
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve) => {
                // Имитация задержки сетевого запроса
                setTimeout(() => {
                    // Создаем демонстрационную историю покупок
                    const purchases = this.generateMockPurchases();
                    
                    resolve({
                        success: true,
                        purchases: purchases
                    });
                }, 1000);
            });
        } catch (error) {
            console.error('Ошибка при получении истории покупок:', error);
            throw error;
        }
    }
    
    /**
     * Получение списка избранных товаров
     */
    async getFavorites() {
        try {
            // Проверяем авторизацию
            if (!this.isLoggedIn) {
                throw new Error('Требуется авторизация');
            }
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve) => {
                // Имитация задержки сетевого запроса
                setTimeout(() => {
                    // Получаем сохраненные избранные из локального хранилища
                    let favorites = [];
                    const savedFavorites = localStorage.getItem('plati_favorites');
                    
                    if (savedFavorites) {
                        try {
                            favorites = JSON.parse(savedFavorites);
                        } catch (e) {
                            console.error('Ошибка при чтении избранных:', e);
                            favorites = [];
                        }
                    }
                    
                    // Если избранных нет, создаем демонстрационные
                    if (!favorites || favorites.length === 0) {
                        favorites = this.generateMockFavorites();
                    }
                    
                    resolve({
                        success: true,
                        favorites: favorites
                    });
                }, 800);
            });
        } catch (error) {
            console.error('Ошибка при получении избранных товаров:', error);
            throw error;
        }
    }
    
    /**
     * Добавление товара в избранное
     */
    async addToFavorites(productId) {
        try {
            // Проверяем авторизацию
            if (!this.isLoggedIn) {
                throw new Error('Требуется авторизация');
            }
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve) => {
                // Имитация задержки сетевого запроса
                setTimeout(async () => {
                    // Получаем информацию о товаре
                    const productResponse = await this.getProductDetails(productId);
                    const product = productResponse.product;
                    
                    // Получаем текущие избранные
                    let favorites = [];
                    const savedFavorites = localStorage.getItem('plati_favorites');
                    
                    if (savedFavorites) {
                        try {
                            favorites = JSON.parse(savedFavorites);
                        } catch (e) {
                            console.error('Ошибка при чтении избранных:', e);
                            favorites = [];
                        }
                    }
                    
                    // Проверяем, есть ли уже товар в избранном
                    const existingIndex = favorites.findIndex(f => f.id === productId);
                    
                    if (existingIndex === -1) {
                        // Добавляем товар в избранное
                        favorites.push(product);
                        
                        // Сохраняем обновленный список избранных
                        localStorage.setItem('plati_favorites', JSON.stringify(favorites));
                        
                        resolve({
                            success: true,
                            message: 'Товар добавлен в избранное'
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Товар уже в избранном'
                        });
                    }
                }, 500);
            });
        } catch (error) {
            console.error('Ошибка при добавлении в избранное:', error);
            throw error;
        }
    }
    
    /**
     * Удаление товара из избранного
     */
    async removeFromFavorites(productId) {
        try {
            // Проверяем авторизацию
            if (!this.isLoggedIn) {
                throw new Error('Требуется авторизация');
            }
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve) => {
                // Имитация задержки сетевого запроса
                setTimeout(() => {
                    // Получаем текущие избранные
                    let favorites = [];
                    const savedFavorites = localStorage.getItem('plati_favorites');
                    
                    if (savedFavorites) {
                        try {
                            favorites = JSON.parse(savedFavorites);
                        } catch (e) {
                            console.error('Ошибка при чтении избранных:', e);
                            favorites = [];
                        }
                    }
                    
                    // Удаляем товар из избранного
                    const updatedFavorites = favorites.filter(f => f.id !== productId);
                    
                    // Сохраняем обновленный список избранных
                    localStorage.setItem('plati_favorites', JSON.stringify(updatedFavorites));
                    
                    resolve({
                        success: true,
                        message: 'Товар удален из избранного'
                    });
                }, 500);
            });
        } catch (error) {
            console.error('Ошибка при удалении из избранного:', error);
            throw error;
        }
    }
    
    /**
     * Получение списка чатов
     */
    async getChatList() {
        try {
            // Проверяем авторизацию
            if (!this.isLoggedIn) {
                throw new Error('Требуется авторизация');
            }
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve) => {
                // Имитация задержки сетевого запроса
                setTimeout(() => {
                    // Создаем демонстрационный список чатов
                    const chatList = this.generateMockChatList();
                    
                    resolve({
                        success: true,
                        chatList: chatList
                    });
                }, 800);
            });
        } catch (error) {
            console.error('Ошибка при получении списка чатов:', error);
            throw error;
        }
    }
    
    /**
     * Получение истории чата
     */
    async getChatHistory(sellerId) {
        try {
            // Проверяем авторизацию
            if (!this.isLoggedIn) {
                throw new Error('Требуется авторизация');
            }
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve, reject) => {
                // Имитация задержки сетевого запроса
                setTimeout(() => {
                    if (!sellerId) {
                        reject({
                            success: false,
                            error: 'ID продавца не указан'
                        });
                        return;
                    }
                    
                    // Создаем демонстрационную историю чата
                    const chatHistory = this.generateMockChatHistory(sellerId);
                    
                    resolve({
                        success: true,
                        sellerId: sellerId,
                        chatHistory: chatHistory
                    });
                }, 800);
            });
        } catch (error) {
            console.error('Ошибка при получении истории чата:', error);
            throw error;
        }
    }
    
    /**
     * Отправка сообщения в чат
     */
    async sendChatMessage(sellerId, message) {
        try {
            // Проверяем авторизацию
            if (!this.isLoggedIn) {
                throw new Error('Требуется авторизация');
            }
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve, reject) => {
                // Имитация задержки сетевого запроса
                setTimeout(() => {
                    if (!sellerId) {
                        reject({
                            success: false,
                            error: 'ID продавца не указан'
                        });
                        return;
                    }
                    
                    if (!message || message.trim() === '') {
                        reject({
                            success: false,
                            error: 'Сообщение не может быть пустым'
                        });
                        return;
                    }
                    
                    // Создаем объект сообщения
                    const messageObj = {
                        id: 'm' + Date.now(),
                        text: message,
                        sender: 'user',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: 'sent'
                    };
                    
                    resolve({
                        success: true,
                        message: messageObj
                    });
                }, 500);
            });
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            throw error;
        }
    }
    
    /**
     * Покупка товара
     */
    async purchaseProduct(productId) {
        try {
            // Проверяем авторизацию
            if (!this.isLoggedIn) {
                throw new Error('Требуется авторизация');
            }
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации имитируем запрос и ответ
            
            return new Promise((resolve, reject) => {
                // Имитация задержки сетевого запроса
                setTimeout(async () => {
                    if (!productId) {
                        reject({
                            success: false,
                            error: 'ID товара не указан'
                        });
                        return;
                    }
                    
                    // Получаем информацию о товаре
                    const productResponse = await this.getProductDetails(productId);
                    const product = productResponse.product;
                    
                    // Создаем объект покупки
                    const purchase = {
                        id: 'order' + Date.now(),
                        product: product,
                        date: new Date().toLocaleDateString('ru-RU'),
                        status: 'processing',
                        statusText: 'В обработке'
                    };
                    
                    // В реальном приложении здесь будет сохранение покупки в истории
                    
                    resolve({
                        success: true,
                        purchase: purchase,
                        message: 'Товар успешно оплачен'
                    });
                }, 1500);
            });
        } catch (error) {
            console.error('Ошибка при покупке товара:', error);
            throw error;
        }
    }
    
    /**
     * Генерация демонстрационных результатов поиска
     */
    generateMockSearchResults(query, options = {}) {
        const count = options.limit || 20;
        const results = [];
        const categories = ['Игры', 'Карты', 'ПО для ПК', 'iTunes & App Store', 'Игровые аккаунты'];
        const gameNames = ['Cyberpunk 2077', 'HELLDIVERS 2', 'Doom Eternal', 'RoadCraft', 'World of Warcraft', 'Ведьмак 3', 'Assassin\'s Creed', 'The Elder Scrolls', 'Minecraft', 'Fortnite'];
        
        for (let i = 0; i < count; i++) {
            const id = 'p' + Math.floor(Math.random() * 10000);
            const category = categories[Math.floor(Math.random() * categories.length)];
            const title = `${query} - ${gameNames[Math.floor(Math.random() * gameNames.length)]}`;
            const price = Math.floor(Math.random() * 2000) + 100;
            
            // Генерируем URL изображения с использованием placeholder
            const imageId = Math.floor(Math.random() * 100) + 100;
            const image = `https://picsum.photos/id/${imageId}/300/200`;
            
            results.push({
                id,
                title,
                price,
                image,
                category
            });
        }
        
        return results;
    }
    
    /**
     * Генерация демонстрационных данных товара
     */
    generateMockProductDetails(productId) {
        const categories = ['Игры', 'Карты', 'ПО для ПК', 'iTunes & App Store', 'Игровые аккаунты'];
        const gameNames = ['Cyberpunk 2077', 'HELLDIVERS 2', 'Doom Eternal', 'RoadCraft', 'World of Warcraft', 'Ведьмак 3', 'Assassin\'s Creed', 'The Elder Scrolls', 'Minecraft', 'Fortnite'];
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        const title = `${category} - ${gameNames[Math.floor(Math.random() * gameNames.length)]}`;
        const price = Math.floor(Math.random() * 2000) + 100;
        
        // Генерируем URL изображения с использованием placeholder
        const imageId = Math.floor(Math.random() * 100) + 100;
        const image = `https://picsum.photos/id/${imageId}/300/200`;
        
        // Дополнительные данные для детальной страницы
        const description = `Подробное описание товара ${title}. Здесь может быть длинный текст с описанием характеристик, особенностей и условий использования товара.`;
        const rating = (Math.random() * 2 + 3).toFixed(1); // Рейтинг от 3 до 5
        const ratingCount = Math.floor(Math.random() * 100) + 5; // Количество оценок
        const seller = {
            id: 's' + Math.floor(Math.random() * 10000),
            name: 'Продавец ' + Math.floor(Math.random() * 100)
        };
        
        return {
            id: productId,
            title,
            price,
            image,
            category,
            description,
            rating,
            ratingCount,
            seller
        };
    }
    
    /**
     * Генерация демонстрационных данных покупок
     */
    generateMockPurchases(count = 5) {
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
            const productId = 'purchase' + id;
            const product = this.generateMockProductDetails(productId);
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const date = getRandomDate();
            
            purchases.push({
                id,
                product,
                status: status.code,
                statusText: status.text,
                date,
                sellerId: product.seller.id,
                sellerName: product.seller.name
            });
        }
        
        return purchases;
    }
    
    /**
     * Генерация демонстрационных данных избранных товаров
     */
    generateMockFavorites(count = 4) {
        const favorites = [];
        
        for (let i = 0; i < count; i++) {
            const id = 'fav' + Math.floor(Math.random() * 10000);
            const product = this.generateMockProductDetails(id);
            favorites.push(product);
        }
        
        return favorites;
    }
    
    /**
     * Генерация демонстрационного списка чатов
     */
    generateMockChatList(count = 5) {
        const chatList = [];
        const sellerNames = ['Продавец игр', 'Магазин ключей', 'Game Store', 'Цифровые товары', 'Steam Shop', 'Аккаунты WoW', 'Карты iTunes', 'Подписки Xbox'];
        const messages = [
            'Здравствуйте, интересует ваш товар',
            'Можно узнать подробнее о товаре?',
            'Спасибо за информацию',
            'Как быстро будет доставка?',
            'Товар в наличии?',
            'Можно ли получить скидку?',
            'Да, конечно',
            'Нет, спасибо',
            'Хорошо, буду ждать',
            'Когда можно будет получить товар?',
            'Есть ли гарантия на товар?',
            'Как активировать ключ?',
            'Спасибо за покупку!',
            'Товар отправлен',
            'Проверьте почту'
        ];
        
        for (let i = 0; i < count; i++) {
            const id = 's' + Math.floor(Math.random() * 10000);
            const name = sellerNames[Math.floor(Math.random() * sellerNames.length)];
            const lastMessage = messages[Math.floor(Math.random() * messages.length)];
            
            // Генерируем случайное время
            const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
            const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
            const lastMessageTime = `${hours}:${minutes}`;
            
            const unreadCount = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;
            
            chatList.push({
                id,
                name,
                lastMessage,
                lastMessageTime,
                unreadCount
            });
        }
        
        return chatList;
    }
    
    /**
     * Генерация демонстрационной истории чата
     */
    generateMockChatHistory(sellerId, count = 10) {
        const chatHistory = [];
        const now = new Date();
        const userMessages = [
            'Здравствуйте, интересует ваш товар',
            'Можно узнать подробнее о товаре?',
            'Спасибо за информацию',
            'Как быстро будет доставка?',
            'Товар в наличии?',
            'Можно ли получить скидку?',
            'Да, конечно',
            'Нет, спасибо',
            'Хорошо, буду ждать',
            'Когда можно будет получить товар?',
            'Есть ли гарантия на товар?',
            'Как активировать ключ?'
        ];
        
        const sellerMessages = [
            'Здравствуйте! Чем могу помочь?',
            'Да, товар в наличии',
            'Товар будет доставлен сразу после оплаты',
            'Спасибо за обращение',
            'Конечно, могу предоставить дополнительную информацию',
            'Активация происходит через Steam/Origin/Epic Games',
            'Гарантия на товар 30 дней',
            'Если возникнут вопросы, обращайтесь',
            'Приятно иметь с вами дело',
            'Товар отправлен на вашу почту',
            'Проверьте, пожалуйста, папку "Спам"',
            'Могу предложить скидку 5% на следующую покупку',
            'Это лицензионный ключ',
            'Да, поддерживается русский язык',
            'Системные требования можно посмотреть на странице товара'
        ];
        
        for (let i = 0; i < count; i++) {
            const id = 'm' + Math.floor(Math.random() * 10000);
            const sender = Math.random() > 0.5 ? 'user' : 'seller';
            const text = sender === 'user' 
                ? userMessages[Math.floor(Math.random() * userMessages.length)]
                : sellerMessages[Math.floor(Math.random() * sellerMessages.length)];
            
            // Генерируем время сообщения (за последние 24 часа)
            const messageTime = new Date(now);
            messageTime.setHours(messageTime.getHours() - Math.floor(Math.random() * 24));
            const time = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            chatHistory.push({
                id,
                text,
                sender,
                time,
                status: sender === 'user' ? 'sent' : 'received'
            });
        }
        
        // Сортируем по времени (от старых к новым)
        chatHistory.sort((a, b) => {
            const timeA = this.parseTime(a.time);
            const timeB = this.parseTime(b.time);
            return timeA - timeB;
        });
        
        return chatHistory;
    }
    
    /**
     * Парсинг времени из строки формата "HH:MM"
     */
    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date.getTime();
    }
}

// Создаем экземпляр сервиса API Plati
window.platiApiService = new PlatiApiService();
