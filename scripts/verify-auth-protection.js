const http = require('http');

function check(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const req = http.request(url, { method }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers }));
        });
        req.on('error', reject);
        req.end();
    });
}

async function verify() {
    console.log('🚀 Verifying Auth Protection...');

    // 1. Landing Page (Public)
    const landing = await check('http://localhost:3001/');
    if (landing.statusCode === 200) {
        console.log('✅ Landing Page is Accessibility: Public (200)');
    } else {
        console.error(`❌ Landing Page Failed: ${landing.statusCode}`);
    }

    // 2. Dashboard (Protected -> Redirect)
    // Next.js middleware or auth guard should redirect to /login
    const dashboard = await check('http://localhost:3001/dashboard');
    // Note: http.request follows redirects? No, default is no.
    // If it redirects, status should be 307 or similar.
    // Wait, `authorized` callback in middleware returns false for dashboard -> redirects to login.
    // NextAuth usually redirects to /api/auth/signin?callbackUrl=... or configured pages.signIn

    // Let's see what we get.
    console.log(`ℹ️ Dashboard Status: ${dashboard.statusCode}`);
    if (dashboard.statusCode === 307 || dashboard.statusCode === 302 || dashboard.headers.location?.includes('/login')) {
        console.log('✅ Dashboard Redirects to Login');
    } else if (dashboard.statusCode === 200) {
        // It might be rendering the login page directly if using rewriting? 
        // Start by checking if we are redirected.
        console.warn('⚠️ Dashboard Returned 200 (Might be open or rendering login page?)');
    } else {
        console.error(`❌ Dashboard Unexpected Status: ${dashboard.statusCode}`);
    }

    // 3. Purchase API (Protected -> 401)
    const purchase = await check('http://localhost:3001/api/v1/deals/123/purchase', 'POST');
    if (purchase.statusCode === 401) {
        console.log('✅ Purchase API Protected (401)');
    } else {
        console.error(`❌ Purchase API Failed Protection: ${purchase.statusCode}`);
    }
}

verify();
