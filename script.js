// ===== GLOBAL VARIABLES =====
let currentTheme = 'dark';
let chatHistory = [];
let currentFile = null;
let toggleState = 0;
let typingEffectActive = true;
let fullFormText = "IDEAL SCIENCE & TECHNOLOGY AIMING RESEARCH COUNCIL";
let footerFullFormText = "IDEAL SCIENCE & TECHNOLOGY AIMING RESEARCH COUNCIL";
let footerInitialAnimation = true;
let footerTypingIndex = 0;
let footerTypingDirection = 1;
let openingAnimationComplete = false;
let mottoText = "Science in Creation, Not Annihilation";
let mottoIndex = 0;
let footerTypingInterval;
let isSending = false;
let isInitialThemeLoad = true;

// Sample chat history data
const sampleHistory = [
    { id: 1, title: "New Chat", date: "Today", active: true }
];

// Science & tech emojis only
const scienceEmojis = ["🔬", "⚗️", "🧪", "🧬", "🔭", "💻", "📡", "⚛️", "🧮", "🔋", "💾", "🧲", "🌡️", "🧫", "🔍", "📊", "🧠", "⚙️", "🔧", "📐"];

// ===== DOM ELEMENT REFERENCES =====
const dropdownToggle = document.getElementById('dropdownToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
const themeToggleCheckbox = document.getElementById('themeToggleCheckbox');
const themeToggleContainer = document.getElementById('themeToggleContainer');
const newChatDropdown = document.getElementById('newChatDropdown');
const historyToggleDropdown = document.getElementById('historyToggleDropdown');
const chatHistorySidebar = document.getElementById('chatHistorySidebar');
const chatHistoryList = document.getElementById('chatHistoryList');
const emptyHistoryMessage = document.getElementById('emptyHistoryMessage');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const attachFileBtn = document.getElementById('attachFileBtn');
const emojiPickerBtn = document.getElementById('emojiPickerBtn');
const emojiPicker = document.getElementById('emojiPicker');
const emojiGrid = document.getElementById('emojiGrid');
const typingIndicator = document.getElementById('typingIndicator');
const emojiCloseBtn = document.getElementById('emojiCloseBtn');
const openingOverlay = document.getElementById('openingOverlay');
const openingLogo = document.getElementById('openingLogo');
const openingMottoText = document.getElementById('openingMottoText');
const mainApp = document.getElementById('mainApp');
const mainFooter = document.getElementById('mainFooter');
const footerTypingText = document.getElementById('footerTypingText');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const infoPanel = document.getElementById('infoPanel');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
const deleteCancelBtn = document.getElementById('deleteCancelBtn');
const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');

// ===== OPENING ANIMATION =====
function startOpeningAnimation() {
    const mottoInterval = setInterval(() => {
        if (mottoIndex <= mottoText.length) {
            openingMottoText.textContent = mottoText.substring(0, mottoIndex);
            mottoIndex++;
        } else {
            clearInterval(mottoInterval);
            
            setTimeout(() => {
                openingOverlay.classList.add('hiding');
                startLogoAnimation();
                
                setTimeout(() => {
                    openingOverlay.style.display = 'none';
                    mainApp.style.display = 'flex';
                    openingAnimationComplete = true;
                    
                    mainFooter.classList.add('initial-visible');
                    startFooterTypingEffect();
                    
                    setTimeout(() => {
                        showTemporaryNotification("OESTRON initialized. Ready for scientific inquiry.");
                    }, 500);
                }, 800);
            }, 300);
        }
    }, 50);
}

function startLogoAnimation() {
    const openingLogoImg = document.querySelector('.opening-logo-img');
    openingLogoImg.style.transform = 'translateY(100vh) scale(0.1)';
    openingLogoImg.style.opacity = '0';
}

// ===== TYPING EFFECT FOR FOOTER =====
function startFooterTypingEffect() {
    if (footerTypingInterval) {
        clearInterval(footerTypingInterval);
    }
    
    footerTypingIndex = 0;
    footerTypingDirection = 1;
    
    footerTypingInterval = setInterval(() => {
        if (!typingEffectActive) return;
        
        if (footerTypingDirection === 1) {
            if (footerTypingIndex <= footerFullFormText.length) {
                footerTypingText.textContent = footerFullFormText.substring(0, footerTypingIndex);
                footerTypingIndex++;
                
                if (footerTypingIndex > footerFullFormText.length) {
                    setTimeout(() => {
                        if (mainFooter.classList.contains('initial-visible')) {
                            mainFooter.classList.remove('initial-visible');
                        }
                    }, 2000);
                }
            } else {
                setTimeout(() => {
                    footerTypingDirection = -1;
                }, 2000);
            }
        } else {
            if (footerTypingIndex >= 0) {
                footerTypingText.textContent = footerFullFormText.substring(0, footerTypingIndex);
                footerTypingIndex--;
            } else {
                setTimeout(() => {
                    footerTypingDirection = 1;
                }, 1000);
            }
        }
    }, 100);
}

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    const savedTheme = localStorage.getItem('chatTheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        // Set the toggle checkbox based on saved theme
        themeToggleCheckbox.checked = savedTheme === 'light';
    }
    
    applyTheme(currentTheme, false);
    loadChatHistory();
    startOpeningAnimation();
}

function applyTheme(theme, showNotification = true) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        openingOverlay.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
        
        // Update toggle state
        themeToggleCheckbox.checked = false;
        
        if (!isInitialThemeLoad && showNotification) {
            showTemporaryNotification("Switched to dark theme");
        }
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        openingOverlay.style.backgroundColor = 'rgba(189, 191, 191, 0.95)';
        
        // Update toggle state
        themeToggleCheckbox.checked = true;
        
        if (!isInitialThemeLoad && showNotification) {
            showTemporaryNotification("Switched to light theme");
        }
    }
    
    currentTheme = theme;
    localStorage.setItem('chatTheme', theme);
    isInitialThemeLoad = false;
}

// ===== DROPDOWN FUNCTIONALITY =====
function initializeDropdown() {
    console.log("=== Initializing Dropdown ===");
    
    dropdownToggle.addEventListener('click', (e) => {
        console.log("Hamburger menu clicked");
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && e.target !== dropdownToggle) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    // Theme toggle switch event
    themeToggleCheckbox.addEventListener('change', () => {
        if (themeToggleCheckbox.checked) {
            applyTheme('light', true);
        } else {
            applyTheme('dark', true);
        }
    });
    
    // Also toggle theme when clicking on the container (for better UX)
    themeToggleContainer.addEventListener('click', (e) => {
        // Don't trigger if clicking directly on the switch
        if (!e.target.closest('.theme-toggle-switch')) {
            themeToggleCheckbox.checked = !themeToggleCheckbox.checked;
            themeToggleCheckbox.dispatchEvent(new Event('change'));
        }
    });
    
    newChatDropdown.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
        createNewChat();
    });
    
    // Chat history toggle button
    historyToggleDropdown.addEventListener('click', () => {
        console.log("=== HISTORY TOGGLE CLICKED ===");
        dropdownMenu.classList.remove('active');
        toggleChatHistory();
    });
    
    console.log("All dropdown event listeners attached");
}

// ===== CHAT HISTORY TOGGLE FUNCTIONALITY =====
function toggleChatHistory() {
    console.log("=== toggleChatHistory FUNCTION CALLED ===");
    
    // Remove any inline styles that might interfere
    chatHistorySidebar.style.removeProperty('transform');
    chatHistorySidebar.style.removeProperty('display');
    chatHistorySidebar.style.removeProperty('opacity');
    chatHistorySidebar.style.removeProperty('visibility');
    
    // Toggle the active class
    const isOpening = !chatHistorySidebar.classList.contains('active');
    chatHistorySidebar.classList.toggle('active');
    
    console.log("Sidebar active after toggle:", chatHistorySidebar.classList.contains('active'));
    console.log("Computed transform:", window.getComputedStyle(chatHistorySidebar).transform);
    
    if (chatHistorySidebar.classList.contains('active')) {
        // SIDEBAR IS NOW OPEN
        console.log("Sidebar is OPEN");
        mainFooter.classList.add('initial-visible');
        showTemporaryNotification("Chat history opened");
    } else {
        // SIDEBAR IS NOW CLOSED
        console.log("Sidebar is CLOSED");
        if (!footerInitialAnimation) {
            mainFooter.classList.remove('initial-visible');
        }
        showTemporaryNotification("Chat history closed");
    }
    
    // Force a reflow to ensure CSS updates
    chatHistorySidebar.offsetHeight;
}

// ===== MOBILE MENU TOGGLE =====
function initializeMobileMenu() {
    mobileMenuToggle.addEventListener('click', () => {
        infoPanel.classList.toggle('collapsed');
        
        if (infoPanel.classList.contains('collapsed')) {
            mobileMenuToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
            showTemporaryNotification("Info panel collapsed");
        } else {
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            showTemporaryNotification("Info panel expanded");
        }
    });
    
    if (window.innerWidth <= 1300) {
        infoPanel.classList.add('collapsed');
        mobileMenuToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

// ===== NEW CHAT FUNCTIONALITY =====
function createNewChat() {
    const messages = chatMessages.querySelectorAll('.message');
    messages.forEach((msg, index) => {
        if (index > 0) msg.remove();
    });
    
    messageInput.value = '';
    currentFile = null;
    autoResizeTextarea();
    
    showTemporaryNotification("New chat started");
    updateChatHistory();
}

function updateChatHistory() {
    chatHistory.forEach(item => item.active = false);
    chatHistory.unshift({
        id: chatHistory.length + 1,
        title: `Chat ${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}`,
        date: "Just now",
        active: true
    });
    updateHistoryList();
}

// ===== DELETE FUNCTIONALITY =====
function initializeDeleteFunctionality() {
    deleteAllBtn.addEventListener('click', showDeleteConfirmation);
    deleteCancelBtn.addEventListener('click', hideDeleteConfirmation);
    deleteConfirmBtn.addEventListener('click', deleteAllHistory);
    
    deleteConfirmationModal.addEventListener('click', (e) => {
        if (e.target === deleteConfirmationModal) {
            hideDeleteConfirmation();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && deleteConfirmationModal.classList.contains('active')) {
            hideDeleteConfirmation();
        }
    });
}

function showDeleteConfirmation() {
    if (chatHistory.length === 0) {
        showTemporaryNotification("No history to delete");
        return;
    }
    deleteConfirmationModal.classList.add('active');
}

function hideDeleteConfirmation() {
    deleteConfirmationModal.classList.remove('active');
}

function deleteAllHistory() {
    chatHistory = [];
    updateHistoryList();
    hideDeleteConfirmation();
    showTemporaryNotification("All chat history deleted");
}

function deleteSingleHistoryItem(id) {
    const index = chatHistory.findIndex(item => item.id === id);
    
    if (index !== -1) {
        const deletedItem = chatHistory.splice(index, 1)[0];
        updateHistoryList();
        showTemporaryNotification(`"${deletedItem.title}" deleted`);
    }
}

// ===== CHAT HISTORY MANAGEMENT =====
function loadChatHistory() {
    chatHistory = [...sampleHistory];
    updateHistoryList();
}

function updateHistoryList() {
    chatHistoryList.innerHTML = '';
    
    if (chatHistory.length === 0) {
        emptyHistoryMessage.style.display = 'block';
        return;
    }
    
    emptyHistoryMessage.style.display = 'none';
    
    chatHistory.forEach(item => {
        const historyItem = document.createElement('li');
        historyItem.className = `history-item ${item.active ? 'active' : ''}`;
        historyItem.dataset.id = item.id;
        historyItem.innerHTML = `
            <div class="history-item-content">
                <div class="history-item-text">
                    <div class="history-item-title">${item.title}</div>
                    <div class="history-date">${item.date}</div>
                </div>
            </div>
            <button class="history-item-delete" data-id="${item.id}" aria-label="Delete this chat">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        historyItem.addEventListener('click', (e) => {
            if (!e.target.closest('.history-item-delete')) {
                document.querySelectorAll('.history-item').forEach(el => {
                    el.classList.remove('active');
                });
                historyItem.classList.add('active');
                chatHistory.forEach(chat => chat.active = chat.id === item.id);
                showTemporaryNotification(`Loading: ${item.title}`);
            }
        });
        
        const deleteBtn = historyItem.querySelector('.history-item-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(e.currentTarget.dataset.id);
            if (confirm(`Delete "${item.title}" from history?`)) {
                deleteSingleHistoryItem(id);
            }
        });
        
        chatHistoryList.appendChild(historyItem);
    });
}

// ===== EMOJI PICKER =====
function initializeEmojiPicker() {
    emojiGrid.innerHTML = '';
    
    scienceEmojis.forEach(emoji => {
        const emojiBtn = document.createElement('button');
        emojiBtn.className = 'emoji-btn-small';
        emojiBtn.textContent = emoji;
        emojiBtn.setAttribute('aria-label', `Emoji ${emoji}`);
        emojiBtn.addEventListener('click', () => {
            insertEmoji(emoji);
            emojiPicker.classList.remove('active');
        });
        emojiGrid.appendChild(emojiBtn);
    });
}

function insertEmoji(emoji) {
    const cursorPos = messageInput.selectionStart;
    const textBefore = messageInput.value.substring(0, cursorPos);
    const textAfter = messageInput.value.substring(cursorPos);
    
    messageInput.value = textBefore + emoji + textAfter;
    messageInput.focus();
    messageInput.selectionStart = cursorPos + emoji.length;
    messageInput.selectionEnd = cursorPos + emoji.length;
    autoResizeTextarea();
}

// ===== CHAT FUNCTIONALITY =====
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    const maxHeight = 150;
    const scrollHeight = messageInput.scrollHeight;
    
    if (scrollHeight > maxHeight) {
        messageInput.style.height = maxHeight + 'px';
        messageInput.style.overflowY = 'auto';
    } else {
        messageInput.style.height = scrollHeight + 'px';
        messageInput.style.overflowY = 'hidden';
    }
}

function addMessage(content, isUser = false, fileAttached = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    
    const senderName = isUser ? 'You' : 'OESTRON Assistant';
    const senderIcon = isUser ? 'fa-user' : 'fa-robot';
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let fileHtml = '';
    if (fileAttached) {
        fileHtml = `
            <div class="file-attachment" data-file="${fileAttached.name}" data-size="${fileAttached.size}">
                <i class="fas fa-file-${fileAttached.type === 'pdf' ? 'pdf' : fileAttached.type === 'image' ? 'image' : 'alt'}"></i>
                <div class="file-name">${fileAttached.name}</div>
                <div class="file-size">${fileAttached.size}</div>
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-sender"><i class="fas ${senderIcon}"></i> ${senderName}</div>
            <div class="message-text">${content}</div>
            ${fileHtml}
            <div class="message-time">${currentTime}</div>
            <button class="copy-message-btn" title="Copy message">
                <i class="far fa-copy"></i>
            </button>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    const copyBtn = messageDiv.querySelector('.copy-message-btn');
    copyBtn.addEventListener('click', () => {
        const messageText = messageDiv.querySelector('.message-text').textContent;
        navigator.clipboard.writeText(messageText).then(() => {
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = '<i class="far fa-copy"></i>';
            }, 2000);
        });
    });
    
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
    
    return messageDiv;
}

function sendMessage() {
    if (isSending) return;
    
    const message = messageInput.value.trim();
    if (!message && !currentFile) return;
    
    addMessage(message, true, currentFile);
    messageInput.value = '';
    currentFile = null;
    autoResizeTextarea();
    
    isSending = true;
    sendButton.disabled = true;
    sendButton.classList.add('sending');
    
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        isSending = false;
        sendButton.disabled = false;
        sendButton.classList.remove('sending');
        
        let response = generateResponse(message.toLowerCase());
        addMessage(response, false);
        
        const activeChat = chatHistory.find(item => item.active);
        if (activeChat) {
            activeChat.date = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            if (activeChat.title.startsWith('Chat')) {
                const words = message.split(' ').slice(0, 4).join(' ');
                if (words.length > 0) {
                    activeChat.title = words + (words.length < 20 ? '' : '...');
                }
            }
            updateHistoryList();
        }
    }, 1500 + Math.random() * 1000);
}

function generateResponse(userMessage) {
    // Simple response pattern - can be replaced with API later
    if (userMessage.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i)) {
        return "Hello! I'm OESTRON, your AI science assistant. How can I help you with scientific research or education today?";
    }
    
    if (userMessage.includes('?')) {
        return "That's an interesting question. As OESTRON, I can help with scientific methodology, research design, data analysis, and academic writing.";
    }
    
    return "I understand. As an AI science assistant, I'm here to help with evidence-based scientific inquiry and research methodology.";
}

// ===== NOTIFICATION SYSTEM =====
function showTemporaryNotification(message) {
    const notification = document.createElement('div');
    
    let backgroundColor, textColor;
    if (currentTheme === 'light') {
        backgroundColor = 'rgba(191, 189, 189, 0.95)';
        textColor = '#1f3145';
    } else {
        backgroundColor = 'rgba(15, 23, 42, 0.95)';
        textColor = '#f1f5f9';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 140px;
        left: 50%;
        transform: translateX(-50%) translateY(-30px);
        background: ${backgroundColor};
        color: ${textColor};
        padding: 12px 24px;
        border-radius: 12px;
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
        font-weight: 500;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        white-space: nowrap;
        text-align: center;
        backdrop-filter: blur(5px);
        border: 1px solid var(--border-color);
        opacity: 0.9;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
        notification.style.opacity = '0.9';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(-30px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 3000);
}

// ===== FILE HANDLING =====
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    currentFile = {
        name: file.name,
        size: formatFileSize(file.size),
        type: getFileType(file.name)
    };
    
    simulateFileUpload(file);
}

function simulateFileUpload(file) {
    isSending = true;
    sendButton.disabled = true;
    sendButton.classList.add('sending');
    
    setTimeout(() => {
        isSending = false;
        sendButton.disabled = false;
        sendButton.classList.remove('sending');
        showTemporaryNotification(`"${file.name}" attached successfully`);
    }, 1500);
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['txt', 'doc', 'docx', 'md'].includes(ext)) return 'text';
    return 'other';
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Close history sidebar button
    closeHistoryBtn.addEventListener('click', () => {
        chatHistorySidebar.classList.remove('active');
        if (!footerInitialAnimation) {
            mainFooter.classList.remove('initial-visible');
        }
    });
    
    // Close sidebar when clicking outside (only on desktop)
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 900 && 
            chatHistorySidebar.classList.contains('active') &&
            !chatHistorySidebar.contains(e.target) &&
            e.target !== historyToggleDropdown &&
            !e.target.closest('#historyToggleDropdown')) {
            
            chatHistorySidebar.classList.remove('active');
            if (!footerInitialAnimation) {
                mainFooter.classList.remove('initial-visible');
            }
        }
    });
    
    // Message input
    messageInput.addEventListener('input', autoResizeTextarea);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
        autoResizeTextarea();
    });
    
    // Send button
    sendButton.addEventListener('click', sendMessage);
    
    // Attach file button
    attachFileBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.jpg,.jpeg,.png,.txt,.doc,.docx';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', handleFileSelect);
        
        document.body.appendChild(fileInput);
        fileInput.click();
        
        setTimeout(() => {
            document.body.removeChild(fileInput);
        }, 100);
    });
    
    // Emoji picker
    emojiPickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        emojiPicker.classList.toggle('active');
    });
    
    emojiCloseBtn.addEventListener('click', () => {
        emojiPicker.classList.remove('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!emojiPicker.contains(e.target) && e.target !== emojiPickerBtn) {
            emojiPicker.classList.remove('active');
        }
    });
    
    // Initialize auto-resize
    autoResizeTextarea();
    
    // Copy functionality for existing messages
    document.querySelectorAll('.copy-message-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const messageContent = this.closest('.message-content');
            const messageText = messageContent.querySelector('.message-text').textContent;
            navigator.clipboard.writeText(messageText).then(() => {
                this.classList.add('copied');
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.classList.remove('copied');
                    this.innerHTML = '<i class="far fa-copy"></i>';
                }, 2000);
            });
        });
    });
    
    // Window resize handler
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 1300 && !infoPanel.classList.contains('collapsed')) {
            infoPanel.classList.add('collapsed');
            mobileMenuToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        } else if (window.innerWidth > 1300 && infoPanel.classList.contains('collapsed')) {
            infoPanel.classList.remove('collapsed');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
        
        if (window.innerWidth <= 600) {
            emojiPicker.style.right = '0';
        } else {
            emojiPicker.style.right = '0';
        }
    });
}

// ===== AUTO-DETECT ISTARC WORDS =====
function styleISTARCWords() {
    // Get all text nodes in the document
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    const replacements = [];
    
    // Find text containing ISTARC
    while (node = walker.nextNode()) {
        const text = node.textContent;
        if (text.match(/\bISTARC\b/i) && node.parentNode.nodeName !== 'SCRIPT' && node.parentNode.nodeName !== 'STYLE') {
            replacements.push({ node, text });
        }
    }
    
    // Replace found text with styled spans
    replacements.forEach(({ node, text }) => {
        const span = document.createElement('span');
        span.className = 'istarc-word';
        
        // Preserve case sensitivity
        const newHTML = text.replace(/\b(ISTARC|istarc|Istarc)\b/g, '<span class="istarc-word">$1</span>');
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newHTML;
        
        // Replace the text node with new HTML
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
        }
        
        node.parentNode.replaceChild(fragment, node);
    });
}

// ===== INITIALIZATION =====
function initializeApp() {
    initializeTheme();
    initializeDropdown();
    initializeEmojiPicker();
    initializeDeleteFunctionality();
    initializeMobileMenu();
    initializeEventListeners();
    
    if (window.innerWidth <= 600) {
        emojiPicker.style.right = '0';
    }
    
    // Style ISTARC words
    styleISTARCWords();
    
    // Also style ISTARC in AI responses
    const originalAddMessage = window.addMessage;
    if (originalAddMessage) {
        window.addMessage = function(...args) {
            const result = originalAddMessage.apply(this, args);
            setTimeout(styleISTARCWords, 100);
            return result;
        };
    }

}

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', initializeApp);
