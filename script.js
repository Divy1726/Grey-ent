document.addEventListener('DOMContentLoaded', () => {
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // Update scroll progress bar
    lenis.on('scroll', (e) => {
        const progress = e.progress * 100;
        document.querySelector('.scroll-progress').style.width = `${progress}%`;
    });

    // Custom Cursor
    function initCursor() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        const interactives = document.querySelectorAll('a, button, input, textarea, .interactive');

        if (!cursorDot || !cursorOutline) return;

        // Check if device supports hover
        if (window.matchMedia("(pointer: fine)").matches) {
            window.addEventListener('mousemove', (e) => {
                const posX = e.clientX;
                const posY = e.clientY;

                // Move dot instantly
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                // Move outline with slight delay
                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 500, fill: "forwards" });
            });

            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    document.body.classList.add('cursor-hover');
                });
                el.addEventListener('mouseleave', () => {
                    document.body.classList.remove('cursor-hover');
                });
            });
        }
    }

    // Preloader and Initial Animation
    function initPreloader() {
        const tl = gsap.timeline();
        
        tl.to('.preloader-title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
          .to('.preloader-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .to('.loading-line-container', { opacity: 1, duration: 0.5 }, '-=0.4')
          .to('.loading-line', { width: '100%', duration: 1.5, ease: 'power2.inOut' })
          .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
          .call(() => {
              document.body.classList.remove('loading');
          })
          .fromTo('.hero-title .line-inner', { y: '100%' }, { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.5')
          .to('.hero-top-text', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
          .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
          .to('.hero-buttons', { opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.6')
          .to('.hero-bg-img', { scale: 1, duration: 2, ease: 'power2.out' }, '-=1.5')
          .to('.scroll-indicator', { opacity: 0.6, duration: 1 }, '-=0.5');
    }

    // Header scroll state
    function initHeader() {
        const header = document.querySelector('.site-header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu
    function initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.mobile-menu');
        const links = document.querySelectorAll('.mobile-nav-link, .mobile-menu .btn');

        let isOpen = false;

        toggle.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                menu.classList.add('active');
                gsap.fromTo(links, 
                    { y: 50, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
                );
            } else {
                menu.classList.remove('active');
            }
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                isOpen = false;
                menu.classList.remove('active');
            });
        });
    }

    // Hero Mouse Parallax
    function initHeroParallax() {
        const hero = document.querySelector('.hero');
        const bg = document.querySelector('.hero-bg-img');
        const content = document.querySelector('.hero-content');
        
        if (!hero || !window.matchMedia("(pointer: fine)").matches) return;

        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            gsap.to(bg, { x: x, y: y, duration: 1, ease: 'power2.out' });
            gsap.to(content, { x: -x * 0.5, y: -y * 0.5, duration: 1, ease: 'power2.out' });
        });
    }

    // Horizontal Products Scroll
    function initHorizontalProducts() {
        const wrapper = document.querySelector('.products-horizontal-wrapper');
        const track = document.querySelector('.products-track');
        
        if (!wrapper || !track) return;
        
        // Only run on desktop
        if (window.innerWidth > 768) {
            let getToValue = () => -(track.scrollWidth - window.innerWidth + 100);
            
            gsap.to(track, {
                x: getToValue,
                ease: "none",
                scrollTrigger: {
                    trigger: wrapper,
                    pin: true,
                    start: "center center",
                    end: () => "+=" + (track.scrollWidth - window.innerWidth),
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        }
    }

    // General Scroll Animations
    function initScrollAnimations() {
        // Fade up elements
        const fadeUps = document.querySelectorAll('.fade-up');
        fadeUps.forEach(el => {
            const delay = el.getAttribute('data-delay') || 0;
            gsap.to(el, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                }
            });
        });

        // Giant statement reveals
        const statements = document.querySelectorAll('.statement-title .line-inner, .cta-giant .block');
        statements.forEach(el => {
            gsap.fromTo(el, 
                { y: '100%' },
                {
                    y: '0%',
                    duration: 1.2,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: el.closest('h2'),
                        start: 'top 80%',
                    }
                }
            );
        });

        // Parallax images using data-speed attribute
        const parallaxElements = document.querySelectorAll('[data-speed]');
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed');
            gsap.to(el, {
                y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
                ease: "none",
                scrollTrigger: {
                    trigger: el.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0,
                    invalidateOnRefresh: true
                }
            });
        });
    }

    // Material Story Pinned Parallax
    function initMaterialStory() {
        const storySection = document.querySelector('.material-story');
        const img = document.querySelector('.story-img');
        const blocks = document.querySelectorAll('.float-block');
        const textBlocks = document.querySelectorAll('.story-content .block');

        if (!storySection) return;

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: storySection,
                start: 'top top',
                end: '+=150%',
                scrub: 1,
                pin: true,
            }
        });

        tl.to(img, { scale: 1.2, duration: 1 }, 0)
          .fromTo(textBlocks, { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, 0)
          .to(blocks[0], { y: -50, opacity: 1, duration: 0.5 }, 0.2)
          .to(blocks[1], { y: -80, opacity: 1, duration: 0.5 }, 0.4)
          .to(blocks[2], { y: -60, opacity: 1, duration: 0.5 }, 0.6);
    }

    // Supply Process Animation
    function initProcessAnimation() {
        const processSection = document.querySelector('.process');
        const lineProgress = document.querySelector('.process-line-progress');
        const steps = document.querySelectorAll('.step');

        if (!processSection) return;

        gsap.to(lineProgress, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.process-wrapper',
                start: 'top center',
                end: 'bottom center',
                scrub: 0.5
            }
        });

        steps.forEach((step, i) => {
            ScrollTrigger.create({
                trigger: step,
                start: 'top center+=100',
                onEnter: () => step.classList.add('active'),
                onLeaveBack: () => step.classList.remove('active')
            });
        });
    }

    // Form Handling
    function initForm() {
        const form = document.getElementById('enquiry-form');
        const success = document.getElementById('form-success');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Mock API call / delay
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'SENDING...';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                success.classList.add('show');
                form.reset();
                btn.innerHTML = originalText;
                btn.style.pointerEvents = 'auto';

                // Hide success message after 4 seconds
                setTimeout(() => {
                    success.classList.remove('show');
                }, 4000);
            }, 1000);
        });
    }

    // Ensure scroll positions are recalculated on resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

    // Initialize all modules
    initCursor();
    initHeader();
    initMobileMenu();
    initPreloader();
    initHeroParallax();
    initHorizontalProducts();
    initScrollAnimations();
    initMaterialStory();
    initProcessAnimation();
    initForm();
});
