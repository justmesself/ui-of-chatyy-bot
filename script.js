// ===== GLOBAL VARIABLES =====
let currentTheme = 'dark';
let chatHistory = [];
let currentFile = null;
let toggleState = 0; // 0: dark, 1: light, 2: toggle history
let typingEffectActive = true;
let fullFormText = "Ideal Science & Technology\nAiming Research Council";
let typingIndex = 0;
let typingDirection = 1; // 1 for typing, -1 for deleting

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
    "ISTARC (Ideal Science & Technology Aiming Research Council) was established in 2018.",
    "We have organized over 50 workshops and science festivals since our inception.",
    "Our club has more than 500 active student members passionate about science.",
    "ISTARC focuses on 'Science in Creation, not Annihilation' as our core philosophy.",
    "We are part of Ideal Science College, promoting scientific thinking among students.",
    "Our events include hands-on experiments, research competitions, and tech workshops.",
    "ISTARC encourages students to participate in national and international science fairs.",
    "We believe in practical learning and applying scientific methods to real-world problems."
];

// Greeting responses
const greetingResponses = [
    "Hello! I'm OESTRON, your science assistant from ISTARC. How can I help you explore science today?",
    "Hi there! Ready to dive into some scientific exploration? I'm here to assist with all your science and tech questions.",
    "Greetings! As part of ISTARC, I'm excited to help you with research, experiments, or any scientific concepts you want to explore.",
    "Welcome! I'm OESTRON from ISTARC - your gateway to understanding science and technology in creative ways.",
    "Hello! Science awaits! I'm here to help you with projects, research, or just satisfying your scientific curiosity."
];

// Science responses
const scienceResponses = [
    "Based on scientific principles, I'd suggest...",
    "From a research perspective, we could approach this by...",
    "The scientific method teaches us to...",
    "In laboratory settings, this would be tested by...",
    "Research shows that the most effective approach is..."
];

// ===== DOM ELEMENT REFERENCES =====
const themeToggle = document.getElementById('themeToggle');
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
const copyChatButton = document.getElementById('copyChatButton');
const typingIndicator = document.getElementById('typingIndicator');
const loadingContainer = document.getElementById('loadingContainer');
const errorContainer = document.getElementById('errorContainer');
const errorText = document.getElementById('errorText');
const fileUploadProgress = document.getElementById('fileUploadProgress');
const progressFill = document.getElementById('progressFill');
const progressPercentage = document.getElementById('progressPercentage');
const fileName = document.getElementById('fileName');
const filePreviewModal = document.getElementById('filePreviewModal');
const previewCloseBtn = document.getElementById('previewCloseBtn');
const closePreviewBtn = document.getElementById('closePreviewBtn');
const downloadPreviewBtn = document.getElementById('downloadPreviewBtn');
const previewFileName = document.getElementById('previewFileName');
const previewFileSize = document.getElementById('previewFileSize');
const previewFileIcon = document.getElementById('previewFileIcon');
const previewBody = document.getElementById('previewBody');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const typingText = document.getElementById('typingText');
const emojiCloseBtn = document.getElementById('emojiCloseBtn');

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

// ===== TYPING EFFECT FOR ISTARC FULL FORM =====
function startTypingEffect() {
    setInterval(() => {
        if (!typingEffectActive) return;
        
        if (typingDirection === 1) {
            // Typing forward
            if (typingIndex <= fullFormText.length) {
                typingText.textContent = fullFormText.substring(0, typingIndex);
                typingIndex++;
            } else {
                // Pause at the end
                setTimeout(() => {
                    typingDirection = -1;
                }, 2000);
            }
        } else {
            // Deleting backward
            if (typingIndex >= 0) {
                typingText.textContent = fullFormText.substring(0, typingIndex);
                typingIndex--;
            } else {
                // Pause at the beginning
                setTimeout(() => {
                    typingDirection = 1;
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
    
    // Apply theme
    applyTheme(currentTheme);
    
    // Load chat history
    loadChatHistory();
    
    // Start typing effect
    startTypingEffect();
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
    currentTheme = theme;
    localStorage.setItem('chatTheme', theme);
}

function handleThemeToggle() {
    toggleState++;
    
    if (toggleState === 1) {
        // First click: switch to light theme
        applyTheme('light');
        showTemporaryNotification("Switched to light theme");
    } else if (toggleState === 2) {
        // Second click: toggle chat history
        chatHistorySidebar.classList.toggle('active');
        
        if (chatHistorySidebar.classList.contains('active')) {
            showTemporaryNotification("Chat history opened");
        } else {
            showTemporaryNotification("Chat history closed");
        }
        
        // Reset toggle state after history toggle
        toggleState = 0;
        // Switch back to dark theme for next cycle
        applyTheme('dark');
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
        title: `Chat ${new Date().getHours()}:${new Date().getMinutes()}`,
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
            // Don't trigger if clicking delete button
            if (!e.target.closest('.history-item-delete')) {
                // Remove active class from all items
                document.querySelectorAll('.history-item').forEach(el => {
                    el.classList.remove('active');
                });
                
                // Add active class to clicked item
                historyItem.classList.add('active');
                
                // Update active state in data
                chatHistory.forEach(chat => chat.active = chat.id === item.id);
                
                // In a real app, this would load the selected chat
                showTemporaryNotification(`Loading: ${item.title}`);
            }
        });
        
        // Delete button for individual item
        const deleteBtn = historyItem.querySelector('.history-item-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the parent click
            const id = parseInt(e.currentTarget.dataset.id);
            
            // Show confirmation for single item
            if (confirm(`Delete "${item.title}" from history?`)) {
                deleteSingleHistoryItem(id);
            }
        });
        
        chatHistoryList.appendChild(historyItem);
    });
}

// ===== EMOJI PICKER =====
function initializeEmojiPicker() {
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
    
    // Auto-resize textarea
    autoResizeTextarea();
}

// ===== CHAT FUNCTIONALITY =====
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    const maxHeight = 200; // 10 lines * 20px per line
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
    
    // Add copy functionality to the button
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
    
    // Add click event to file attachment if present
    if (fileAttached) {
        const fileAttachment = messageDiv.querySelector('.file-attachment');
        fileAttachment.addEventListener('click', () => {
            previewFile(fileAttached);
        });
    }
    
    // Scroll to the new message
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
    
    return messageDiv;
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message && !currentFile) return;
    
    // Add user message to chat
    addMessage(message, true, currentFile);
    
    // Clear input and reset file
    messageInput.value = '';
    currentFile = null;
    autoResizeTextarea();
    
    // Show typing indicator
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate AI processing delay
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        
        // Simulate occasional error
        if (Math.random() < 0.05) {
            showError("Hmm, my scientific circuits need recalibration! Let me try that again...");
            return;
        }
        
        // Generate AI response based on message content
        let response = generateResponse(message.toLowerCase());
        
        // Add AI response
        addMessage(response, false);
        
        // Update chat history
        const activeChat = chatHistory.find(item => item.active);
        if (activeChat) {
            // Update date of active chat
            activeChat.date = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            
            // Update chat title from first few words
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
    // Check for greetings
    if (userMessage.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i)) {
        return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }
    
    // Check for ISTARC related questions
    if (userMessage.includes('istarc') || userMessage.includes('club') || userMessage.includes('science club')) {
        const fact = istarcFacts[Math.floor(Math.random() * istarcFacts.length)];
        return `As part of ISTARC, ${fact.toLowerCase()} ${scienceResponses[Math.floor(Math.random() * scienceResponses.length)]}`;
    }
    
    // Check for science/tech questions
    if (userMessage.includes('science') || userMessage.includes('tech') || userMessage.includes('research') || 
        userMessage.includes('experiment') || userMessage.includes('project')) {
        const scienceResponse = scienceResponses[Math.floor(Math.random() * scienceResponses.length)];
        const fact = istarcFacts[Math.floor(Math.random() * istarcFacts.length)];
        return `${scienceResponse} This aligns with ISTARC's approach where ${fact.toLowerCase()}`;
    }
    
    // Default response with ISTARC context
    const defaultResponses = [
        `From ISTARC's perspective, I'd approach this scientifically by first understanding the core principles involved.`,
        `Based on ISTARC's focus on practical science, let's break this down using the scientific method.`,
        `As an ISTARC assistant, I encourage exploring this through experimentation and observation.`,
        `ISTARC teaches us to approach problems systematically. Let's analyze this step by step.`,
        `Drawing from ISTARC's research methodologies, we could investigate this further by...`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function showError(errorMessage) {
    errorText.textContent = errorMessage;
    errorContainer.style.display = 'block';
    
    // Scroll error into view
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
}

function showTemporaryNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: var(--accent-color);
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        z-index: 10000;
        font-family: 'Exo 2', sans-serif;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        white-space: nowrap;
        text-shadow: none;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Animate out and remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
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
    
    // Show upload progress
    simulateFileUpload(file);
    
    // Show notification
    showTemporaryNotification(`"${file.name}" attached`);
}

function simulateFileUpload(file) {
    fileUploadProgress.style.display = 'block';
    fileName.textContent = file.name;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = `${progress}%`;
        progressPercentage.textContent = `${Math.round(progress)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Hide progress bar after a delay
            setTimeout(() => {
                fileUploadProgress.style.display = 'none';
                progressFill.style.width = '0%';
                progressPercentage.textContent = '0%';
            }, 1000);
        }
    }, 200);
}

function previewFile(file) {
    previewFileName.textContent = file.name;
    previewFileSize.textContent = file.size;
    
    // Set appropriate icon
    let iconClass = 'fa-file';
    if (file.type === 'pdf') iconClass = 'fa-file-pdf';
    if (file.type === 'image') iconClass = 'fa-file-image';
    if (file.type === 'text') iconClass = 'fa-file-alt';
    
    previewFileIcon.className = `fas ${iconClass}`;
    
    // Generate preview content
    let previewContent = '';
    if (file.type === 'image') {
        previewContent = `<img src="https://via.placeholder.com/500x300/2a4b7c/ffffff?text=Preview+of+${encodeURIComponent(file.name)}" alt="${file.name}" class="preview-image">`;
    } else if (file.type === 'pdf') {
        previewContent = `<div class="preview-text">[PDF Preview] "${file.name}"\n\nThis is a simulated preview of the PDF document. In a real application, this would show actual PDF content.\n\nFile size: ${file.size}\n\nISTARC documents often contain research papers, workshop materials, and scientific findings.</div>`;
    } else {
        previewContent = `<div class="preview-text">File: ${file.name}\nType: ${file.type.toUpperCase()}\nSize: ${file.size}\n\nThis file has been attached to the chat. You can download it for offline access.</div>`;
    }
    
    previewBody.innerHTML = previewContent;
    
    // Show modal
    filePreviewModal.classList.add('active');
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
    // Theme toggle with special behavior
    themeToggle.addEventListener('click', handleThemeToggle);
    
    // New chat button
    newChatBtn.addEventListener('click', createNewChat);
    
    // Close history sidebar
    closeHistoryBtn.addEventListener('click', () => {
        chatHistorySidebar.classList.remove('active');
        showTemporaryNotification("Chat history closed");
    });
    
    // Message input
    messageInput.addEventListener('input', autoResizeTextarea);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
        
        // Auto-resize as user types
        autoResizeTextarea();
    });
    
    // Send button
    sendButton.addEventListener('click', sendMessage);
    
    // Attach file button
    attachFileBtn.addEventListener('click', () => {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.jpg,.jpeg,.png,.txt,.doc,.docx';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', handleFileSelect);
        
        // Trigger file selection
        document.body.appendChild(fileInput);
        fileInput.click();
        
        // Clean up
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
    
    // File preview modal
    previewCloseBtn.addEventListener('click', () => {
        filePreviewModal.classList.remove('active');
    });
    
    closePreviewBtn.addEventListener('click', () => {
        filePreviewModal.classList.remove('active');
    });
    
    downloadPreviewBtn.addEventListener('click', () => {
        showTemporaryNotification("Download started (simulated)");
        setTimeout(() => {
            filePreviewModal.classList.remove('active');
        }, 500);
    });
    
    // Close modal when clicking outside
    filePreviewModal.addEventListener('click', (e) => {
        if (e.target === filePreviewModal) {
            filePreviewModal.classList.remove('active');
        }
    });
    
    // Close history sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1100 && 
            !chatHistorySidebar.contains(e.target) && 
            !themeToggle.contains(e.target) && 
            chatHistorySidebar.classList.contains('active')) {
            
            // Don't close if clicking on the new chat button
            if (e.target !== newChatBtn && !newChatBtn.contains(e.target)) {
                chatHistorySidebar.classList.remove('active');
            }
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
}

// ===== INITIALIZATION =====
function initializeApp() {
    initializeTheme();
    initializeEmojiPicker();
    initializeDeleteFunctionality();
    initializeEventListeners();
    
    // Add sample file attachment click handlers
    document.querySelectorAll('.file-attachment').forEach(attachment => {
        attachment.addEventListener('click', function() {
            const fileName = this.getAttribute('data-file');
            const fileSize = this.getAttribute('data-size');
            
            previewFile({
                name: fileName,
                size: fileSize,
                type: getFileType(fileName)
            });
        });
    });
    
    // Show a welcome notification
    setTimeout(() => {
        showTemporaryNotification("Welcome to OESTRON - ISTARC's Science Assistant!");
    }, 1500);
}

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', initializeApp);