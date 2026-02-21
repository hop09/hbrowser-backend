/**
 * Fingerprint Detection & Scoring Engine
 * Analyzes browser fingerprint and provides a privacy/anonymity score
 */

class FingerprintDetector {
    constructor() {
        this.checks = [];
        this.categories = {
            location: { name: 'Location & Time', icon: '📍', checks: [], score: 0 },
            browser: { name: 'Browser', icon: '🌐', checks: [], score: 0 },
            system: { name: 'System', icon: '💻', checks: [], score: 0 },
            webgl: { name: 'WebGL', icon: '🎨', checks: [], score: 0 },
            canvas: { name: 'Canvas', icon: '🖼️', checks: [], score: 0 },
            audio: { name: 'Audio', icon: '🔊', checks: [], score: 0 },
            network: { name: 'Network', icon: '🌍', checks: [], score: 0 }
        };
        this.overallScore = 0;
        this.ipData = null;
    }

    async analyze() {
        // Fetch IP data first (needed for location checks)
        await this.fetchIpData();

        // Run all detection modules
        await Promise.all([
            this.checkLocation(),
            this.checkBrowser(),
            this.checkSystem(),
            this.checkWebGL(),
            this.checkCanvas(),
            this.checkAudio(),
            this.checkNetwork()
        ]);

        // Calculate scores
        this.calculateScores();

        return {
            overallScore: this.overallScore,
            categories: this.categories
        };
    }

    // Fetch IP geolocation data
    async fetchIpData() {
        try {
            const response = await fetch('/api/fingerprint/ip');
            if (response.ok) {
                this.ipData = await response.json();
            }
        } catch (e) {
            console.log('Could not fetch IP data:', e);
            this.ipData = { success: false };
        }
    }

    // Location & Time Checks
    async checkLocation() {
        const checks = [];

        // Get browser timezone
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const browserTime = new Date();
        const browserTimeStr = browserTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        // IP Address
        if (this.ipData && this.ipData.success) {
            checks.push({
                name: 'IP Address',
                value: this.ipData.ip,
                status: 'pass',
                detail: 'Your public IP address'
            });

            // Country
            checks.push({
                name: 'Country',
                value: `${this.ipData.country} (${this.ipData.countryCode})`,
                status: 'pass',
                detail: 'Country based on IP geolocation'
            });

            // City & Region
            checks.push({
                name: 'Location',
                value: `${this.ipData.city}, ${this.ipData.region}`,
                status: 'pass',
                detail: 'City and region based on IP'
            });

            // ISP
            checks.push({
                name: 'ISP',
                value: this.ipData.isp,
                status: 'pass',
                detail: 'Internet Service Provider'
            });

            // IP Timezone
            const ipTimezone = this.ipData.timezone;
            checks.push({
                name: 'IP Timezone',
                value: ipTimezone,
                status: 'pass',
                detail: 'Timezone based on IP location'
            });

            // Browser Timezone
            checks.push({
                name: 'Browser Timezone',
                value: browserTimezone,
                status: 'pass',
                detail: 'Timezone from browser settings'
            });

            // Timezone Match Check (CRITICAL)
            const timezonesMatch = this.compareTimezones(ipTimezone, browserTimezone);
            checks.push({
                name: 'Timezone Match',
                value: timezonesMatch.match ? 'Match ✓' : 'Mismatch ✗',
                status: timezonesMatch.match ? 'pass' : 'danger',
                detail: timezonesMatch.detail
            });

            // Calculate expected time from IP timezone
            const ipTime = this.getTimeInTimezone(ipTimezone);
            checks.push({
                name: 'Expected Time (IP)',
                value: ipTime,
                status: 'pass',
                detail: `Time based on IP timezone (${ipTimezone})`
            });
        } else {
            checks.push({
                name: 'IP Data',
                value: 'Could not retrieve',
                status: 'warning',
                detail: 'IP geolocation service unavailable'
            });

            checks.push({
                name: 'Browser Timezone',
                value: browserTimezone,
                status: 'pass',
                detail: 'Timezone from browser settings'
            });
        }

        // Browser/System Time
        checks.push({
            name: 'Browser Time',
            value: browserTimeStr,
            status: 'pass',
            detail: 'Current time from browser'
        });

        // System Date
        const dateStr = browserTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        checks.push({
            name: 'System Date',
            value: dateStr,
            status: 'pass',
            detail: 'Current date from system clock'
        });

        // UTC Offset
        const utcOffset = -browserTime.getTimezoneOffset() / 60;
        const utcOffsetStr = `UTC${utcOffset >= 0 ? '+' : ''}${utcOffset}`;
        checks.push({
            name: 'UTC Offset',
            value: utcOffsetStr,
            status: 'pass',
            detail: 'Offset from Coordinated Universal Time'
        });

        // Timezone Offset Consistency
        if (this.ipData && this.ipData.success) {
            const expectedOffset = this.getTimezoneOffset(this.ipData.timezone);
            const actualOffset = -browserTime.getTimezoneOffset();
            const offsetMatch = Math.abs(expectedOffset - actualOffset) <= 60; // Within 1 hour

            checks.push({
                name: 'UTC Offset Match',
                value: offsetMatch ? 'Consistent ✓' : `Mismatch: Expected ${expectedOffset / 60}h, Got ${actualOffset / 60}h`,
                status: offsetMatch ? 'pass' : 'danger',
                detail: offsetMatch ? 'Browser offset matches IP location' : 'Browser timezone offset differs from expected'
            });
        }

        this.categories.location.checks = checks;
    }

    // Browser Checks
    async checkBrowser() {
        const nav = navigator;
        const checks = [];

        // User Agent
        const ua = nav.userAgent;
        const uaValid = this.validateUserAgent(ua);
        checks.push({
            name: 'User Agent',
            value: ua,
            status: uaValid.status,
            detail: uaValid.detail
        });

        // Platform Consistency
        const platform = nav.platform;
        const platformMatch = this.checkPlatformConsistency(ua, platform);
        checks.push({
            name: 'Platform',
            value: platform,
            status: platformMatch ? 'pass' : 'warning',
            detail: platformMatch ? 'Matches User Agent' : 'May not match User Agent'
        });

        // Languages
        const languages = nav.languages ? nav.languages.join(', ') : nav.language;
        checks.push({
            name: 'Languages',
            value: languages,
            status: 'pass',
            detail: 'Language settings detected'
        });

        // Timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        checks.push({
            name: 'Timezone',
            value: timezone,
            status: 'pass',
            detail: 'Browser timezone'
        });

        // Cookies Enabled
        const cookiesEnabled = nav.cookieEnabled;
        checks.push({
            name: 'Cookies',
            value: cookiesEnabled ? 'Enabled' : 'Disabled',
            status: cookiesEnabled ? 'pass' : 'warning',
            detail: cookiesEnabled ? 'Cookies are enabled' : 'Cookies disabled may break sites'
        });

        // Do Not Track
        const dnt = nav.doNotTrack;
        checks.push({
            name: 'Do Not Track',
            value: dnt === '1' ? 'Enabled' : dnt === '0' ? 'Disabled' : 'Not Set',
            status: 'pass',
            detail: 'DNT header preference'
        });

        // Plugins count (privacy indicator)
        const plugins = nav.plugins ? nav.plugins.length : 0;
        checks.push({
            name: 'Plugins',
            value: `${plugins} detected`,
            status: plugins <= 5 ? 'pass' : 'warning',
            detail: plugins <= 5 ? 'Normal plugin count' : 'Many plugins may aid fingerprinting'
        });

        this.categories.browser.checks = checks;
    }

    // System Checks
    async checkSystem() {
        const checks = [];

        // Screen Resolution
        const screenRes = `${screen.width}x${screen.height}`;
        const isCommonRes = this.isCommonResolution(screen.width, screen.height);
        checks.push({
            name: 'Screen Resolution',
            value: screenRes,
            status: isCommonRes ? 'pass' : 'warning',
            detail: isCommonRes ? 'Common resolution' : 'Uncommon resolution may aid fingerprinting'
        });

        // Color Depth
        const colorDepth = screen.colorDepth;
        checks.push({
            name: 'Color Depth',
            value: `${colorDepth} bits`,
            status: colorDepth === 24 || colorDepth === 32 ? 'pass' : 'warning',
            detail: 'Display color depth'
        });

        // Device Pixel Ratio
        const dpr = window.devicePixelRatio || 1;
        checks.push({
            name: 'Device Pixel Ratio',
            value: dpr.toString(),
            status: 'pass',
            detail: 'Display scaling factor'
        });

        // Hardware Concurrency (CPU Cores)
        const cores = navigator.hardwareConcurrency || 'Unknown';
        const coresSpoofed = this.checkHardwareConcurrency(cores);
        checks.push({
            name: 'CPU Cores',
            value: cores.toString(),
            status: coresSpoofed.status,
            detail: coresSpoofed.detail
        });

        // Device Memory
        const memory = navigator.deviceMemory || 'Unknown';
        checks.push({
            name: 'Device Memory',
            value: memory !== 'Unknown' ? `${memory} GB` : 'Not exposed',
            status: 'pass',
            detail: memory === 'Unknown' ? 'Memory not exposed' : 'Standard memory reporting'
        });

        // Touch Support
        const touchSupport = this.getTouchSupport();
        checks.push({
            name: 'Touch Support',
            value: touchSupport.value,
            status: 'pass',
            detail: touchSupport.detail
        });

        // Max Touch Points
        const maxTouch = navigator.maxTouchPoints || 0;
        checks.push({
            name: 'Max Touch Points',
            value: maxTouch.toString(),
            status: 'pass',
            detail: 'Maximum touch points supported'
        });

        this.categories.system.checks = checks;
    }

    // WebGL Checks
    async checkWebGL() {
        const checks = [];

        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (gl) {
                // WebGL Vendor
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                let vendor = 'Unknown';
                let renderer = 'Unknown';

                if (debugInfo) {
                    vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                }

                const vendorAnalysis = this.analyzeWebGLVendor(vendor, renderer);
                checks.push({
                    name: 'WebGL Vendor',
                    value: vendor,
                    status: vendorAnalysis.status,
                    detail: vendorAnalysis.detail
                });

                checks.push({
                    name: 'WebGL Renderer',
                    value: renderer,
                    status: vendorAnalysis.status,
                    detail: 'GPU renderer string'
                });

                // WebGL Parameters
                const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                checks.push({
                    name: 'Max Texture Size',
                    value: maxTexture.toString(),
                    status: 'pass',
                    detail: 'Maximum texture dimension'
                });

                const maxViewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
                checks.push({
                    name: 'Max Viewport',
                    value: maxViewport ? `${maxViewport[0]}x${maxViewport[1]}` : 'Unknown',
                    status: 'pass',
                    detail: 'Maximum viewport dimensions'
                });

                // WebGL noise detection (check for fingerprint protection)
                const noiseDetected = await this.detectWebGLNoise(gl);
                checks.push({
                    name: 'Noise Protection',
                    value: noiseDetected ? 'Detected' : 'Not Detected',
                    status: noiseDetected ? 'pass' : 'warning',
                    detail: noiseDetected ? 'WebGL noise injection detected (protected)' : 'No noise protection'
                });
            } else {
                checks.push({
                    name: 'WebGL Support',
                    value: 'Disabled',
                    status: 'pass',
                    detail: 'WebGL is disabled (good for privacy)'
                });
            }
        } catch (e) {
            checks.push({
                name: 'WebGL',
                value: 'Error',
                status: 'warning',
                detail: e.message
            });
        }

        this.categories.webgl.checks = checks;
    }

    // Canvas Checks
    async checkCanvas() {
        const checks = [];

        try {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 50;
            const ctx = canvas.getContext('2d');

            // Draw test pattern
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('Fingerprint Test', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('Canvas Check', 4, 17);

            const dataUrl = canvas.toDataURL();
            const hash = this.simpleHash(dataUrl);

            checks.push({
                name: 'Canvas Fingerprint',
                value: `Hash: ${hash.substring(0, 16)}...`,
                status: 'pass',
                detail: 'Unique canvas signature generated'
            });



            // Canvas 2D support
            checks.push({
                name: 'Canvas 2D',
                value: 'Supported',
                status: 'pass',
                detail: 'Canvas 2D context available'
            });

        } catch (e) {
            checks.push({
                name: 'Canvas',
                value: 'Blocked/Error',
                status: 'pass',
                detail: 'Canvas access blocked (privacy protected)'
            });
        }

        this.categories.canvas.checks = checks;
    }

    // Audio Checks
    async checkAudio() {
        const checks = [];

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const audioCtx = new AudioContext();

                checks.push({
                    name: 'Audio Context',
                    value: 'Supported',
                    status: 'pass',
                    detail: 'Web Audio API available'
                });

                checks.push({
                    name: 'Sample Rate',
                    value: `${audioCtx.sampleRate} Hz`,
                    status: 'pass',
                    detail: 'Audio sample rate'
                });



                audioCtx.close();
            } else {
                checks.push({
                    name: 'Audio Context',
                    value: 'Not Supported',
                    status: 'pass',
                    detail: 'Web Audio API not available'
                });
            }
        } catch (e) {
            checks.push({
                name: 'Audio',
                value: 'Blocked',
                status: 'pass',
                detail: 'Audio context blocked (privacy protected)'
            });
        }

        this.categories.audio.checks = checks;
    }

    // Network Checks
    async checkNetwork() {
        const checks = [];

        // WebRTC Leak Check
        const webrtcResult = await this.checkWebRTC();
        checks.push({
            name: 'WebRTC',
            value: webrtcResult.value,
            status: webrtcResult.status,
            detail: webrtcResult.detail
        });

        // Connection Type
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            checks.push({
                name: 'Connection Type',
                value: connection.effectiveType || 'Unknown',
                status: 'pass',
                detail: 'Network connection type'
            });

            checks.push({
                name: 'Downlink',
                value: connection.downlink ? `${connection.downlink} Mbps` : 'Unknown',
                status: 'pass',
                detail: 'Estimated downlink speed'
            });
        } else {
            checks.push({
                name: 'Network Info',
                value: 'Not exposed',
                status: 'pass',
                detail: 'Network API not available (good for privacy)'
            });
        }

        // Online Status
        checks.push({
            name: 'Online Status',
            value: navigator.onLine ? 'Online' : 'Offline',
            status: 'pass',
            detail: 'Current network status'
        });

        this.categories.network.checks = checks;
    }

    // Helper Methods
    validateUserAgent(ua) {
        // Check for common spoofing indicators
        const suspicious = [];

        // Check for headless indicators
        if (ua.includes('HeadlessChrome')) {
            suspicious.push('Headless browser detected');
        }

        // Check version consistency
        // Check version consistency
        const chromeMatch = ua.match(/Chrome\/(\d+)/);
        if (chromeMatch && parseInt(chromeMatch[1]) > 200) {
            suspicious.push('Suspiciously high Chrome version');
        }

        if (suspicious.length > 0) {
            return { status: 'warning', detail: suspicious.join(', ') };
        }
        return { status: 'pass', detail: 'User Agent appears valid' };
    }

    checkPlatformConsistency(ua, platform) {
        if (ua.includes('Windows') && platform.includes('Win')) return true;
        if (ua.includes('Mac') && platform.includes('Mac')) return true;
        if (ua.includes('Linux') && platform.includes('Linux')) return true;
        if (ua.includes('Android') && platform.includes('Linux')) return true;
        if (ua.includes('iPhone') || ua.includes('iPad')) return true;
        return false;
    }

    isCommonResolution(width, height) {
        const common = [
            '1920x1080', '1366x768', '1536x864', '1440x900', '1280x720',
            '2560x1440', '3840x2160', '1600x900', '1280x800', '1280x1024',
            '2560x1080', '3440x1440', '1680x1050', '1024x768'
        ];
        return common.includes(`${width}x${height}`);
    }

    checkHardwareConcurrency(cores) {
        if (cores === 'Unknown') {
            return { status: 'pass', detail: 'CPU cores hidden (good for privacy)' };
        }
        if ([2, 4, 6, 8, 12, 16, 24, 32].includes(cores)) {
            return { status: 'pass', detail: 'Common CPU core count' };
        }
        return { status: 'warning', detail: 'Unusual CPU core count' };
    }

    getTouchSupport() {
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        return {
            value: hasTouch ? 'Supported' : 'Not Supported',
            detail: hasTouch ? 'Touch input available' : 'No touch support'
        };
    }

    analyzeWebGLVendor(vendor, renderer) {
        // Check for common spoofing patterns
        if (vendor.includes('Brian Paul') || renderer.includes('Mesa')) {
            return { status: 'warning', detail: 'Software renderer detected' };
        }
        if (vendor === 'Unknown' || renderer === 'Unknown') {
            return { status: 'pass', detail: 'WebGL info hidden' };
        }
        return { status: 'pass', detail: 'Hardware GPU detected' };
    }

    async detectWebGLNoise(gl) {
        // Simple noise detection: render same scene twice and compare
        try {
            const canvas = gl.canvas;
            canvas.width = 50;
            canvas.height = 50;

            // First render
            gl.clearColor(0.5, 0.5, 0.5, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            const pixels1 = new Uint8Array(4);
            gl.readPixels(25, 25, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels1);

            // Second render (should be identical without noise)
            gl.clear(gl.COLOR_BUFFER_BIT);
            const pixels2 = new Uint8Array(4);
            gl.readPixels(25, 25, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels2);

            // Compare
            for (let i = 0; i < 4; i++) {
                if (pixels1[i] !== pixels2[i]) return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }



    async checkWebRTC() {
        try {
            const pc = new RTCPeerConnection({ iceServers: [] });
            pc.createDataChannel('');

            return new Promise((resolve) => {
                const ips = [];
                let timeout;

                pc.onicecandidate = (e) => {
                    if (e.candidate) {
                        const match = e.candidate.candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
                        if (match) {
                            const ip = match[0];
                            if (!ips.includes(ip)) ips.push(ip);
                        }
                    }
                };

                pc.createOffer().then(offer => pc.setLocalDescription(offer));

                timeout = setTimeout(() => {
                    pc.close();
                    if (ips.length === 0) {
                        resolve({
                            value: 'Protected',
                            status: 'pass',
                            detail: 'No IP leak via WebRTC'
                        });
                    } else {
                        resolve({
                            value: `${ips.length} IP(s) exposed`,
                            status: 'danger',
                            detail: `Leaking: ${ips.join(', ')}`
                        });
                    }
                }, 1000);
            });
        } catch (e) {
            return {
                value: 'Blocked',
                status: 'pass',
                detail: 'WebRTC is disabled'
            };
        }
    }

    // Timezone comparison helper
    compareTimezones(ipTz, browserTz) {
        // Direct match
        if (ipTz === browserTz) {
            return { match: true, detail: 'Browser and IP timezones match exactly' };
        }

        // Check for equivalent timezones (e.g., "America/New_York" and "America/Toronto" in same offset)
        try {
            const now = new Date();
            const ipOffset = this.getTimezoneOffset(ipTz);
            const browserOffset = this.getTimezoneOffset(browserTz);

            if (ipOffset === browserOffset) {
                return {
                    match: true,
                    detail: `Same UTC offset: ${ipTz} and ${browserTz} both at UTC${ipOffset >= 0 ? '+' : ''}${ipOffset / 60}`
                };
            }

            const hourDiff = Math.abs(ipOffset - browserOffset) / 60;
            return {
                match: false,
                detail: `Timezone mismatch: IP suggests ${ipTz}, but browser is set to ${browserTz} (${hourDiff}h difference)`
            };
        } catch (e) {
            return { match: false, detail: 'Could not compare timezones' };
        }
    }

    // Get offset in minutes for a timezone
    getTimezoneOffset(tz) {
        try {
            const now = new Date();
            const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
            const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }));
            return (tzDate - utcDate) / 60000; // Difference in minutes
        } catch (e) {
            return 0;
        }
    }

    // Get current time in a specific timezone
    getTimeInTimezone(tz) {
        try {
            return new Date().toLocaleTimeString('en-US', {
                timeZone: tz,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch (e) {
            return 'Unknown';
        }
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    calculateScores() {
        let totalPassed = 0;
        let totalChecks = 0;

        for (const categoryKey in this.categories) {
            const category = this.categories[categoryKey];
            let categoryPassed = 0;

            for (const check of category.checks) {
                totalChecks++;
                if (check.status === 'pass') {
                    categoryPassed++;
                    totalPassed++;
                } else if (check.status === 'warning') {
                    // Warnings don't deduct points, they just flag potential optimizations
                    totalPassed++;
                    categoryPassed++;
                }
            }

            category.score = category.checks.length > 0
                ? Math.round((categoryPassed / category.checks.length) * 100)
                : 100;
        }

        this.overallScore = totalChecks > 0
            ? Math.round((totalPassed / totalChecks) * 100)
            : 0;
    }
}

// Category icon map
const categoryIcons = {
    location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    browser: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
    system: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    webgl: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>`,
    canvas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
    audio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>`
};

const statusIcons = {
    pass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    fail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    danger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

// Collect all red flags
let allRedFlags = [];

// Initialize and run detection
// Initialize and run detection
async function initFingerprint() {
    const detector = new FingerprintDetector();
    const results = await detector.analyze();

    // Collect red flags from all categories
    allRedFlags = [];
    for (const key in results.categories) {
        for (const check of results.categories[key].checks) {
            if (check.status === 'fail' || check.status === 'danger') {
                allRedFlags.push({ category: results.categories[key].name, ...check });
            }
        }
    }

    // Update UI
    updateScore(results.overallScore, allRedFlags);
    updateCategories(results.categories);

    // Hide preloader if exists
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 500);
}

// Run immediately if DOM is loaded (Next.js), otherwise wait for event
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initFingerprint();
} else {
    document.addEventListener('DOMContentLoaded', initFingerprint);
}

function updateScore(score, redFlags) {
    const scoreValue = document.getElementById('scoreValue');
    const scoreProgress = document.getElementById('scoreProgress');
    const scoreStatus = document.getElementById('scoreStatus');
    const scoreDescription = document.getElementById('scoreDescription');
    const redFlagsEl = document.getElementById('redFlags');
    const redFlagsList = document.getElementById('redFlagsList');

    // Animate score number
    let current = 0;
    const increment = score / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
            current = score;
            clearInterval(timer);
        }
        scoreValue.textContent = Math.round(current);
    }, 20);

    // Update progress ring (radius 130 for new SVG)
    const circumference = 2 * Math.PI * 130;
    const offset = circumference - (score / 100) * circumference;
    scoreProgress.style.strokeDasharray = circumference;
    scoreProgress.style.strokeDashoffset = offset;

    // Set color class and status
    if (score >= 80) {
        scoreProgress.classList.add('stroke-emerald-500');
        scoreStatus.className = 'flex items-center gap-3 text-emerald-500 mb-3 text-sm font-bold tracking-widest uppercase';
        scoreStatus.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <path d="M22 4L12 14.01l-3-3"/>
            </svg>
            <span>Excellent Privacy</span>
        `;
        scoreDescription.textContent = 'Your browser demonstrates strong privacy protection. Fingerprint tracking is significantly hindered.';
    } else if (score >= 50) {
        scoreProgress.classList.add('stroke-amber-500');
        scoreStatus.className = 'flex items-center gap-3 text-amber-500 mb-3 text-sm font-bold tracking-widest uppercase';
        scoreStatus.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>Moderate Privacy</span>
        `;
        scoreDescription.textContent = 'Privacy concerns detected. Review the flagged issues below for recommended improvements.';
    } else {
        scoreProgress.classList.add('stroke-red-500');
        scoreStatus.className = 'flex items-center gap-3 text-red-500 mb-3 text-sm font-bold tracking-widest uppercase';
        scoreStatus.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
            <span>Low Privacy</span>
        `;
        scoreDescription.textContent = 'Your fingerprint is highly unique and easily trackable. Multiple critical issues require attention.';
    }

    // Show red flags if any
    if (redFlags.length > 0) {
        redFlagsEl.style.display = 'block';
        redFlagsList.innerHTML = redFlags.map(flag => `
            <li class="flex items-start gap-2">
                <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4 flex-shrink-0 mt-0.5" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <div>
                    <strong class="font-bold">${flag.name}</strong>: <span class="opacity-80">${flag.detail}</span>
                </div>
            </li>
        `).join('');
    }
}

// Store categories globally for modal access
let categoriesData = {};

function updateCategories(categories) {
    categoriesData = categories;
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = '';

    for (const key in categories) {
        const cat = categories[key];
        const card = createCategoryCard(key, cat);
        grid.appendChild(card);
    }

    // Setup modal event listeners
    setupModalListeners();
}

function createCategoryCard(key, category) {
    const card = document.createElement('div');
    card.className = 'glassmorphism p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300';
    card.dataset.category = key;

    // Count issues
    const issues = category.checks.filter(c => c.status === 'fail' || c.status === 'danger').length;
    const warnings = category.checks.filter(c => c.status === 'warning').length;

    let borderClass = 'border-transparent';
    if (issues > 0) borderClass = 'border-red-500/50';
    else if (warnings > 0) borderClass = 'border-amber-500/50';

    if (issues > 0 || warnings > 0) {
        card.className += ` border ${borderClass}`;
    }

    const scoreClass = category.score >= 80 ? 'text-emerald-500' : category.score >= 50 ? 'text-amber-500' : 'text-red-500';
    const icon = categoryIcons[key] || categoryIcons.browser;

    // Show first 3 checks as preview
    const previewChecks = category.checks.slice(0, 3);

    let issuesBadge = '';
    if (issues > 0) {
        issuesBadge = `<span class="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px] ml-2 font-bold">${issues} ISSUE${issues > 1 ? 'S' : ''}</span>`;
    }

    card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div class="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center text-black dark:text-white *:w-6 *:h-6 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                ${icon}
            </div>
            <div class="text-xl font-black tabular-nums ${scoreClass}">${category.score}%</div>
        </div>
        <div>
            <h3 class="text-sm font-bold tracking-widest uppercase">${category.name}</h3>
            <p class="text-xs opacity-50 font-medium uppercase tracking-widest mt-1 mb-4 flex items-center">${category.checks.length} checks ${issuesBadge}</p>
        </div>
        <div class="flex flex-col gap-2 flex-1">
            ${previewChecks.map(check => createCheckRow(check)).join('')}
        </div>
        <button class="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity w-full" onclick="openModal('${key}')">
            <span>View Details</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        </button>
    `;

    return card;
}

function createCheckRow(check) {
    let iconClass = 'text-emerald-500';
    if (check.status === 'warning') iconClass = 'text-amber-500';
    if (check.status === 'danger' || check.status === 'fail') iconClass = 'text-red-500';

    const icon = statusIcons[check.status] || statusIcons.pass;

    return `
        <div class="flex items-start gap-3 text-xs">
            <div class="mt-0.5 w-4 h-4 flex-shrink-0 ${iconClass} *:w-full *:h-full">${icon}</div>
            <div class="flex-1 min-w-0">
                <div class="font-bold uppercase tracking-widest truncate">${check.name}</div>
                <div class="opacity-60 truncate">${check.value}</div>
            </div>
        </div>
    `;
}

function openModal(categoryKey) {
    const modal = document.getElementById('detailModal');
    const category = categoriesData[categoryKey];
    if (!category) return;

    const icon = categoryIcons[categoryKey] || categoryIcons.browser;

    document.getElementById('modalIcon').innerHTML = icon;
    document.getElementById('modalTitle').textContent = category.name;
    document.getElementById('modalSubtitle').textContent = `${category.checks.length} checks • Score: ${category.score}%`;

    const checksContainer = document.getElementById('modalChecks');
    checksContainer.innerHTML = category.checks.map(check => {
        let iconColorClass = 'text-emerald-500';
        if (check.status === 'warning') iconColorClass = 'text-amber-500';
        if (check.status === 'danger' || check.status === 'fail') iconColorClass = 'text-red-500';

        const statusIcon = statusIcons[check.status] || statusIcons.pass;

        return `
            <div class="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-5 h-5 flex-shrink-0 ${iconColorClass} *:w-full *:h-full">${statusIcon}</div>
                    <span class="text-sm font-bold uppercase tracking-widest">${check.name}</span>
                </div>
                <div class="text-sm font-medium mb-1 pl-8">${check.value}</div>
                <div class="text-xs opacity-60 pl-8 leading-relaxed">${check.detail}</div>
            </div>
        `;
    }).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function setupModalListeners() {
    const modal = document.getElementById('detailModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
