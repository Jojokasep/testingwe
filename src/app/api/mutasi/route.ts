import { NextResponse } from 'next/server';
import axios from 'axios';

const CONFIG = {
    AUTH_TOKEN: '1349636:Lx4AfqGh0E2Kbd68COZmDyngc3HPIjQr',
    DEVICE_DATA: {
        app_reg_id: "dr5gziOnST6nZQFPrTGbda:APA91bFSvNYNiC_68rtd0q3tA-yX-vYcuYqTUTcc53PwWdDst_E4RrIaUGdxwRkymkLPlydc-W7Amc0IpDjoNF5k9-kShFZSxhiKFduaLcbOZzAsH0VmzBM",
        phone_uuid: "dr5gziOnST6nZQFPrTGbda", phone_model: "vivo 1935", phone_android_version: "10",
        app_version_code: "260115", auth_username: "jokowiiiiii", app_version_name: "26.01.15"
    }
};

async function hitAPI(url: string, data: Record<string, string>) {
    try {
        const payload = { ...CONFIG.DEVICE_DATA, ...data, auth_token: CONFIG.AUTH_TOKEN, request_time: Date.now().toString(), ui_mode: 'dark' };
        const params = new URLSearchParams(); for (const k in payload) params.append(k, payload[k]);
        const r = await axios.post(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Host': 'app.orderkuota.com', 'User-Agent': 'okhttp/4.9.3', 'auth-token': CONFIG.AUTH_TOKEN } });
        return r.data;
    } catch (e: any) { return { success: false, message: "Koneksi Error" }; }
}

export async function GET() {
    const result = await hitAPI('https://app.orderkuota.com/api/v2/qris/mutasi/1349636', {
        'requests[0]': 'account', 'requests[qris_history][page]': '1',
        'requests[qris_history][dari_tanggal]': '', 'requests[qris_history][ke_tanggal]': '', 'requests[qris_history][keterangan]': ''
    });
    const tx = result.qris_history?.results;
    if (result.success && tx && tx.length > 0) {
        const clean = tx.map((t: any) => ({ ...t, kredit_clean: Number(String(t.kredit).replace(/[^0-9]/g, '')) || 0, status: t.status }));
        return NextResponse.json({ success: true, data: clean });
    }
    return NextResponse.json({ success: false, data: [] });
}