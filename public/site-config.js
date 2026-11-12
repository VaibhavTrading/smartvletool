/**
 * SMART VLE TOOL - Centralized Site & Production Domain Configuration
 * Production Domain: https://smartvletool.com
 */

(function () {
    const SITE_CONFIG = {
        PRODUCTION_DOMAIN: 'https://smartvletool.com',
        
        // Brand & Application Info:
        SITE_NAME: 'SMART VLE TOOL',
        WEBSITE_NAME: 'smartvletool',
        SITE_TAGLINE: 'Free Online Image Editing & Document Tools for VLEs & Students',
        SUPPORT_EMAIL: 'customer@smartvletool.in',

        /**
         * Resolves the active base URL dynamically.
         */
        getBaseUrl: function () {
            if (this.PRODUCTION_DOMAIN && 
                this.PRODUCTION_DOMAIN !== 'YOUR_DOMAIN_HERE' && 
                !this.PRODUCTION_DOMAIN.includes('YOUR_DOMAIN')) {
                return this.PRODUCTION_DOMAIN.replace(/\/+$/, '');
            }
            if (typeof window !== 'undefined' && window.location && window.location.origin) {
                return window.location.origin;
            }
            return 'https://smartvletool.com';
        },

        /**
         * Constructs a canonical URL for any route path
         */
        getCanonicalUrl: function (path) {
            const base = this.getBaseUrl();
            const cleanPath = (path || '/').startsWith('/') ? path : '/' + path;
            return base + cleanPath;
        },

        /**
         * Synchronizes static HTML metadata and JSON-LD schemas with the active domain
         */
        syncMetaAndSchema: function () {
            const baseUrl = this.getBaseUrl();
            if (!baseUrl) return;

            // Update canonical
            const canonicalLink = document.querySelector('link[rel="canonical"]');
            if (canonicalLink) {
                const currentHref = canonicalLink.getAttribute('href') || '';
                if (currentHref.includes('YOUR_DOMAIN') || currentHref.includes('monucomputers.com')) {
                    canonicalLink.setAttribute('href', this.getCanonicalUrl(window.location.pathname));
                }
            }

            // Update OpenGraph URL
            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) {
                const currentContent = ogUrl.getAttribute('content') || '';
                if (currentContent.includes('YOUR_DOMAIN') || currentContent.includes('monucomputers.com')) {
                    ogUrl.setAttribute('content', this.getCanonicalUrl(window.location.pathname));
                }
            }

            // Update JSON-LD structured data URLs
            document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
                try {
                    let text = script.textContent;
                    if (text && (text.includes('monucomputers.com') || text.includes('YOUR_DOMAIN_HERE'))) {
                        script.textContent = text.replace(/https:\/\/(?:monucomputers\.com|YOUR_DOMAIN_HERE)/g, baseUrl);
                    }
                } catch (e) {
                    // Ignore JSON parse errors
                }
            });
        }
    };

    window.MONU_SITE_CONFIG = SITE_CONFIG;
    window.MONU_CONFIG = SITE_CONFIG; // backwards compatibility

    // Run metadata synchronization as soon as DOM is ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                SITE_CONFIG.syncMetaAndSchema();
            });
        } else {
            SITE_CONFIG.syncMetaAndSchema();
        }
    }
})();
