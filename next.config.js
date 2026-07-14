/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [{
            // Menerapkan CORS untuk semua endpoint API
            // Agar HTML yang di-host di domain lain bisa mengakses API ini
            source: '/api/:path*',
            headers: [
                { key: 'Access-Control-Allow-Origin', value: '*' },
                { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
                { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
            ]
        }];
    }
};

module.exports = nextConfig;