// DOM Elements
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const translateBtn = document.getElementById('translate-btn');
const clearInputBtn = document.getElementById('clear-input');
const copyBtn = document.getElementById('copy-btn');
const clearAllBtn = document.getElementById('clear-all');
const loadingDiv = document.getElementById('loading');
const inputCharCount = document.getElementById('input-char-count');
const outputCharCount = document.getElementById('output-char-count');
const statusIndicator = document.getElementById('status-indicator');

// Update character counts with animation
function updateCharCounts() {
    const inputLength = inputText.value.length;
    const outputLength = outputText.value.length;
    
    inputCharCount.textContent = `${inputLength} character${inputLength !== 1 ? 's' : ''}`;
    outputCharCount.textContent = `${outputLength} character${outputLength !== 1 ? 's' : ''}`;
    
    // Enable/disable translate button
    translateBtn.disabled = inputLength === 0;
    
    // Update status indicator
    updateStatus();
}

// Update status indicator
function updateStatus() {
    if (inputText.value.length === 0) {
        statusIndicator.innerHTML = '<i class="fas fa-circle" style="color: #718096; font-size: 0.6rem; margin-right: 6px;"></i> Enter text to begin';
    } else if (outputText.value.length === 0) {
        statusIndicator.innerHTML = '<i class="fas fa-circle" style="color: #ed8936; font-size: 0.6rem; margin-right: 6px;"></i> Ready to translate';
    } else {
        statusIndicator.innerHTML = '<i class="fas fa-circle" style="color: #48bb78; font-size: 0.6rem; margin-right: 6px;"></i> Translation complete';
    }
}

// Enhanced loading state with animation
function showLoading() {
    loadingDiv.style.display = 'flex';
    translateBtn.disabled = true;
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    statusIndicator.innerHTML = '<i class="fas fa-circle" style="color: #667eea; font-size: 0.6rem; margin-right: 6px;"></i> Translating...';
    
    // Add pulsing animation to button
    translateBtn.style.animation = 'pulse 1.5s infinite';
}

// Hide loading state
function hideLoading() {
    loadingDiv.style.display = 'none';
    translateBtn.disabled = inputText.value.length === 0;
    translateBtn.innerHTML = '<i class="fas fa-bolt"></i> Translate Now';
    translateBtn.style.animation = '';
    updateStatus();
}

// Your backend API call (KEPT INTACT)
async function translateWithBackend(text) {
  const API_URL = "http://localhost:8080/restTranslaor/translator/ask";

  const body = new URLSearchParams();
  body.append("text", text);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: body.toString()
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`HTTP ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.translation;
}

// Handle translate button click with enhanced visual feedback
translateBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    if (!text) return;
    
    showLoading();
    
    try {
        // Use your backend API call
        const translation = await translateWithBackend(text);
        
        outputText.value = translation;
        copyBtn.disabled = false;
        updateCharCounts();
        
        // Add success animation to output textarea
        outputText.style.animation = 'pulseSuccess 0.6s';
        setTimeout(() => {
            outputText.style.animation = '';
        }, 600);
        
    } catch (error) {
        console.error('Translation error:', error);
        outputText.value = '⚠️ Error: Could not translate text. Please check your connection and try again.';
        statusIndicator.innerHTML = '<i class="fas fa-circle" style="color: #f56565; font-size: 0.6rem; margin-right: 6px;"></i> Translation failed';
    } finally {
        hideLoading();
    }
});

// Enhanced clear input with animation
clearInputBtn.addEventListener('click', () => {
    if (!inputText.value) return;
    
    // Add fade out animation
    inputText.style.opacity = '0.5';
    setTimeout(() => {
        inputText.value = '';
        inputText.style.opacity = '1';
        updateCharCounts();
        translateBtn.disabled = true;
        inputText.focus(); // Keep focus on input
    }, 200);
});

// Enhanced copy with modern feedback
copyBtn.addEventListener('click', async () => {
    if (!outputText.value) return;
    
    try {
        await navigator.clipboard.writeText(outputText.value);
        
        // Enhanced visual feedback
        const originalHTML = copyBtn.innerHTML;
        const originalGradient = copyBtn.style.background;
        
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        copyBtn.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.4)';
        
        // Add subtle scale animation
        copyBtn.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = originalGradient;
            copyBtn.style.transform = '';
            copyBtn.style.boxShadow = '';
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy:', err);
        copyBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
        copyBtn.style.background = 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-clipboard"></i> Copy';
            copyBtn.style.background = '';
        }, 2000);
    }
});

// Enhanced clear all with animation
clearAllBtn.addEventListener('click', () => {
    if (!inputText.value && !outputText.value) return;
    
    // Add shrink animations
    inputText.style.transform = 'scale(0.98)';
    outputText.style.transform = 'scale(0.98)';
    inputText.style.opacity = '0.7';
    outputText.style.opacity = '0.7';
    
    setTimeout(() => {
        inputText.value = '';
        outputText.value = '';
        inputText.style.transform = '';
        outputText.style.transform = '';
        inputText.style.opacity = '1';
        outputText.style.opacity = '1';
        copyBtn.disabled = true;
        updateCharCounts();
        translateBtn.disabled = true;
        inputText.focus(); // Return focus to input
    }, 200);
});

// Update character count on input with debounce for better performance
let inputTimeout;
inputText.addEventListener('input', () => {
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(updateCharCounts, 300);
});

// Add animation keyframes for enhanced effects
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: translateY(-2px) scale(1); }
        50% { transform: translateY(-2px) scale(1.02); }
        100% { transform: translateY(-2px) scale(1); }
    }
    
    @keyframes pulseSuccess {
        0% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
        100% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes buttonPress {
        0% { transform: scale(1); }
        50% { transform: scale(0.96); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Initialize on load with animations
document.addEventListener('DOMContentLoaded', () => {
    updateCharCounts();
    inputText.focus();
    
    // Add entrance animations to elements
    document.querySelectorAll('.text-container, .translate-btn, .clear-all-btn').forEach((el, i) => {
        el.style.animation = `fadeInUp 0.6s ease-out ${i * 0.1}s both`;
    });
});

// Enhanced keyboard shortcut with visual feedback
inputText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (!translateBtn.disabled) {
            // Add button press animation
            translateBtn.style.animation = 'buttonPress 0.2s ease-out';
            setTimeout(() => {
                translateBtn.style.animation = '';
                translateBtn.click();
            }, 200);
        }
    }
});

// Add focus animation for textareas
inputText.addEventListener('focus', () => {
    inputText.parentElement.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.15)';
});

inputText.addEventListener('blur', () => {
    inputText.parentElement.style.boxShadow = '';
});

outputText.addEventListener('focus', () => {
    outputText.parentElement.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.15)';
});

outputText.addEventListener('blur', () => {
    outputText.parentElement.style.boxShadow = '';
});

// Auto-resize textareas based on content
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

inputText.addEventListener('input', () => {
    autoResize(inputText);
});

// Initialize textarea heights
setTimeout(() => {
    autoResize(inputText);
    autoResize(outputText);
}, 100);