document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hero elements
    const heroName = document.getElementById('hero-name');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const ctaButton = document.querySelector('.cta-button');
    
    // Animation elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Contact form
    const contactForm = document.getElementById('contactForm');

    // Typewriter effect for hero name
    function typeWriter(element, text, speed = 150) {
        if (!element) return;
        
        element.innerHTML = '';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        // Start typing after a short delay
        setTimeout(type, 1000);
    }
    
    // Initialize typewriter effect
    setTimeout(() => {
        if (heroName) {
            typeWriter(heroName, 'PRATHAM', 200);
        }
    }, 500);

    // Smooth scrolling function
    function smoothScrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const navbarHeight = 70;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log('Navigating to:', targetId);
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to target
            smoothScrollTo(targetId);
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // CTA button scroll to projects
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('CTA button clicked - scrolling to projects');
            smoothScrollTo('#projects');
        });
    }

    // Mobile navigation toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Navbar scroll effect and active link updates
    function handleScroll() {
        // Navbar background effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation link
        updateActiveNavLink();
    }

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150; // Offset for better detection
        
        let activeSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
        
        // Update navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href').substring(1); // Remove #
            if (linkHref === activeSection) {
                link.classList.add('active');
            }
        });
    }

    // Throttle scroll events for better performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Apply throttled scroll handler
    window.addEventListener('scroll', throttle(handleScroll, 16));

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#22c55e';
                break;
            case 'error':
                notification.style.backgroundColor = '#ef4444';
                break;
            default:
                notification.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    // Contact form handling with proper validation
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            const name = nameField.value.trim();
            const email = emailField.value.trim();
            const message = messageField.value.trim();
            
            console.log('Form submitted:', { name, email, message });
            
            // Reset field styles
            [nameField, emailField, messageField].forEach(field => {
                field.style.borderColor = '';
            });
            
            // Validation
            let hasErrors = false;
            
            if (!name) {
                nameField.style.borderColor = '#ef4444';
                hasErrors = true;
            }
            
            if (!email) {
                emailField.style.borderColor = '#ef4444';
                hasErrors = true;
            } else if (!isValidEmail(email)) {
                emailField.style.borderColor = '#ef4444';
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (!message) {
                messageField.style.borderColor = '#ef4444';
                hasErrors = true;
            }
            
            if (hasErrors) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                
                // Reset field styles
                [nameField, emailField, messageField].forEach(field => {
                    field.style.borderColor = '';
                });
            }, 2000);
        });
        
        // Real-time validation feedback
        const formFields = [
            { field: document.getElementById('name'), name: 'name' },
            { field: document.getElementById('email'), name: 'email' },
            { field: document.getElementById('message'), name: 'message' }
        ];
        
        formFields.forEach(({ field, name }) => {
            if (!field) return;
            
            field.addEventListener('input', function() {
                const value = this.value.trim();
                
                if (name === 'email' && value) {
                    if (isValidEmail(value)) {
                        this.style.borderColor = '#22c55e';
                    } else {
                        this.style.borderColor = '#f59e0b';
                    }
                } else if (value) {
                    this.style.borderColor = '#22c55e';
                } else {
                    this.style.borderColor = '';
                }
            });
            
            field.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 0 0 3px rgba(33, 128, 141, 0.1)';
            });
            
            field.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        });
    }

    // Enhanced hover effects for interactive elements
    
    // Skill tags floating animation enhancement
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        // Add random delay and duration for more organic movement
        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 2;
        
        tag.style.animationDelay = `${randomDelay}s`;
        tag.style.animationDuration = `${randomDuration}s`;
        
        // Enhanced hover effects
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Project cards enhanced hover effects
 const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    const desc = card.querySelector('.project-desc');

    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
        if(desc) desc.style.color = '#fff'; // make description text white
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        if(desc) desc.style.color = ''; // reset to default color
    });
});


    // Experience cards enhanced hover effects
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });

    // Parallax effect for floating shapes
    const floatingShapes = document.querySelectorAll('.floating-shape');
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        floatingShapes.forEach((shape, index) => {
            const speed = 0.2 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    }

    // Apply parallax effect on scroll
    window.addEventListener('scroll', throttle(updateParallax, 16));

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Navigate sections with arrow keys
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const sections = Array.from(document.querySelectorAll('section[id]'));
            const currentSection = sections.find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            });
            
            if (currentSection) {
                const currentIndex = sections.indexOf(currentSection);
                let nextIndex;
                
                if (e.key === 'ArrowDown') {
                    nextIndex = Math.min(currentIndex + 1, sections.length - 1);
                } else {
                    nextIndex = Math.max(currentIndex - 1, 0);
                }
                
                const nextSection = sections[nextIndex];
                if (nextSection) {
                    smoothScrollTo(`#${nextSection.id}`);
                }
            }
        }
    });

    // Initialize page
    function initializePage() {
        // Set initial active nav link
        updateActiveNavLink();
        
        // Add loading completion class to body
        document.body.classList.add('loaded');
        
        console.log('Portfolio initialized successfully! 🚀');
        console.log('Navigation links:', navLinks.length);
        console.log('CTA button:', ctaButton ? 'Found' : 'Not found');
        console.log('Contact form:', contactForm ? 'Found' : 'Not found');
    }

    // Initialize everything after a short delay to ensure DOM is ready
    setTimeout(initializePage, 100);

    // Add smooth reveal for page load
    const allSections = document.querySelectorAll('section');
    allSections.forEach((section, index) => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    });
});