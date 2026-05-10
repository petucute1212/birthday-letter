// ============================================================================
// BIRTHDAY CARD - INTERACTIVE ANIMATION
// ============================================================================

// DOM Elements
const openBtn = document.getElementById('openBtn');
const sceneContainer = document.querySelector('.scene-container');
const letterElement = document.getElementById('letter');
const envelopeWrapper = document.getElementById('envelope');
const particlesContainer = document.getElementById('particles-container');
const typingText = document.getElementById('typingText');
const easterEgg = document.getElementById('easterEgg');

// Audio
const bgMusic = new Audio('assets/music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0;

// State
let isOpen = false;
let mouseClickCount = 0;
let isAnimating = false;

// Confetti colors
const CONFETTI_COLORS = [
    '#ff0a54',
    '#ff477e',
    '#ff7096',
    '#7b2cbf',
    '#00bbf9',
    '#00f5d4',
    '#fee440'
];

// Birthday message for typing effect
const BIRTHDAY_MESSAGE = `Chúc chị Mai sinh nhật vui vẻ ^^\n "Bạn đã chính thức nhận được \n chứng nhận người dàààààà \n dễ thương nhất của năm"`;

// ============================================================================
// MAIN EVENT LISTENER
// ============================================================================

openBtn.addEventListener('click', handleEnvelopeClick);
envelopeWrapper.addEventListener('click', handleEnvelopeClickDirect);

function handleEnvelopeClick() {
    if (isAnimating) return;
    
    if (!isOpen) {
        openEnvelope();
    } else {
        closeEnvelope();
    }
}

function handleEnvelopeClickDirect(e) {
    if (isOpen) return;
    mouseClickCount++;
    
    if (mouseClickCount >= 5) {
        showEasterEgg();
        mouseClickCount = 0;
    }
}

// ============================================================================
// MAIN ENVELOPE OPENING SEQUENCE
// ============================================================================

function openEnvelope() {
    if (isAnimating) return;
    isAnimating = true;
    isOpen = true;
    
    // Change button text
    openBtn.innerText = "Đang mở...";
    openBtn.disabled = true;
    
    // Shake animation
    setTimeout(() => {
        envelopeWrapper.classList.add('shaking');
    }, 100);
    
    // Remove shake and add open class
    setTimeout(() => {
        envelopeWrapper.classList.remove('shaking');
        sceneContainer.classList.add('open');
        
        // Camera shake when confetti bursts
        triggerCameraShake();
        
        // Burst confetti
        burstConfetti();
        
        // Fade in music
        fadeInMusic();
        
        // Update button
        openBtn.innerText = "Đóng thư";
        openBtn.disabled = false;
    }, 1200);
    
    // Start falling confetti
    const fallingInterval = setInterval(() => {
        createFallingConfetti();
    }, 150);
    
    // Start animated falling particles
    const particleInterval = setInterval(() => {
        createFloatingParticle();
    }, 200);
    
    // Type text
    setTimeout(() => {
        typeMessage();
    }, 1500);
    
    // Store intervals for cleanup
    openBtn.fallingInterval = fallingInterval;
    openBtn.particleInterval = particleInterval;
    
    setTimeout(() => {
        isAnimating = false;
    }, 2000);
}

function closeEnvelope() {
    if (isAnimating) return;
    isAnimating = true;
    isOpen = false;
    
    openBtn.disabled = true;
    openBtn.innerText = "Đang đóng...";
    
    // Clear intervals
    clearInterval(openBtn.fallingInterval);
    clearInterval(openBtn.particleInterval);
    
    // Remove open state
    sceneContainer.classList.remove('open');
    
    // Reset text
    typingText.innerText = '';
    
    // Fade out music
    fadeOutMusic();
    
    // Reset button
    setTimeout(() => {
        openBtn.innerText = "Mở thư";
        openBtn.disabled = false;
        isAnimating = false;
        mouseClickCount = 0;
    }, 800);
}

// ============================================================================
// TYPING EFFECT
// ============================================================================

function typeMessage() {
    let charIndex = 0;
    typingText.innerText = '';
    
    function typeNextChar() {
        if (charIndex < BIRTHDAY_MESSAGE.length) {
            const char = BIRTHDAY_MESSAGE[charIndex];
            typingText.innerText += char;
            charIndex++;
            
            // Variable speed for natural typing
            const delay = Math.random() * 30 + 20;
            setTimeout(typeNextChar, delay);
        }
    }
    
    typeNextChar();
}

// ============================================================================
// CONFETTI ANIMATIONS
// ============================================================================

function burstConfetti() {
    // Create burst of confetti from center
    for (let i = 0; i < 80; i++) {
        createExplosionParticle();
    }
}

function createExplosionParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle', 'explode');
    
    // Random color
    particle.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    
    // Random size (3-10px)
    const size = Math.random() * 7 + 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Start from center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    
    // Random direction and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 400 + 100;
    
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    particle.style.setProperty('--x', `${x}px`);
    particle.style.setProperty('--y', `${y}px`);
    
    particlesContainer.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, 2600);
}

function createFallingConfetti() {
    const particle = document.createElement('div');
    particle.classList.add('particle', 'falling');
    
    // Random color
    particle.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    
    // Random size (2-6px)
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random horizontal position
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = '-20px';
    
    particlesContainer.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, 5100);
}

function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle', 'floating');
    
    // Random color with higher opacity
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    particle.style.background = color;
    particle.style.opacity = '0.6';
    
    // Larger size
    const size = Math.random() * 5 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random position
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    
    // Random animation duration
    const duration = Math.random() * 3 + 4;
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    particlesContainer.appendChild(particle);
    
    // Remove after animation completes
    setTimeout(() => {
        particle.remove();
    }, (duration + 2) * 1000);
}

// ============================================================================
// CAMERA SHAKE EFFECT
// ============================================================================

function triggerCameraShake() {
    sceneContainer.classList.add('shake');
    
    setTimeout(() => {
        sceneContainer.classList.remove('shake');
    }, 200);
}

// ============================================================================
// MUSIC FADE IN/OUT
// ============================================================================

function fadeInMusic() {
    bgMusic.play();
    
    let currentVolume = 0;
    const targetVolume = 0.4;
    const step = targetVolume / 30; // 30 steps = ~300ms fade
    
    const fadeInterval = setInterval(() => {
        currentVolume += step;
        if (currentVolume >= targetVolume) {
            bgMusic.volume = targetVolume;
            clearInterval(fadeInterval);
        } else {
            bgMusic.volume = currentVolume;
        }
    }, 10);
}

function fadeOutMusic() {
    const currentVolume = bgMusic.volume;
    const step = currentVolume / 20; // 20 steps = ~200ms fade
    
    const fadeInterval = setInterval(() => {
        bgMusic.volume -= step;
        if (bgMusic.volume <= 0) {
            bgMusic.volume = 0;
            bgMusic.pause();
            bgMusic.currentTime = 0;
            clearInterval(fadeInterval);
        }
    }, 10);
}

// ============================================================================
// EASTER EGG
// ============================================================================

function showEasterEgg() {
    easterEgg.style.display = 'block';
    easterEgg.classList.remove('fade-out');
    easterEgg.classList.add('fade-out');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        easterEgg.style.display = 'none';
    }, 2600);
}

// ============================================================================
// INITIAL FLOATING PARTICLES (on page load)
// ============================================================================

function initializeFloatingParticles() {
    // Create initial floating particles for depth
    for (let i = 0; i < 16; i++) {
        setTimeout(() => {
            createFloatingParticle();
        }, i * 150);
    }
}

// Start when page loads
window.addEventListener('load', () => {
    initializeFloatingParticles();
});

// ============================================================================
// RESPONSIVE HANDLING
// ============================================================================

window.addEventListener('resize', () => {
    // Reposition particles container if needed
    // Most animations are reactive by design
});
