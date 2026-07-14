import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CONFIG = {
    AUTH_TOKEN: '1349636:Lx4AfqGh0E2Kbd68COZmDyngc3HPIjQr',
    DEVICE_DATA: {
        app_reg_id: "dr5gziOnST6nZQFPrTGbda:APA91bFSvNYNiC_68rtd0q3tA-yX-vYcuYqTUTcc53PwWdDst_E4RrIaUGdxwRkymkLPlydc-W7Amc0IpDjoNF5k9-kShFZSxhiKFduaLcbOZzAsH0VmzBM",
        phone_uuid: "dr5gziOnST6nZQFPrTGbda", phone_model: "vivo 1935", phone_android_version: "10",
        app_version_code: "260115", auth_username: "jokowiiiiii", app_version_name: "26.01.15"
    },
    VOUCHER: { DANA: "3056", OVO: "11886", GOPAY: "3062", SHOPEEPAY: "3058" } as Record<string, string>
};

async function hitAPI(url: string, data: Record<string, string>) {
    try {
        const payload = { ...CONFIG.DEVICE_DATA, ...data, auth_token: CONFIG.AUTH_TOKEN, request_time: Date.now().toString(), ui_mode: 'dark' };
        const params = new URLSearchParams(); for (const k in payload) params.append(k, payload[k]);
        const r = await axios.post(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Host': 'app.orderkuota.com', 'User-Agent': 'okhttp/4.9.3', 'auth-token': CONFIG.AUTH_TOKEN } });
        return r.data;
    } catch (e: any) { return { success: false, message: "Koneksi Error" }; }
}

export async function POST(request: NextRequest) {
    try {
        const { wallet, phone, nominal } = await request.json();
        const vid = CONFIG.VOUCHER[wallet] || CONFIG.VOUCHER.DANA;
        const result = await hitAPI('https://app.orderkuota.com/api/v2/order', { quantity: "1", id_plgn: nominal, kode_promo: "", pin: "", phone, voucher_id: vid, payment: "balance" });
        if (result.success) return NextResponse.json({ success: true, idTrx: result.results?.id || result.data?.id || "N/A" });
        return NextResponse.json({ success: false, message: result.message });
    } catch (e) { return NextResponse.json({ success: false, message: "Gagal memproses order" }); }
}