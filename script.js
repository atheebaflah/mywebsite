// 1. Matrix Digital Background Grid Effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const chars = "010101ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}?/\\=+";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#10b981';
    ctx.font = fontSize + 'px monospace';
    
    for(let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 45);

// 2. High-Performance Typewriter Mechanism
const phrases = [
    "distributed APIs.",
    "knowledge graphs.",
    "concurrent ETL architectures.",
    "production software systems."
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function handleTypewriter() {
    const currentPhrase = phrases[phraseIdx];
    if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
    } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
    }

    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentPhrase.length) {
        typingSpeed = 2000; // Pause at end of phrase
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typingSpeed = 300; // Micro pause before next phrase
    }

    setTimeout(handleTypewriter, typingSpeed);
}
document.addEventListener('DOMContentLoaded', () => setTimeout(handleTypewriter, 1000));

// 3. Intersection Observer Scroll Reveal Engine
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Trigger logic only once
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px"
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// 4. Reactive 3D Parallax Card Tilting Effect
const cards = document.querySelectorAll('[data-tilt]');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        
        const angleX = (yc - y) / 25; // Tilt limitation matrix
        const angleY = (x - xc) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-4px)`;
        card.style.boxShadow = `${-angleY * 2}px ${angleX * 2}px 25px rgba(16, 185, 129, 0.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.boxShadow = 'none';
    });
});

// 5. Active Header Dynamic Blur state
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.remove('h-20');
        navbar.classList.add('h-16', 'shadow-2xl', 'shadow-slate-950/20');
    } else {
        navbar.classList.remove('h-16', 'shadow-2xl', 'shadow-slate-950/20');
        navbar.classList.add('h-20');
    }
});