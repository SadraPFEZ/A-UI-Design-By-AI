/* ========================================
   MedEquip Pro - JavaScript Functionality
   Persian RTL Landing Page
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Preloader.init();
    Navigation.init();
    ScrollEffects.init();
    ScrollAnimations.init();
    ParallaxEffects.init();
    HeroStats.init();
    ProductFilter.init();
    TestimonialsSlider.init();
    ContactForm.init();
    MagneticButtons.init();
    CursorEffects.init();
});

/* ==================== Preloader ==================== */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Enable scrolling
                document.body.style.overflow = '';
            }, 500);
        });

        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';
    }
};

/* ==================== Navigation ==================== */
const Navigation = {
    init() {
        this.header = document.getElementById('header');
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.navClose = document.getElementById('nav-close');
        this.navOverlay = document.getElementById('nav-overlay');
        this.navLinks = document.querySelectorAll('.nav__link');

        this.bindEvents();
        this.highlightActiveLink();
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.openMenu());
        }

        if (this.navClose) {
            this.navClose.addEventListener('click', () => this.closeMenu());
        }

        // Close menu when clicking overlay
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => this.closeMenu());
        }

        // Close menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu?.classList.contains('show')) {
                this.closeMenu();
            }
        });

        // Handle scroll for header style
        window.addEventListener('scroll', () => this.handleScroll());

        // Update active link on scroll
        window.addEventListener('scroll', () => this.highlightActiveLink());
    },

    openMenu() {
        if (this.navMenu) {
            this.navMenu.classList.add('show');
            this.navOverlay?.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    },

    closeMenu() {
        if (this.navMenu) {
            this.navMenu.classList.remove('show');
            this.navOverlay?.classList.remove('show');
            document.body.style.overflow = '';
        }
    },

    handleScroll() {
        if (this.header) {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }
    },

    highlightActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
};

/* ==================== Scroll Effects ==================== */
const ScrollEffects = {
    init() {
        this.backToTop = document.getElementById('back-to-top');
        this.scrollProgress = document.getElementById('scroll-progress');
        this.bindEvents();
        this.initIntersectionObserver();
    },

    bindEvents() {
        // Back to top visibility & scroll progress
        window.addEventListener('scroll', () => {
            // Back to top
            if (this.backToTop) {
                if (window.scrollY > 500) {
                    this.backToTop.classList.add('visible');
                } else {
                    this.backToTop.classList.remove('visible');
                }
            }
            
            // Scroll progress indicator
            if (this.scrollProgress) {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = scrollTop / docHeight;
                this.scrollProgress.style.transform = `scaleX(${progress})`;
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    initIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animations
        document.querySelectorAll('.product__card, .service__card, .testimonial__card').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }
};

/* ==================== Hero Stats Counter ==================== */
const HeroStats = {
    init() {
        this.statNumbers = document.querySelectorAll('.hero__stat-number[data-count]');
        this.animated = false;
        this.bindEvents();
    },

    bindEvents() {
        const heroSection = document.getElementById('home');
        if (!heroSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateCounters();
                    this.animated = true;
                }
            });
        }, { threshold: 0.5 });

        observer.observe(heroSection);
    },

    animateCounters() {
        this.statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        });
    }
};

/* ==================== Product Filter ==================== */
const ProductFilter = {
    init() {
        this.filters = document.querySelectorAll('.products__filter');
        this.products = document.querySelectorAll('.product__card');
        this.bindEvents();
    },

    bindEvents() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Update active filter
                this.filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                // Filter products
                const category = filter.getAttribute('data-filter');
                this.filterProducts(category);
            });
        });
    },

    filterProducts(category) {
        this.products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            
            if (category === 'all' || productCategory === category) {
                product.style.display = '';
                setTimeout(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                }, 10);
            } else {
                product.style.opacity = '0';
                product.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    product.style.display = 'none';
                }, 300);
            }
        });
    }
};

/* ==================== Testimonials Slider ==================== */
const TestimonialsSlider = {
    init() {
        this.track = document.querySelector('.testimonials__track');
        this.cards = document.querySelectorAll('.testimonial__card');
        this.prevBtn = document.querySelector('.testimonials__btn--prev');
        this.nextBtn = document.querySelector('.testimonials__btn--next');
        this.dotsContainer = document.querySelector('.testimonials__dots');
        
        if (!this.track || this.cards.length === 0) return;

        this.currentIndex = 0;
        this.cardWidth = 0;
        this.visibleCards = 3;
        this.totalCards = this.cards.length;
        this.isMobile = window.innerWidth <= 767;

        // در موبایل از CSS scroll استفاده می‌کنیم، نه JavaScript slider
        if (this.isMobile) {
            this.initMobileScroll();
            return;
        }

        this.setupSlider();
        this.createDots();
        this.bindEvents();
        this.updateSlider();
    },

    initMobileScroll() {
        // حذف inline styles از کارت‌ها برای موبایل
        this.cards.forEach(card => {
            card.style.flex = '';
            card.style.minWidth = '';
        });
        
        // حذف transform از track
        this.track.style.transform = '';
        
        // آپدیت dots بر اساس scroll position
        this.track.addEventListener('scroll', () => {
            const scrollLeft = this.track.scrollLeft;
            const cardWidth = this.cards[0].offsetWidth + 12; // 12px gap
            const activeIndex = Math.round(Math.abs(scrollLeft) / cardWidth);
            
            const dots = this.dotsContainer?.querySelectorAll('.testimonials__dot');
            dots?.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        });
        
        // Listen for resize to switch between mobile and desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767 && this.isMobile) {
                this.isMobile = false;
                this.setupSlider();
                this.createDots();
                this.bindEvents();
                this.updateSlider();
            } else if (window.innerWidth <= 767 && !this.isMobile) {
                this.isMobile = true;
                this.initMobileScroll();
            }
        });
    },

    setupSlider() {
        this.calculateDimensions();
        window.addEventListener('resize', () => {
            if (!this.isMobile) {
                this.calculateDimensions();
                this.updateSlider();
            }
        });
    },

    calculateDimensions() {
        // Skip for mobile - CSS handles it
        if (window.innerWidth <= 767) return;
        
        const containerWidth = this.track.parentElement.offsetWidth;
        const gap = 24; // var(--spacing-xl)

        if (window.innerWidth > 1024) {
            this.visibleCards = 3;
        } else if (window.innerWidth > 768) {
            this.visibleCards = 2;
        } else {
            this.visibleCards = 1;
        }

        this.cardWidth = (containerWidth - (gap * (this.visibleCards - 1))) / this.visibleCards;
        
        this.cards.forEach(card => {
            card.style.flex = `0 0 ${this.cardWidth}px`;
            card.style.minWidth = `${this.cardWidth}px`;
        });
    },

    createDots() {
        if (!this.dotsContainer) return;

        const dotsCount = Math.ceil(this.totalCards / this.visibleCards);
        this.dotsContainer.innerHTML = '';

        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('testimonials__dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    },

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Touch/Swipe support
        let startX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
        });

        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            // For RTL, invert the swipe direction
            const isRTL = document.documentElement.dir === 'rtl';
            const threshold = isRTL ? -50 : 50;

            if (Math.abs(diff) > 50) {
                if (isRTL) {
                    // RTL: swipe right = next, swipe left = prev
                    if (diff < 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                } else {
                    // LTR: swipe left = next, swipe right = prev
                    if (diff > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }
            }
            isDragging = false;
        });

        // Auto-play
        this.startAutoPlay();
        this.track.parentElement.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.track.parentElement.addEventListener('mouseleave', () => this.startAutoPlay());
    },

    prev() {
        const isRTL = document.documentElement.dir === 'rtl';
        const maxIndex = Math.ceil(this.totalCards / this.visibleCards) - 1;
        
        if (isRTL) {
            // In RTL, prev button goes forward visually
            this.currentIndex = Math.min(maxIndex, this.currentIndex + 1);
        } else {
            this.currentIndex = Math.max(0, this.currentIndex - 1);
        }
        this.updateSlider();
    },

    next() {
        const isRTL = document.documentElement.dir === 'rtl';
        const maxIndex = Math.ceil(this.totalCards / this.visibleCards) - 1;
        
        if (isRTL) {
            // In RTL, next button goes backward visually
            this.currentIndex = Math.max(0, this.currentIndex - 1);
        } else {
            this.currentIndex = Math.min(maxIndex, this.currentIndex + 1);
        }
        this.updateSlider();
    },

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    },

    updateSlider() {
        const gap = 24;
        const isRTL = document.documentElement.dir === 'rtl';
        // For RTL, we need positive translateX to move slides to the left (which appears right in RTL)
        const translateValue = this.currentIndex * (this.cardWidth + gap) * this.visibleCards;
        const translateX = isRTL ? translateValue : -translateValue;
        this.track.style.transform = `translateX(${translateX}px)`;

        // Update dots
        const dots = this.dotsContainer?.querySelectorAll('.testimonials__dot');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    },

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            const maxIndex = Math.ceil(this.totalCards / this.visibleCards) - 1;
            if (this.currentIndex >= maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateSlider();
        }, 5000);
    },

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
};

/* ==================== Contact Form ==================== */
const ContactForm = {
    init() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;

        this.bindEvents();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('.form__input, .form__textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    },

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Validate all fields
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Simulate form submission
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> پیام ارسال شد!';
            submitBtn.style.background = 'var(--success)';

            // Reset form
            setTimeout(() => {
                this.form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;

                // Show success message
                this.showNotification('با تشکر! به زودی با شما تماس می‌گیریم.', 'success');
            }, 2000);
        }, 1500);
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Check if required and empty
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'این فیلد الزامی است';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'لطفاً یک آدرس ایمیل معتبر وارد کنید';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'لطفاً یک شماره تلفن معتبر وارد کنید';
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }

        return isValid;
    },

    showError(field, message) {
        const fieldContainer = field.closest('.form__field');
        field.style.borderColor = 'var(--error)';
        
        // Remove existing error message
        const existingError = fieldContainer.querySelector('.form__error');
        if (existingError) existingError.remove();

        // Add new error message
        const errorEl = document.createElement('span');
        errorEl.classList.add('form__error');
        errorEl.style.cssText = 'color: var(--error); font-size: 0.75rem; margin-top: 0.25rem; display: block;';
        errorEl.textContent = message;
        fieldContainer.appendChild(errorEl);
    },

    clearError(field) {
        const fieldContainer = field.closest('.form__field');
        field.style.borderColor = '';
        
        const existingError = fieldContainer.querySelector('.form__error');
        if (existingError) existingError.remove();
    },

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-family: 'Vazirmatn', 'Tahoma', sans-serif;
            direction: rtl;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(-100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
};

/* ==================== Utility Functions ==================== */
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* ==================== Advanced Scroll Animations ==================== */
const ScrollAnimations = {
    init() {
        this.createObserver();
        this.observeElements();
        this.initTextReveal();
    },

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.dataset.delay || 0;
                    const animation = el.dataset.animation || 'fadeInUp';
                    
                    setTimeout(() => {
                        el.classList.add('animated', animation);
                    }, delay);
                    
                    this.observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
    },

    observeElements() {
        // Add animation classes to elements
        const animateElements = document.querySelectorAll(`
            .section__title,
            .section__subtitle,
            .about__content,
            .about__image-container,
            .product__card,
            .service__card,
            .why-us__feature,
            .testimonial__card,
            .contact__form,
            .contact__info,
            .footer__column
        `);

        animateElements.forEach((el, index) => {
            el.classList.add('will-animate');
            el.dataset.delay = (index % 4) * 100;
            el.dataset.animation = this.getRandomAnimation();
            this.observer.observe(el);
        });
    },

    getRandomAnimation() {
        const animations = ['fadeInUp', 'fadeInRight', 'fadeInLeft', 'scaleIn', 'rotateIn'];
        return animations[Math.floor(Math.random() * 3)]; // Use first 3 more commonly
    },

    initTextReveal() {
        const titles = document.querySelectorAll('.section__title');
        titles.forEach(title => {
            if (!title.classList.contains('text-reveal-ready')) {
                const text = title.innerHTML;
                title.innerHTML = `<span class="text-reveal-inner">${text}</span>`;
                title.classList.add('text-reveal-ready');
            }
        });
    }
};

/* ==================== Parallax Effects ==================== */
const ParallaxEffects = {
    init() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        this.heroElements = document.querySelectorAll('.hero__particle, .hero__stats');
        this.bindEvents();
    },

    bindEvents() {
        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateParallax();
        }, 16));

        // Mouse parallax for hero
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mousemove', (e) => this.handleMouseParallax(e));
        }
    },

    updateParallax() {
        const scrollY = window.pageYOffset;
        
        this.parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            const yPos = -(scrollY * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        // Hero elements parallax
        this.heroElements.forEach((el, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrollY * speed;
            el.style.transform = `translateY(${yPos}px)`;
        });
    },

    handleMouseParallax(e) {
        const hero = e.currentTarget;
        const rect = hero.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left - centerX;
        const mouseY = e.clientY - rect.top - centerY;

        const particles = hero.querySelectorAll('.hero__particle');
        particles.forEach((particle, index) => {
            const speed = 0.02 + (index * 0.01);
            const x = mouseX * speed;
            const y = mouseY * speed;
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
};

/* ==================== Magnetic Buttons ==================== */
const MagneticButtons = {
    init() {
        this.buttons = document.querySelectorAll('.btn, .products__filter, .footer__social-link');
        this.bindEvents();
    },

    bindEvents() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => this.handleMove(e, button));
            button.addEventListener('mouseleave', (e) => this.handleLeave(e, button));
        });
    },

    handleMove(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const strength = 0.3;
        button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },

    handleLeave(e, button) {
        button.style.transform = 'translate(0, 0)';
    }
};

/* ==================== Cursor Effects ==================== */
const CursorEffects = {
    init() {
        // Only on desktop
        if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

        this.createCursor();
        this.bindEvents();
    },

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';
        document.body.appendChild(this.cursor);

        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                pointer-events: none;
                position: fixed;
                z-index: 99999;
                mix-blend-mode: difference;
            }
            .cursor-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease;
            }
            .cursor-outline {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.15s ease;
            }
            .custom-cursor.hover .cursor-outline {
                width: 60px;
                height: 60px;
                border-color: var(--primary);
                background: rgba(0, 135, 168, 0.1);
            }
            .custom-cursor.hover .cursor-dot {
                transform: translate(-50%, -50%) scale(0);
            }
        `;
        document.head.appendChild(style);
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .product__card, .service__card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });
    }
};

/* ==================== Smooth Number Counter with Easing ==================== */
const AnimatedCounter = {
    easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    },

    animate(element, start, end, duration) {
        let startTime = null;
        
        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = this.easeOutExpo(progress);
            const current = Math.floor(start + (end - start) * easedProgress);
            
            element.textContent = current.toLocaleString('fa-IR');
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }
};
