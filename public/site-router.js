/**
 * SMART VLE TOOL - Client Router, Hash Navigation, SEO & Privacy Controller
 * Uses window.MONU_SITE_CONFIG for dynamic base URL resolution
 * Support Email: customer@smartvletool.in
 * Production Domain: https://smartvletool.in
 */

(function () {
    const config = window.MONU_SITE_CONFIG || {
        PRODUCTION_DOMAIN: 'https://smartvletool.in',
        SITE_NAME: 'SMART VLE TOOL',
        SUPPORT_EMAIL: 'customer@smartvletool.in',
        getBaseUrl: function () {
            if (this.PRODUCTION_DOMAIN && 
                this.PRODUCTION_DOMAIN !== 'YOUR_DOMAIN_HERE' && 
                !this.PRODUCTION_DOMAIN.includes('YOUR_DOMAIN')) {
                return this.PRODUCTION_DOMAIN.replace(/\/+$/, '');
            }
            if (typeof window !== 'undefined' && window.location && window.location.origin) {
                return window.location.origin;
            }
            return 'https://smartvletool.in';
        },
        getCanonicalUrl: function (path) {
            const base = this.getBaseUrl();
            const cleanPath = (path || '/').startsWith('/') ? path : '/' + path;
            return base + cleanPath;
        }
    };

    window.MONU_CONFIG = config;

    const SUPPORT_EMAIL = config.SUPPORT_EMAIL || 'customer@smartvletool.in';

    const ROUTES = {
        '/': {
            pageId: 'page-home',
            title: 'SMART VLE TOOL – Free Online Image Editing & Document Tools',
            description: 'Privacy-focused image editing, document enhancement, and PDF tools. Edit supported files directly in your browser with selected offline capabilities.',
            path: '/'
        },
        '/document-studio': {
            pageId: 'page-doc-studio',
            title: 'Document Studio – Remove Shadow & Clean Scanned Docs Online',
            description: 'Clean mobile-captured documents online. Remove dark shadows, fix background brightness, straighten tilted scans, and get crystal clear printouts for VLE work.',
            keywords: 'document studio, remove shadow from document online, clean scanned document for print, whiten document background, mobile photo to scan print, vle document cleaner',
            path: '/document-studio'
        },
        '/id-card-studio': {
            pageId: 'page-id-studio',
            title: 'ID Card Studio – Print Front & Back ID Card on One A4 Page',
            description: 'Straighten, clean, and align front and back sides of Aadhaar, PAN, or Voter ID cards in exact card size on a single A4 page for instant printing. Best for VLE.',
            keywords: 'id card studio, front and back id card print on one page, aadhaar card print layout a4, straighten tilted id card, pvc card size print on a4, csc id card print tool',
            path: '/id-card-studio'
        },
        '/image-pdf-editor': {
            pageId: 'page-editor-studio',
            title: 'Online Image Resizer in KB, Crop, Convert & PDF Organizer',
            description: 'Resize & compress images in exact KB with 300 DPI for government forms. Crop, adjust color, watermark, convert formats, and organize or optimize PDFs online.',
            keywords: 'resize photo in kb, compress image 300 dpi, increase image size in kb, crop image online, pdf organizer, pdf optimizer, images to pdf, adjust image brightness contrast',
            path: '/image-pdf-editor'
        },
        '/about': {
            pageId: 'page-about',
            title: 'About Us – SMART VLE TOOL Online Utility Platform',
            description: 'Learn about SMART VLE TOOL: our mission, browser-based processing model, selected offline capabilities, and privacy-focused document processing.',
            path: '/about-us'
        },
        '/about-us': {
            pageId: 'page-about',
            title: 'About Us – SMART VLE TOOL Online Utility Platform',
            description: 'Learn about SMART VLE TOOL: our mission, browser-based processing model, selected offline capabilities, and privacy-focused document processing.',
            path: '/about-us'
        },
        '/contact': {
            pageId: 'page-contact',
            title: 'Contact Us – SMART VLE TOOL Support & Feedback',
            description: 'Get in touch with the SMART VLE TOOL team for support, feature feedback, technical questions, or general inquiries regarding our utility suite.',
            path: '/contact-us'
        },
        '/contact-us': {
            pageId: 'page-contact',
            title: 'Contact Us – SMART VLE TOOL Support & Feedback',
            description: 'Get in touch with the SMART VLE TOOL team for support, feature feedback, technical questions, or general inquiries regarding our utility suite.',
            path: '/contact-us'
        },
        '/privacy-policy': {
            pageId: 'page-privacy',
            title: 'Privacy Policy – SMART VLE TOOL Data Protection Practices',
            description: 'Read our transparent privacy policy. Discover how SMART VLE TOOL processes supported files in-browser, local storage data management, and AdSense disclosures.',
            path: '/privacy-policy'
        },
        '/terms-and-conditions': {
            pageId: 'page-terms',
            title: 'Terms and Conditions – SMART VLE TOOL',
            description: 'Review the terms and conditions for using SMART VLE TOOL online image editing, scanned document enhancement, and PDF tools.',
            path: '/terms-and-conditions'
        },
        '/copyright-policy': {
            pageId: 'page-copyright',
            title: 'Copyright Policy – SMART VLE TOOL',
            description: 'Review our copyright policy, user ownership of uploaded files, DMCA notice procedures, and intellectual property guidelines.',
            path: '/copyright-policy'
        },
        '/disclaimer': {
            pageId: 'page-disclaimer',
            title: 'Disclaimer – SMART VLE TOOL',
            description: 'Important legal and utility disclaimer regarding document processing quality, non-affiliation with government entities, and user verification responsibilities.',
            path: '/disclaimer'
        }
    };

    let currentRoutePath = '/';

    function normalizePath(pathname) {
        if (!pathname) return '/';
        let p = pathname.trim();
        if (p.length > 1 && p.endsWith('/')) {
            p = p.slice(0, -1);
        }
        return p || '/';
    }

    function parseUrl(rawUrl) {
        let urlStr = rawUrl || (window.location.pathname + window.location.hash);
        let [pathPart, hashPart] = urlStr.split('#');
        let pathname = normalizePath(pathPart || '/');
        let hash = hashPart ? '#' + hashPart : '';
        return { pathname, hash };
    }

    function updateMetaTags(routeInfo) {
        document.title = routeInfo.title;

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = routeInfo.description;

        if (routeInfo.keywords) {
            let metaKw = document.querySelector('meta[name="keywords"]');
            if (!metaKw) {
                metaKw = document.createElement('meta');
                metaKw.name = 'keywords';
                document.head.appendChild(metaKw);
            }
            metaKw.content = routeInfo.keywords;
        }

        const canonicalUrl = config.getCanonicalUrl(routeInfo.path || routeInfo.canonical || '/');

        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = canonicalUrl;

        // OpenGraph
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = routeInfo.title;
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.content = routeInfo.description;
        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.content = canonicalUrl;

        // Twitter
        let twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) twTitle.content = routeInfo.title;
        let twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc) twDesc.content = routeInfo.description;
    }

    function updateNavHighlights(path) {
        const links = document.querySelectorAll('.site-nav-link');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            const linkPath = parseUrl(href).pathname;
            const isMatch = (linkPath === path) || 
                            (path === '/' && linkPath === '/') ||
                            ((path === '/about' || path === '/about-us') && (linkPath === '/about' || linkPath === '/about-us')) ||
                            ((path === '/contact' || path === '/contact-us') && (linkPath === '/contact' || linkPath === '/contact-us'));
            if (isMatch) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function scrollToHash(hash) {
        if (!hash) return;
        const targetId = hash.replace(/^#/, '');
        setTimeout(() => {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 80);
    }

    function mountStudioTool(targetPath) {
        const workspace = document.getElementById('shared-studio-workspace') || document.getElementById('page-studio-workspace');
        if (!workspace) return;

        let targetMountId = null;
        let mode = 'DOC';

        if (targetPath === '/document-studio') {
            targetMountId = 'tool-stage-doc';
            mode = 'DOC';
        } else if (targetPath === '/id-card-studio') {
            targetMountId = 'tool-stage-id';
            mode = 'ID';
        } else if (targetPath === '/image-pdf-editor') {
            targetMountId = 'tool-stage-editor';
            mode = 'EDITOR';
        }

        if (targetMountId) {
            const mountEl = document.getElementById(targetMountId);
            if (mountEl && workspace.parentElement !== mountEl) {
                mountEl.appendChild(workspace);
            }
            workspace.classList.remove('hidden');
            workspace.style.display = 'block';

            if (typeof window.switchMode === 'function') {
                window.switchMode(mode);
            }
        }
    }

    function navigateTo(url, push = true) {
        const { pathname, hash } = parseUrl(url);
        const route = ROUTES[pathname] || ROUTES['/'];

        // Hide all page views
        const pages = document.querySelectorAll('.page-view');
        pages.forEach(p => p.classList.add('hidden'));

        // Show target page
        const targetPage = document.getElementById(route.pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        } else {
            // Target page view not found in current DOM (e.g. multi-page static navigation)
            window.location.href = url;
            return;
        }

        // Mount tool directly into Section 3 if navigating to one of the 3 tool pages
        if (pathname === '/document-studio' || pathname === '/id-card-studio' || pathname === '/image-pdf-editor') {
            mountStudioTool(pathname);
        }

        // Update URL & Meta
        currentRoutePath = pathname;
        const cleanTargetHash = (hash === '#explore-tools') ? '' : (hash || '');
        const fullTargetUrl = pathname + cleanTargetHash;
        if (push && (window.location.pathname + window.location.hash) !== fullTargetUrl) {
            window.history.pushState({ path: pathname, hash: cleanTargetHash }, route.title, fullTargetUrl);
        } else if (!push && hash === '#explore-tools' && pathname === '/') {
            window.history.replaceState({ path: '/', hash: '' }, route.title, '/');
        }

        updateMetaTags(route);
        updateNavHighlights(pathname);

        // Close mobile drawer if open
        const mobileDrawer = document.getElementById('mobileNavDrawer');
        if (mobileDrawer) mobileDrawer.classList.remove('open');

        // Scroll to hash target on explicit navigation, otherwise scroll to top on load/reload
        if (hash && (push || hash !== '#explore-tools')) {
            scrollToHash(hash);
        } else {
            window.scrollTo({ top: 0, behavior: push ? 'smooth' : 'auto' });
        }

        // If navigating to privacy policy, refresh storage statistics
        if (pathname === '/privacy-policy') {
            setTimeout(refreshPrivacyStorageStats, 100);
        }
    }

    function openStudioWorkspace(mode) {
        const targetUrl = (mode === 'ID') ? '/id-card-studio' : (mode === 'EDITOR' ? '/image-pdf-editor' : '/document-studio');
        navigateTo(targetUrl, true);
        setTimeout(() => {
            const toolEl = document.getElementById('shared-studio-workspace') || document.querySelector('.tool-embed-wrapper');
            if (toolEl) {
                toolEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    function closeStudioWorkspace(shouldNavigate = true) {
        if (shouldNavigate) {
            navigateTo('/', true);
        }
    }

    function updateWorkspaceTopGuide(mode) {
        return;
    }

    // ═══ HONEST CONTACT FORM HANDLER ═══
    function initContactForm() {
        const form = document.getElementById('monuContactForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = (document.getElementById('cf-name')?.value || '').trim();
            const email = (document.getElementById('cf-email')?.value || '').trim();
            const subject = (document.getElementById('cf-subject')?.value || '').trim();
            const message = (document.getElementById('cf-message')?.value || '').trim();
            const honeypot = (document.getElementById('cf-honeypot')?.value || '').trim();
            const statusEl = document.getElementById('cf-status-msg');

            if (!statusEl) return;

            // Anti-spam honeypot detection
            if (honeypot.length > 0) {
                statusEl.innerHTML = '<div style="color:#ef4444; font-weight:700; padding:10px; background:#fef2f2; border-radius:8px;">Spam detected. Please retry.</div>';
                return;
            }

            if (!name || !email || !message) {
                statusEl.innerHTML = '<div style="color:#ef4444; font-weight:700; padding:10px; background:#fef2f2; border-radius:8px;">Please fill in your name, email address, and message.</div>';
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                statusEl.innerHTML = '<div style="color:#ef4444; font-weight:700; padding:10px; background:#fef2f2; border-radius:8px;">Please enter a valid email address.</div>';
                return;
            }

            const basePlatformUrl = config.getBaseUrl() || 'https://smartvletool.in';
            const emailSubject = subject ? `[SMART VLE TOOL Inquiry] ${subject}` : `[SMART VLE TOOL Inquiry] from ${name}`;
            const emailBody = `Hello SMART VLE TOOL Support Team,\n\nFrom: ${name} (${email})\nSubject: ${subject || 'General Assistance'}\n\nMessage:\n${message}\n\n---\nSent via SMART VLE TOOL Web Platform (${basePlatformUrl})`;

            const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

            try {
                window.location.href = mailtoUrl;
            } catch (err) {
                console.warn('Mailto launch:', err);
            }

            window._lastContactMessage = `To: ${SUPPORT_EMAIL}\nSubject: ${emailSubject}\n\n${emailBody}`;

            statusEl.innerHTML = `
                <div class="contact-feedback-card" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px; margin-top:12px;">
                    <div class="contact-feedback-title" style="font-size:15px; font-weight:800; color:#166534; margin-bottom:6px;">
                        <span>✉️ Action Required: Send via Email Client</span>
                    </div>
                    <div class="contact-feedback-desc" style="font-size:13.5px; color:#15803d; line-height:1.5;">
                        Your default email client has been launched with your message pre-filled to <strong>${SUPPORT_EMAIL}</strong>. If your email application did not open automatically, click the button below or copy your formatted message:
                    </div>
                    <div class="contact-feedback-actions" style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
                        <a href="${mailtoUrl}" class="btn-primary-hero" style="font-size:13px; padding:8px 14px;">Open Email App</a>
                        <button type="button" class="btn-secondary-hero" style="font-size:13px; padding:8px 14px;" onclick="MonuRouter.copyContactMessage()">Copy Formatted Message</button>
                    </div>
                    <div id="cf-copy-notice" style="display:none; margin-top:8px; font-size:12px; font-weight:700; color:#15803d;">
                        ✓ Message copied to clipboard! You can paste it into Gmail, Outlook, or any webmail provider.
                    </div>
                </div>
            `;
        });
    }

    function copyContactMessage() {
        if (!window._lastContactMessage) return;
        navigator.clipboard.writeText(window._lastContactMessage).then(() => {
            const notice = document.getElementById('cf-copy-notice');
            if (notice) notice.style.display = 'block';
        }).catch(err => {
            console.warn('Clipboard copy error:', err);
        });
    }

    // ═══ PRIVACY & LOCAL DATA MANAGEMENT ═══
    async function refreshPrivacyStorageStats() {
        if (!window.MonuStorageManager) return;
        const summary = await window.MonuStorageManager.getStorageSummary();
        const docEl = document.getElementById('privacy-doc-count');
        const idEl = document.getElementById('privacy-id-count');
        const editorEl = document.getElementById('privacy-editor-count');
        if (docEl) docEl.textContent = summary.docCount;
        if (idEl) idEl.textContent = summary.idSetCount;
        if (editorEl) editorEl.textContent = summary.editorProjectCount;
    }

    function promptClearAllData() {
        const modal = document.getElementById('confirmClearDataModal');
        if (modal) {
            modal.style.display = 'flex';
        } else {
            if (confirm('Are you sure you want to delete all locally stored documents, ID cards, and editor projects from your browser? This action permanently removes local storage data.')) {
                executeClearAllData();
            }
        }
    }

    function closeClearDataModal() {
        const modal = document.getElementById('confirmClearDataModal');
        if (modal) modal.style.display = 'none';
    }

    async function executeClearAllData() {
        closeClearDataModal();
        const statusEl = document.getElementById('privacy-clear-status');
        if (statusEl) {
            statusEl.innerHTML = '<span style="color:#b621fe; font-weight:700;">Clearing local IndexedDB, LocalStorage, and Cache Storage...</span>';
        }
        if (window.MonuStorageManager) {
            const result = await window.MonuStorageManager.clearAllData();
            if (statusEl) {
                if (result.success) {
                    statusEl.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ ${result.details || 'All locally stored documents, ID sets, and editor data have been successfully deleted from your browser.'}</span>`;
                } else {
                    statusEl.innerHTML = `<span style="color:#ef4444; font-weight:700;">Partial cleanup complete: ${result.details}</span>`;
                }
            }
            refreshPrivacyStorageStats();
        }
    }

    // ═══ INITIALIZE ROUTER & LISTENERS ═══
    function initRouter() {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Intercept internal link clicks with hash support
        document.addEventListener('click', function (e) {
            const link = e.target.closest('a[data-link], a.site-nav-link, a.btn-tool-guide, a.footer-link, a.breadcrumb-link, a.hero-anchor, a.btn-secondary-hero, a[href^="#"]');
            if (link) {
                const href = link.getAttribute('href');
                if (href && (href.startsWith('/') || href.startsWith('#')) && !href.startsWith('//')) {
                    const { pathname, hash } = parseUrl(href);

                    // If same page with hash anchor, scroll smoothly without full reload
                    if (pathname === currentRoutePath && hash) {
                        e.preventDefault();
                        scrollToHash(hash);
                        if (hash !== '#explore-tools') {
                            window.history.pushState({ path: pathname, hash: hash }, document.title, pathname + hash);
                        }
                        return;
                    }

                    // Internal route navigation
                    e.preventDefault();
                    navigateTo(href, true);
                }
            }
        });

        // Handle Browser Back / Forward buttons
        window.addEventListener('popstate', function () {
            navigateTo(window.location.pathname + window.location.hash, false);
        });

        // Handle URL hash changes
        window.addEventListener('hashchange', function () {
            scrollToHash(window.location.hash);
        });

        // Initialize FAQ accordions
        initFaqAccordions();

        // Initialize Contact Form
        initContactForm();

        // Dynamic Year in Footer
        const yearEl = document.getElementById('current-year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }

        // Mobile Menu Button
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const mobileDrawer = document.getElementById('mobileNavDrawer');
        if (mobileBtn && mobileDrawer) {
            mobileBtn.addEventListener('click', function () {
                mobileDrawer.classList.toggle('open');
            });
        }

        // Check for workspace URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('workspace')) {
            const requestedMode = urlParams.get('workspace') || 'DOC';
            openStudioWorkspace(requestedMode);
            return;
        }

        // Initial Route Resolution on Load
        const initialFullUrl = window.location.pathname + window.location.hash;
        const parsed = parseUrl(initialFullUrl);
        if (ROUTES[parsed.pathname]) {
            navigateTo(initialFullUrl, false);
        } else {
            navigateTo('/' + (parsed.hash || ''), false);
        }
    }

    function initFaqAccordions() {
        document.addEventListener('click', function (e) {
            const questionBtn = e.target.closest('.faq-question-btn');
            if (!questionBtn) return;

            const item = questionBtn.closest('.faq-item');
            if (!item) return;

            const isActive = item.classList.contains('active');

            // Close other items in the same container
            const container = item.closest('.faq-list');
            if (container) {
                container.querySelectorAll('.faq-item').forEach(el => {
                    if (el !== item) el.classList.remove('active');
                });
            }

            item.classList.toggle('active', !isActive);
            questionBtn.setAttribute('aria-expanded', !isActive);
        });
    }

    // Expose globals for onclick bindings in HTML
    window.MonuRouter = {
        navigateTo,
        openStudioWorkspace,
        closeStudioWorkspace,
        mountStudioTool,
        updateWorkspaceTopGuide,
        copyContactMessage,
        promptClearAllData,
        closeClearDataModal,
        executeClearAllData,
        refreshPrivacyStorageStats
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRouter);
    } else {
        initRouter();
    }
})();
