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
const images = [
    '1.jpeg','5.jpeg','10.jpeg','11.jpeg',
    'food_images/20.jpeg','food_images/13.jpeg','food_images/27.jpeg',
    'food_images/35.jpeg','food_images/28.jpeg','food_images/33.jpeg',
    'food_images/30.jpeg','food_images/34.jpeg','food_images/32.jpeg'
];
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
        // Freitag: 17:00 – 22:00
        for (let h = 17; h <= 21; h++) {
            slots.push(`${String(h).padStart(2,'0')}:00`);
            slots.push(`${String(h).padStart(2,'0')}:30`);
        }
        slots.push('22:00');
    } else {
        // Samstag / Sonntag: 11:30 – 22:00
        slots.push('11:30');
        for (let h = 12; h <= 21; h++) {
            slots.push(`${String(h).padStart(2,'0')}:00`);
            slots.push(`${String(h).padStart(2,'0')}:30`);
        }
        slots.push('22:00');
    }
    slots.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s; opt.textContent = s + ' Uhr';
        timeSelect.appendChild(opt);
    });
}

function onDateChange() {
    const val = dateSelect.value;
    if (!val) { timeSelect.innerHTML = '<option value="">Uhrzeit wählen</option>'; return; }
    const day = new Date(val + 'T12:00:00').getDay();
    buildTimeSlots(day);
}

// 'input' as fallback for iOS Safari where 'change' may not fire
dateSelect.addEventListener('change', onDateChange);
dateSelect.addEventListener('input', onDateChange);

function checkDeposit() {
    const adults = parseInt(adultsSelect.value) || 0;
    const children = parseInt(childrenSelect.value) || 0;
    depositWarning.style.display = (adults + children >= 10) ? 'block' : 'none';
}
adultsSelect.addEventListener('change', checkDeposit);
childrenSelect.addEventListener('change', checkDeposit);

/* ===== CONTACT FORM ===== */
(function() {
    var form = document.getElementById('contactForm');
    var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    if (!form || !submitBtn) return;

    var FIELDS = [
        { id: 'name',   label: 'Name' },
        { id: 'phone',  label: 'Telefon' },
        { id: 'email',  label: 'E-Mail' },
        { id: 'date',   label: 'Datum' },
        { id: 'time',   label: 'Uhrzeit' },
        { id: 'adults', label: 'Erwachsene' }
    ];

    function clearErrors() {
        var banner = document.getElementById('formErrorBanner');
        if (banner) banner.parentNode.removeChild(banner);
        for (var i = 0; i < FIELDS.length; i++) {
            var el = document.getElementById(FIELDS[i].id);
            if (el) {
                el.style.border = '';
                el.style.background = '';
            }
        }
    }

    function validate() {
        clearErrors();
        var missing = [];
        for (var i = 0; i < FIELDS.length; i++) {
            var el = document.getElementById(FIELDS[i].id);
            if (!el) continue;
            if (!el.value || el.value === '') {
                missing.push(FIELDS[i].label);
                el.style.cssText += '; border: 2px solid #c0392b !important; background: #fff5f5 !important;';
            }
        }
        if (missing.length > 0) {
            var banner = document.createElement('div');
            banner.id = 'formErrorBanner';
            banner.style.cssText = 'background:#c0392b;color:#fff;padding:14px 16px;border-radius:6px;margin-bottom:16px;font-size:14px;font-weight:600;line-height:1.5;';
            banner.innerHTML = '&#9888; Bitte folgende Felder ausf&uuml;llen: <strong>' + missing.join(', ') + '</strong>';
            form.insertBefore(banner, form.firstChild);
            banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }
        return true;
    }

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!validate()) return;
        document.getElementById('formSuccess').style.display = 'block';
        form.reset();
        clearErrors();
        dateSelect.value = '';
        timeSelect.innerHTML = '<option value="">Uhrzeit w\u00e4hlen</option>';
        depositWarning.style.display = 'none';
        setTimeout(function() {
            document.getElementById('formSuccess').style.display = 'none';
        }, 6000);
    });

    form.addEventListener('submit', function(e) { e.preventDefault(); });
}());

/* ===== HERO PARALLAX (subtle) ===== */
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.15}px)`;
    }
}, { passive: true });
