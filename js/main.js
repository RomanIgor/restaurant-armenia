/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const fab = document.getElementById('fab');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 80);
    fab.style.display = y > 80 ? 'flex' : 'none';
});

function openNav() {
    navLinks.classList.add('open');
    navToggle.classList.add('open');
    navBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeNav() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navBackdrop.classList.remove('open');
    document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeNav() : openNav();
});
navBackdrop.addEventListener('click', closeNav);
navLinks.addEventListener('click', (e) => {
    if (e.target === navLinks || e.target.tagName === 'UL') closeNav();
});
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
});

/* ===== SCROLL ANIMATIONS ===== */
try {
    const fadeEls = document.querySelectorAll('.fade-up');
    fadeEls.forEach(el => el.classList.add('will-animate'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
        });
    }, { threshold: 0.08 });
    fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        } else {
            observer.observe(el);
        }
    });
} catch(e) {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
}

/* ===== GALLERY TABS ===== */
function applyGalleryFilter(filter) {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.toggle('hidden', item.dataset.category !== filter);
    });
}
applyGalleryFilter('restaurant');
document.querySelectorAll('.gallery-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        applyGalleryFilter(tab.dataset.filter);
    });
});

/* ===== MENU TABS ===== */
document.getElementById('menuTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-tab');
    if (!btn) return;
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
});

/* ===== LIGHTBOX ===== */
const images = ['food_images/20.jpeg','5.jpeg','10.jpeg','food_images/13.jpeg','1.jpeg','food_images/12.jpeg'];
let currentImg = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(idx) {
    currentImg = idx;
    lightboxImg.src = images[idx];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}
function lightboxPrev() {
    currentImg = (currentImg - 1 + images.length) % images.length;
    lightboxImg.src = images[currentImg];
}
function lightboxNext() {
    currentImg = (currentImg + 1) % images.length;
    lightboxImg.src = images[currentImg];
}
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
});

/* ===== SMART RESERVATION FORM ===== */
const dateSelect = document.getElementById('date');
const timeSelect = document.getElementById('time');
const adultsSelect = document.getElementById('adults');
const childrenSelect = document.getElementById('children');
const depositWarning = document.getElementById('depositWarning');

(function populateDates() {
    const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const today = new Date();
    for (let i = 1; i <= 90; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const day = d.getDay();
        if (day !== 5 && day !== 6 && day !== 0) continue;
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        const opt = document.createElement('option');
        opt.value = `${yyyy}-${mm}-${dd}`;
        opt.textContent = `${dayNames[day]}, ${dd}.${mm}.${yyyy}`;
        dateSelect.appendChild(opt);
    }
})();

function buildTimeSlots(day) {
    timeSelect.innerHTML = '<option value="">Uhrzeit wählen</option>';
    const slots = [];
    if (day === 5) {
        for (let h = 17; h <= 21; h++) {
            slots.push(`${h}:00`);
            if (h < 21) slots.push(`${h}:30`);
        }
        slots.push('21:30');
    } else {
        for (let h = 11; h <= 21; h++) {
            if (h === 11) { slots.push('11:30'); continue; }
            slots.push(`${h}:00`);
            if (h < 21) slots.push(`${h}:30`);
        }
        slots.push('21:30');
    }
    slots.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s; opt.textContent = s + ' Uhr';
        timeSelect.appendChild(opt);
    });
}

dateSelect.addEventListener('change', function() {
    const val = this.value;
    if (!val) { timeSelect.innerHTML = '<option value="">Bitte Datum wählen</option>'; return; }
    const day = new Date(val + 'T12:00:00').getDay();
    buildTimeSlots(day);
});

function checkDeposit() {
    const adults = parseInt(adultsSelect.value) || 0;
    const children = parseInt(childrenSelect.value) || 0;
    depositWarning.style.display = (adults + children >= 10) ? 'block' : 'none';
}
adultsSelect.addEventListener('change', checkDeposit);
childrenSelect.addEventListener('change', checkDeposit);

/* ===== CONTACT FORM ===== */
function handleSubmit(e) {
    e.preventDefault();
    document.getElementById('formSuccess').style.display = 'block';
    e.target.reset();
    dateSelect.value = '';
    timeSelect.innerHTML = '<option value="">Bitte Datum wählen</option>';
    depositWarning.style.display = 'none';
    setTimeout(() => { document.getElementById('formSuccess').style.display = 'none'; }, 6000);
}

/* ===== HERO PARALLAX (subtle) ===== */
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.15}px)`;
    }
}, { passive: true });
