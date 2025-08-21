// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        this.classList.add('active');
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Refresh AOS after smooth scroll to trigger animations
            setTimeout(() => {
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 800);
        }
    });
});

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Refresh AOS on scroll to ensure animations trigger properly
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Enhanced AOS refresh when scrolling up
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollTop < lastScrollTop) {
        // Scrolling up - refresh AOS more aggressively
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
            // Force refresh after a short delay to ensure animations trigger
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        }
    }
    lastScrollTop = currentScrollTop;
});

// Add loading animation for Spline iframe
window.addEventListener('load', () => {
    const iframe = document.querySelector('#home iframe');
    if (iframe) {
        iframe.style.opacity = '0';
        iframe.style.transition = 'opacity 0.8s ease';
        
        setTimeout(() => {
            iframe.style.opacity = '1';
        }, 500);
    }
});


// Show back-to-top button after hero and hide/show header on scroll
(() => {
    let lastScrollTop = 0;
    const header = document.querySelector('.navbar');
    const toTop = document.querySelector('.to-top');
    const heroSection = document.querySelector('#home');

    if (!header || !toTop || !heroSection) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroSectionOffsetTop = heroSection.offsetTop + heroSection.offsetHeight;

        if (scrollTop > heroSectionOffsetTop) {
            toTop.classList.add('active');
        } else {
            toTop.classList.remove('active');
        }

        if (scrollTop > lastScrollTop) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // avoid negative on iOS
    }, { passive: true });
})();



// Theme toggle: persist to localStorage and apply body[data-theme]
(() => {
    const STORAGE_KEY = 'theme';

    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
        const toggle = document.getElementById('theme-toggle');
        if (toggle) toggle.checked = theme === 'dark';
    }

    function initTheme() {
        let saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial = saved || (prefersDark ? 'dark' : 'light');
        setTheme(initial);

        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                const isDark = e.target.checked;
                setTheme(isDark ? 'dark' : 'light');
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();

