/**
 * Модуль для работы с чатами Plati Market PWA
 */

class ChatService {
    constructor() {
        this.chatList = [];
        this.currentChatId = null;
        this.currentChatHistory = [];
        
        // Инициализация обработчиков событий
        this.initEventListeners();
    }
    
    /**
     * Инициализация обработчиков событий
     */
    initEventListeners() {
        const sendMessageBtn = document.getElementById('send-message-btn');
        const chatInput = document.getElementById('chat-input');
        
        if (sendMessageBtn && chatInput) {
            sendMessageBtn.addEventListener('click', () => {
                this.sendMessage(chatInput.value);
                chatInput.value = '';
            });
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage(chatInput.value);
                    chatInput.value = '';
                }
            });
        }
    }
    
    /**
     * Загрузка списка чатов
     */
    loadChatList() {
        // В реальном приложении здесь будет запрос к API Plati
        // Для демонстрации используем моковые данные
        this.simulateApiRequest(() => {
            this.chatList = this.getMockChatList(5);
            this.renderChatList();
        });
    }
    
    /**
     * Загрузка истории чата
     */
    loadChatHistory(sellerId) {
        return new Promise((resolve, reject) => {
            if (!sellerId) {
                reject('ID продавца не указан');
                return;
            }
            
            this.currentChatId = sellerId;
            
            // В реальном приложении здесь будет запрос к API Plati
            // Для демонстрации используем моковые данные
            this.simulateApiRequest(() => {
                this.currentChatHistory = this.getMockChatHistory(sellerId, 10);
                this.renderChatHistory();
                resolve(this.currentChatHistory);
                
                // Прокручиваем чат вниз
                this.scrollChatToBottom();
            });
        });
    }
    
    /**
     * Отправка сообщения
     */
    sendMessage(text) {
        if (!text || text.trim() === '' || !this.currentChatId) {
            return;
        }
        
        // Создаем новое сообщение
        const message = {
            id: 'm' + Date.now(),
            text: text.trim(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };
        
        // Добавляем сообщение в историю
        this.currentChatHistory.push(message);
        
        // Отрисовываем новое сообщение
        this.renderMessage(message);
        
        // Прокручиваем чат вниз
        this.scrollChatToBottom();
        
        // В реальном приложении здесь будет запрос к API Plati
        // Для демонстрации имитируем ответ продавца через некоторое время
        setTimeout(() => {
            const reply = {
                id: 'm' + (Date.now() + 1),
                text: this.getRandomReply(),
                sender: 'seller',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'received'
            };
            
            // Добавляем ответ в историю
            this.currentChatHistory.push(reply);
            
            // Отрисовываем ответ
            this.renderMessage(reply);
            
            // Прокручиваем чат вниз
            this.scrollChatToBottom();
        }, 1500);
    }
    
    /**
     * Отрисовка списка чатов
     */
    renderChatList() {
        const container = document.getElementById('chat-list');
        if (!container) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        if (!this.chatList || this.chatList.length === 0) {
            container.innerHTML = '<div class="empty-state">У вас пока нет чатов</div>';
            return;
        }
        
        // Добавляем элементы чатов
        this.chatList.forEach(chat => {
            const item = document.createElement('div');
            item.className = 'chat-item';
            item.setAttribute('data-id', chat.id);
            
            item.innerHTML = `
                <div class="chat-avatar">${chat.name.charAt(0).toUpperCase()}</div>
                <div class="chat-details">
                    <div class="chat-header">
                        <span class="chat-name">${chat.name}</span>
                        <span class="chat-time">${chat.lastMessageTime}</span>
                    </div>
                    <div class="chat-last-message">${chat.lastMessage}</div>
                </div>
                ${chat.unreadCount > 0 ? `<div class="chat-unread">${chat.unreadCount}</div>` : ''}
            `;
            
            // Добавляем обработчик клика
            item.addEventListener('click', () => {
                this.loadChatHistory(chat.id)
                    .then(() => {
                        window.appService.navigateToScreen('chat-screen');
                    });
            });
            
            container.appendChild(item);
        });
    }
    
    /**
     * Отрисовка истории чата
     */
    renderChatHistory() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        if (!this.currentChatHistory || this.currentChatHistory.length === 0) {
            container.innerHTML = '<div class="empty-state">Начните общение с продавцом</div>';
            return;
        }
        
        // Добавляем сообщения
        this.currentChatHistory.forEach(message => {
            this.renderMessage(message, container);
        });
    }
    
    /**
     * Отрисовка отдельного сообщения
     */
    renderMessage(message, container = null) {
        if (!message) return;
        
        const messagesContainer = container || document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${message.sender === 'user' ? 'sent' : 'received'}`;
        messageElement.setAttribute('data-id', message.id);
        
        messageElement.innerHTML = `
            <div class="message-text">${message.text}</div>
            <div class="message-time">${message.time}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
    }
    
    /**
     * Прокрутка чата вниз
     */
    scrollChatToBottom() {
        const container = document.getElementById('chat-messages');
        if (container) {
            container.scrollTop = container.scrollHeight;
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
     * Создание моковых данных списка чатов
     */
    getMockChatList(count = 5) {
        const chatList = [];
        const sellerNames = ['Продавец игр', 'Магазин ключей', 'Game Store', 'Цифровые товары', 'Steam Shop', 'Аккаунты WoW', 'Карты iTunes', 'Подписки Xbox'];
        
        for (let i = 0; i < count; i++) {
            const id = 's' + Math.floor(Math.random() * 10000);
            const name = sellerNames[Math.floor(Math.random() * sellerNames.length)];
            const lastMessage = this.getRandomMessage();
            const lastMessageTime = this.getRandomTime();
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
     * Создание моковых данных истории чата
     */
    getMockChatHistory(sellerId, count = 10) {
        const chatHistory = [];
        const now = new Date();
        
        for (let i = 0; i < count; i++) {
            const id = 'm' + Math.floor(Math.random() * 10000);
            const sender = Math.random() > 0.5 ? 'user' : 'seller';
            const text = this.getRandomMessage();
            
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
    
    /**
     * Генерация случайного сообщения
     */
    getRandomMessage() {
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
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    /**
     * Генерация случайного ответа продавца
     */
    getRandomReply() {
        const replies = [
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
        
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    /**
     * Генерация случайного времени
     */
    getRandomTime() {
        const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
        const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

// Создаем экземпляр сервиса чатов
window.chatService = new ChatService();
