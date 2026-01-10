// ===== GLOBAL VARIABLES =====
let currentTheme = 'dark';
let chatHistory = [];
let currentFile = null;
let toggleState = 0; // Now only used for theme toggle
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
let isInitialThemeLoad = true; // NEW: Track initial theme load

// Sample chat history data
const sampleHistory = [
    { id: 1, title: "ISTARC Introduction", date: "Today, 10:00 AM", active: true },
    { id: 2, title: "Science Projects", date: "Yesterday, 3:45 PM", active: false },
    { id: 3, title: "Workshop Ideas", date: "Dec 28, 2:30 PM", active: false },
    { id: 4, title: "Research Methods", date: "Dec 25, 11:20 AM", active: false }
];

// Science & tech emojis only
const scienceEmojis = ["🔬", "⚗️", "🧪", "🧬", "🔭", "💻", "📡", "⚛️", "🧮", "🔋", "💾", "🧲", "🌡️", "🧫", "🔍", "📊", "🧠", "⚙️", "🔧", "📐"];

// ISTARC Facts for responses
const istarcFacts = [
    "ISTARC (IDEAL SCIENCE & TECHNOLOGY AIMING RESEARCH COUNCIL) was established in 2018 with a vision to promote scientific temper among students.",
    "We have organized over 50 workshops and science festivals since our inception, reaching more than 5000 students.",
    "Our club has more than 500 active student members passionate about science, technology, and innovation.",
    "ISTARC focuses on 'Science in Creation, not Annihilation' as our core philosophy - promoting constructive scientific applications.",
    "We are part of Ideal Science College, dedicated to fostering scientific thinking and research culture among students.",
    "Our events include hands-on experiments, research competitions, tech workshops, and national science fair participations.",
    "ISTARC encourages students to participate in national and international science fairs, with several winning projects.",
    "We believe in practical learning and applying scientific methods to real-world problems through collaborative projects."
];

// Science & Math Facts
const scienceMathFacts = [
    "The speed of light is approximately 299,792,458 meters per second - a fundamental constant in physics.",
    "Pi (π) is an irrational number that continues infinitely without repeating. Mathematicians have calculated over 50 trillion digits of Pi!",
    "Water expands when it freezes, which is unusual as most substances contract when they solidify.",
    "The human brain contains about 86 billion neurons, each connected to thousands of other neurons.",
    "DNA, if uncoiled, would stretch from the Earth to the Sun and back about 600 times.",
    "A single bolt of lightning contains enough energy to toast 100,000 slices of bread.",
    "The Great Pyramid of Giza was the tallest man-made structure in the world for over 3,800 years.",
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "There are more possible iterations of a game of chess than there are atoms in the known universe.",
    "The Earth's core is as hot as the surface of the Sun - about 5,500°C (9,932°F)."
];

// Greeting responses with ISTARC info
const greetingResponses = [
    "Hello! I'm OESTRON, your science assistant from ISTARC (IDEAL SCIENCE & TECHNOLOGY AIMING RESEARCH COUNCIL). How can I help you explore science today? Did you know ISTARC has organized over 50 science workshops since 2018?",
    "Hi there! Ready to dive into some scientific exploration? I'm here to assist with all your science and tech questions. As part of ISTARC, we focus on 'Science in Creation, not Annihilation'.",
    "Greetings! I'm OESTRON from ISTARC - your gateway to understanding science and technology in creative ways. Our club has 500+ active members passionate about innovation!",
    "Welcome! I'm OESTRON, developed by ISTARC's IT team. I can help with research, experiments, or scientific concepts. Fun fact: ISTARC encourages participation in national science fairs!",
    "Hello! Science awaits! I'm here to help you with projects, research, or just satisfying your scientific curiosity. ISTARC believes in practical learning through hands-on experiments."
];

// Science responses
const scienceResponses = [
    "Based on scientific principles, I'd suggest approaching this systematically. The scientific method teaches us to observe, hypothesize, experiment, and analyze.",
    "From a research perspective, we could approach this by first reviewing existing literature, then designing a controlled experiment to test our hypothesis.",
    "The scientific method teaches us to be systematic: make observations, ask questions, form hypotheses, conduct experiments, and draw conclusions.",
    "In laboratory settings, this would be tested using controlled experiments with proper variables and replication for statistical significance.",
    "Research shows that the most effective approach is to break down complex problems into smaller, testable components."
];

// ===== DOM ELEMENT REFERENCES =====
const themeToggle = document.getElementById('themeToggle');
const historyToggleBtn = document.getElementById('historyToggleBtn'); // NEW
const newChatBtn = document.getElementById('newChatBtn');
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
const errorContainer = document.getElementById('errorContainer');
const errorText = document.getElementById('errorText');
const emojiCloseBtn = document.getElementById('emojiCloseBtn');
const openingOverlay = document.getElementById('openingOverlay');
const openingLogo = document.getElementById('openingLogo');
const openingMottoText = document.getElementById('openingMottoText');
const mainApp = document.getElementById('mainApp');
const mainFooter = document.getElementById('mainFooter');
const footerTypingText = document.getElementById('footerTypingText');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const infoPanel = document.getElementById('infoPanel');
const footerLogo = document.getElementById('footerLogo');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// Create delete confirmation modal
const deleteConfirmationModal = document.createElement('div');
deleteConfirmationModal.className = 'delete-confirmation-modal';
deleteConfirmationModal.innerHTML = `
    <div class="delete-confirmation-content">
        <div class="delete-confirmation-header">
            <div class="delete-confirmation-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h4>Delete All History</h4>
        </div>
        <div class="delete-confirmation-body">
            Are you sure you want to delete all chat history? This action cannot be undone.
        </div>
        <div class="delete-confirmation-actions">
            <button class="delete-cancel-btn" id="deleteCancelBtn">Cancel</button>
            <button class="delete-confirm-btn" id="deleteConfirmBtn">Delete All</button>
        </div>
    </div>
`;

// Append the modal to body
document.body.appendChild(deleteConfirmationModal);
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
                    
                    // Set footer to initial visible state
                    mainFooter.classList.add('initial-visible');
                    
                    startFooterTypingEffect();
                    
                    setTimeout(() => {
                        showTemporaryNotification("Welcome to OESTRON - ISTARC's Science Assistant!");
                    }, 500);
                }, 800);
            }, 300);
        }
    }, 50);
}

function startLogoAnimation() {
    // Add drop animation to logo
    openingLogo.style.animation = 'logoToFooter 2s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards';
    
    // Fade out motto text quickly
    openingMottoText.style.transition = 'opacity 0.3s ease';
    openingMottoText.style.opacity = '0';
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
                
                // When first typing completes
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
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('chatTheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        toggleState = savedTheme === 'dark' ? 0 : 1;
    }
    
    // Apply theme without notification
    applyTheme(currentTheme, false); // false = don't show notification
    
    // Load chat history
    loadChatHistory();
    
    // Start opening animation
    startOpeningAnimation();
}

function applyTheme(theme, showNotification = true) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        openingOverlay.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
        
        // Only show notification if it's not initial load AND showNotification is true
        if (!isInitialThemeLoad && showNotification) {
            showTemporaryNotification("Switched to dark theme");
        }
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        openingOverlay.style.backgroundColor = 'rgba(240, 244, 248, 0.95)';
        
        // Only show notification if it's not initial load AND showNotification is true
        if (!isInitialThemeLoad && showNotification) {
            showTemporaryNotification("Switched to light theme");
        }
    }
    
    currentTheme = theme;
    localStorage.setItem('chatTheme', theme);
    
    // After first theme application, set initial load to false
    isInitialThemeLoad = false;
}

// ===== CHAT HISTORY TOGGLE FUNCTIONALITY =====
function toggleChatHistory() {
    chatHistorySidebar.classList.toggle('active');
    historyToggleBtn.classList.toggle('active');
    
    if (chatHistorySidebar.classList.contains('active')) {
        // When opening sidebar, show footer fully
        mainFooter.classList.add('initial-visible');
        showTemporaryNotification("Chat history opened");
    } else {
        // When closing sidebar, hide footer partially if not in initial animation
        if (!footerInitialAnimation) {
            mainFooter.classList.remove('initial-visible');
        }
        showTemporaryNotification("Chat history closed");
    }
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
    
    // Auto-collapse on mobile
    if (window.innerWidth <= 1300) {
        infoPanel.classList.add('collapsed');
        mobileMenuToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

// ===== NEW CHAT FUNCTIONALITY =====
function createNewChat() {
    // Clear current chat (keep only the first welcome message)
    const messages = chatMessages.querySelectorAll('.message');
    messages.forEach((msg, index) => {
        if (index > 0) msg.remove();
    });
    
    // Reset input
    messageInput.value = '';
    currentFile = null;
    autoResizeTextarea();
    
    // Show notification
    showTemporaryNotification("New chat started");
    
    // Update history
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
    // Delete all button
    deleteAllBtn.addEventListener('click', showDeleteConfirmation);
    
    // Cancel button in modal
    deleteCancelBtn.addEventListener('click', hideDeleteConfirmation);
    
    // Confirm button in modal
    deleteConfirmBtn.addEventListener('click', deleteAllHistory);
    
    // Close modal when clicking outside
    deleteConfirmationModal.addEventListener('click', (e) => {
        if (e.target === deleteConfirmationModal) {
            hideDeleteConfirmation();
        }
    });
    
    // Close modal with Escape key
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
    // Clear chat history
    chatHistory = [];
    
    // Update the history list
    updateHistoryList();
    
    // Hide confirmation modal
    hideDeleteConfirmation();
    
    // Show notification
    showTemporaryNotification("All chat history deleted");
}

function deleteSingleHistoryItem(id) {
    // Find the item index
    const index = chatHistory.findIndex(item => item.id === id);
    
    if (index !== -1) {
        // Remove the item
        const deletedItem = chatHistory.splice(index, 1)[0];
        
        // Update the history list
        updateHistoryList();
        
        // Show notification
        showTemporaryNotification(`"${deletedItem.title}" deleted`);
    }
}

// ===== CHAT HISTORY MANAGEMENT =====
function loadChatHistory() {
    // In a real app, this would load from localStorage or an API
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
        
        // Click to load chat
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
        
        // Delete button for individual item
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
    // Clear existing emojis
    emojiGrid.innerHTML = '';
    
    // Populate science emojis only
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
    
    // Add copy functionality
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
    if (userMessage.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i)) {
        return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }
    
    if (userMessage.includes('istarc') || userMessage.includes('club') || userMessage.includes('science club')) {
        const fact = istarcFacts[Math.floor(Math.random() * istarcFacts.length)];
        const scienceFact = scienceMathFacts[Math.floor(Math.random() * scienceMathFacts.length)];
        return `${fact}\n\nFun Science Fact: ${scienceFact}`;
    }
    
    if (userMessage.includes('science') || userMessage.includes('math') || userMessage.includes('physics') || 
        userMessage.includes('chemistry') || userMessage.includes('biology')) {
        const scienceResponse = scienceResponses[Math.floor(Math.random() * scienceResponses.length)];
        const scienceFact = scienceMathFacts[Math.floor(Math.random() * scienceMathFacts.length)];
        const istarcFact = istarcFacts[Math.floor(Math.random() * istarcFacts.length)];
        return `${scienceResponse}\n\n${scienceFact}\n\nISTARC Perspective: ${istarcFact}`;
    }
    
    const defaultResponses = [
        `From ISTARC's perspective, I'd approach this scientifically by first understanding the core principles involved. This aligns with our focus on practical scientific applications.\n\nDid you know? ${scienceMathFacts[Math.floor(Math.random() * scienceMathFacts.length)]}`,
        `Based on ISTARC's focus on practical science, let's break this down using the scientific method. Our club emphasizes hands-on learning through experiments and research projects.\n\nScience Fact: ${scienceMathFacts[Math.floor(Math.random() * scienceMathFacts.length)]}`,
        `As an ISTARC assistant, I encourage exploring this through experimentation and observation. We believe in 'Science in Creation, not Annihilation' - using science for constructive purposes.\n\nInteresting Fact: ${scienceMathFacts[Math.floor(Math.random() * scienceMathFacts.length)]}`,
        `ISTARC teaches us to approach problems systematically. Let's analyze this step by step using research methodologies we practice in our workshops.\n\nScientific Trivia: ${scienceMathFacts[Math.floor(Math.random() * scienceMathFacts.length)]}`,
        `Drawing from ISTARC's research methodologies, we could investigate this further through systematic inquiry. Our club has helped students develop innovative projects using similar approaches.\n\nFun Fact: ${scienceMathFacts[Math.floor(Math.random() * scienceMathFacts.length)]}`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function showError(errorMessage) {
    errorText.textContent = errorMessage;
    errorContainer.style.display = 'block';
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
}

// ===== FIXED: TOP POPUP NOTIFICATION WITH LOWER OPACITY =====
function showTemporaryNotification(message) {
    const notification = document.createElement('div');
    
    // Check current theme to apply appropriate color
    let backgroundColor, textColor;
    if (currentTheme === 'light') {
        // White gradient for light theme
        backgroundColor = 'linear-gradient(180deg, #F8FAFF 0%, #EEF2F9 100%)';
        textColor = '#1e293b'; // Dark text for white background
    } else {
        // Blue for dark theme
        backgroundColor = 'var(--accent-color)';
        textColor = 'white';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 140px; /* Position below OESTRON logo */
        left: 50%;
        transform: translateX(-50%) translateY(-30px);
        background: ${backgroundColor};
        color: ${textColor};
        padding: 12px 24px;
        border-radius: 12px;
        z-index: 10000;
        font-family: 'Exo 2', sans-serif;
        font-size: 0.95rem;
        font-weight: 500;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        white-space: nowrap;
        text-align: center;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        opacity: 0.9; /* Slightly higher opacity for better readability */
    `;
    
    // Add border color based on theme
    if (currentTheme === 'light') {
        notification.style.border = '1px solid rgba(226, 232, 240, 0.8)';
    } else {
        notification.style.border = '1px solid rgba(96, 165, 250, 0.3)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
        notification.style.opacity = '0.9'; /* Slightly higher opacity */
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
    // Theme toggle - now only changes theme
    themeToggle.addEventListener('click', () => {
        if (currentTheme === 'dark') {
            applyTheme('light', true); // true = show notification
        } else {
            applyTheme('dark', true); // true = show notification
        }
    });
    
    // History toggle button - NEW
    historyToggleBtn.addEventListener('click', toggleChatHistory);
    
    // New chat button
    newChatBtn.addEventListener('click', createNewChat);
    
    // Close history sidebar button
    closeHistoryBtn.addEventListener('click', () => {
        chatHistorySidebar.classList.remove('active');
        historyToggleBtn.classList.remove('active');
        if (!footerInitialAnimation) {
            mainFooter.classList.remove('initial-visible');
        }
        showTemporaryNotification("Chat history closed");
    });
    
    // Close sidebar when clicking outside on desktop
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 900 && 
            chatHistorySidebar.classList.contains('active') &&
            !chatHistorySidebar.contains(e.target) &&
            !historyToggleBtn.contains(e.target) &&
            !closeHistoryBtn.contains(e.target)) {
            
            chatHistorySidebar.classList.remove('active');
            historyToggleBtn.classList.remove('active');
            if (!footerInitialAnimation) {
                mainFooter.classList.remove('initial-visible');
            }
            showTemporaryNotification("Chat history closed");
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
    
    // Close emoji picker button
    emojiCloseBtn.addEventListener('click', () => {
        emojiPicker.classList.remove('active');
    });
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!emojiPicker.contains(e.target) && e.target !== emojiPickerBtn) {
            emojiPicker.classList.remove('active');
        }
    });
    
    // Initialize auto-resize
    autoResizeTextarea();
    
    // Add copy functionality to existing messages
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
            emojiPicker.style.right = '-50px';
        } else {
            emojiPicker.style.right = '0';
        }
    });
}

// ===== INITIALIZATION =====
function initializeApp() {
    initializeTheme();
    initializeEmojiPicker();
    initializeDeleteFunctionality();
    initializeMobileMenu();
    initializeEventListeners();
    
    if (window.innerWidth <= 600) {
        emojiPicker.style.right = '-50px';
    }
}

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', initializeApp);