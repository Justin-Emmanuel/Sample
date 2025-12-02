/**
 * Pro Car Care - Main JavaScript
 * Includes GSAP animations, Locomotive Scroll integration, and page transitions
 */

// Debug mode (set to false for production)
const DEBUG_MODE = false;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    if (DEBUG_MODE) console.log('DOM loaded, initializing...');
    
    initializeApp();
});

/**
 * Main initialization function
 */
function initializeApp() {
    // Initialize components in order
    initMobileMenu();
    initPageTransitions();
    initParticles();
    initLocomotiveScroll();
    initGSAPAnimations();
    initModal();
    initServiceCardAnimations();
    initCurrentYear();
    
    // Check for reduced motion preference
    checkReducedMotion();
    
    if (DEBUG_MODE) console.log('App initialized successfully');
}

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Toggle body overflow
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
/**
 * Page transition animations using GSAP
 */
function initPageTransitions() {
    const overlay = document.querySelector('.page-transition-overlay');
    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript"]):not([target="_blank"])');
    
    if (!overlay) return;
    
    // Create GSAP timeline for page transition
    const pageTransitionTL = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" }
    });
    
    pageTransitionTL
        .set(overlay, { scaleX: 0, transformOrigin: "right" })
        .to(overlay, {
            scaleX: 1,
            duration: 0.5,
            onComplete: () => {
                // This is where the actual page navigation happens
                // The click handler below will handle navigation
            }
        });
    
    // Add click handlers for page transitions
    links.forEach(link => {
        // Skip if link is to current page
        if (link.href === window.location.href) return;
        
        // Skip if link is to external site
        if (link.href.indexOf(window.location.origin) === -1) return;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetUrl = this.href;
            
            // Start transition
            pageTransitionTL.play();
            
            // Navigate after transition
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 500);
        });
    });
    
    // Animate overlay out on page load
    gsap.fromTo(overlay,
        { scaleX: 1, transformOrigin: "left" },
        {
            scaleX: 0,
            duration: 0.5,
            delay: 0.1,
            ease: "power2.inOut"
        }
    );
}

/**
 * Initialize particle/grain effect
 */
function initParticles() {
    const particleLayer = document.getElementById('particles');
    if (!particleLayer) return;
    
    // Option 1: Simple CSS noise (already implemented in CSS)
    // Option 2: JavaScript particle system (uncomment to use)
    
    /*
    // Uncomment this section for JavaScript particle system
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--color-accent-primary);
            border-radius: 50%;
            pointer-events: none;
            opacity: ${Math.random() * 0.3 + 0.1};
        `;
        particleLayer.appendChild(particle);
        particles.push({
            element: particle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2
        });
    }
    
    function animateParticles() {
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Bounce off edges
            if (p.x < 0 || p.x > 100) p.speedX *= -1;
            if (p.y < 0 || p.y > 100) p.speedY *= -1;
            
            // Keep within bounds
            p.x = Math.max(0, Math.min(100, p.x));
            p.y = Math.max(0, Math.min(100, p.y));
            
            p.element.style.left = `${p.x}%`;
            p.element.style.top = `${p.y}%`;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    */
}

/**
 * Initialize Locomotive Scroll with GSAP integration
 */
function initLocomotiveScroll() {
    // Check if Locomotive Scroll is available
    if (typeof LocomotiveScroll === 'undefined') {
        if (DEBUG_MODE) console.log('Locomotive Scroll not available, using native scroll');
        initScrollAnimationsFallback();
        return;
    }
    
    // Initialize Locomotive Scroll
    const scrollEl = document.querySelector('[data-scroll-container]');
    if (!scrollEl) return;
    
    const locoScroll = new LocomotiveScroll({
        el: scrollEl,
        smooth: true,
        multiplier: 0.8,
        smartphone: {
            smooth: false // Disable smooth scroll on mobile for better performance
        },
        tablet: {
            smooth: false // Disable smooth scroll on tablet for better performance
        }
    });
// Update ScrollTrigger when Locomotive Scroll updates
    locoScroll.on('scroll', ScrollTrigger.update);
    
    // Use ScrollTrigger as proxy for Locomotive Scroll
    ScrollTrigger.scrollerProxy(scrollEl, {
        scrollTop(value) {
            return arguments.length 
                ? locoScroll.scrollTo(value, 0, 0) 
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        pinType: scrollEl.style.transform ? "transform" : "fixed"
    });
    
    // Refresh ScrollTrigger and Locomotive Scroll on window resize
    window.addEventListener('resize', () => {
        locoScroll.update();
        ScrollTrigger.refresh();
    });
    
    // Clean up on destroy
    ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
    ScrollTrigger.defaults({ scroller: scrollEl });
    
    if (DEBUG_MODE) console.log('Locomotive Scroll initialized');
    
    return locoScroll;
}

/**
 * Fallback scroll animations when Locomotive is not available
 */
function initScrollAnimationsFallback() {
    // Simple intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-inview');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements with data-scroll attribute
    document.querySelectorAll('[data-scroll]').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize GSAP animations
 */
function initGSAPAnimations() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
        if (DEBUG_MODE) console.log('GSAP not available, skipping animations');
        return;
    }
    
    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Hero section animations
    animateHeroSection();
    
    // Service cards stagger animation
    animateServiceCards();
    
    // Infographic animations
    animateInfographic();
    
    // Contact page animations
    if (document.querySelector('.contact-container')) {
        animateContactPage();
    }
}

/**
 * Animate hero section elements
 */
function animateHeroSection() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    if (!heroTitle) return;
    
    const heroTL = gsap.timeline({
        defaults: { ease: "power2.out" }
    });
    
    heroTL
        .from(heroTitle, {
            y: 50,
            opacity: 0,
            duration: 1
        })
        .from(heroSubtitle, {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, '-=0.5')
        .from(heroCta, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2
        }, '-=0.3');
}
/**
 * Animate service cards with stagger
 */
function animateServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (serviceCards.length === 0) return;
    
    gsap.from(serviceCards, {
        scrollTrigger: {
            trigger: '.services',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });
}

/**
 * Animate infographic elements
 */
function animateInfographic() {
    const infographic = document.querySelector('.infographic');
    if (!infographic) return;
    
    const blueprintItems = document.querySelectorAll('.blueprint-svg rect, .blueprint-svg circle');
    
    if (blueprintItems.length === 0) return;
    
    gsap.from(blueprintItems, {
        scrollTrigger: {
            trigger: '.infographic',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
    });
}

/**
 * Animate contact page elements
 */
function animateContactPage() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    if (contactItems.length === 0) return;
    
    gsap.from(contactItems, {
        scrollTrigger: {
            trigger: '.contact-container',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    });
}

/**
 * Initialize booking modal
 */
function initModal() {
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modal = document.getElementById('bookingModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (!modal || modalTriggers.length === 0) return;
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            if (this.getAttribute('href') === 'contact.html') return;
            
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

/**
 * Add hover animations to service cards
 */
function initServiceCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-card, .service-detail-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

/**
 * Update copyright year automatically
 */
function initCurrentYear() {
    const yearElements = document.querySelectorAll('.copyright');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = element.textContent.replace('2024', currentYear);
    });
}

/**
 * Check for reduced motion preference and disable animations
 */
function checkReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches) {
        // Disable GSAP animations
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.timeScale(0);
        }
        
        // Disable Locomotive Scroll
        const locoScroll = document.querySelector('[data-scroll-container]');
        if (locoScroll && locoScroll.locomotive) {
            locoScroll.locomotive.destroy();
        }
        
        if (DEBUG_MODE) console.log('Reduced motion preference detected, animations disabled');
    }
}

/**
 * Handle hash anchor links (for contact.html#book)
 */
function handleHashLinks() {
    if (window.location.hash === '#book') {
        const modal = document.getElementById('bookingModal');
        if (modal) {
            setTimeout(() => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 500);
        }
    }
}
// Initialize hash links on load
window.addEventListener('load', handleHashLinks);

/**
 * Video fallback detection
 */
function initVideoFallback() {
    const video = document.querySelector('.hero-video');
    if (!video) return;
    
    video.addEventListener('error', function() {
        document.body.classList.add('no-video');
        if (DEBUG_MODE) console.log('Video failed to load, using fallback');
    });
    
    // Check if video can play
    video.addEventListener('canplay', function() {
        if (DEBUG_MODE) console.log('Video loaded successfully');
    });
}

// Initialize video fallback
initVideoFallback();

/**
 * Performance optimization: Lazy load non-critical images
 */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        // Could implement Intersection Observer here if needed
    }
}

// Initialize lazy loading
initLazyLoading();

/**
 * Cleanup function for page unload
 */
window.addEventListener('beforeunload', function() {
    // Clean up GSAP instances
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
    
    // Remove event listeners
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
    }
});

/**
 * Error handling
 */
window.addEventListener('error', function(e) {
    if (DEBUG_MODE) {
        console.error('JavaScript Error:', e.message, e.filename, e.lineno);
    }
});
