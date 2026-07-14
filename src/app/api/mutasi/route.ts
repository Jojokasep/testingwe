import { NextResponse } from 'next/server';
import axios from 'axios';

const CONFIG = {
    AUTH_TOKEN: '1349636:Lx4AfqGh0E2Kbd68COZmDyngc3HPIjQr',
    DEVICE_DATA: {
        app_reg_id: "dr5gziOnST6nZQFPrTGbda:APA91bFSvNYNiC_68rtd0q3tA-yX-vYcuYqTUTcc53PwWdDst_E4RrIaUGdxwRkymkLPlydc-W7Amc0IpDjoNF5k9-kShFZSxhiKFduaLcbOZzAsH0VmzBM",
        phone_uuid: "dr5gziOnST6nZQFPrTGbda",
        phone_model: "vivo 1935",
        phone_android_version: "10",
        app_version_code: "260115",
        auth_username: "jokowiiiiii",
        app_version_name: "26.01.15"
    }
};

async function hitOrderkuotaAPI(url: string, data: Record<string, string>) {
    try {
        // Menggunakan 'as any' agar TypeScript tidak error saat indexing payload
        const payload: any = { ...CONFIG.DEVICE_DATA, ...data, auth_token: CONFIG.AUTH_TOKEN, request_time: Date.now().toString(), ui_mode: 'dark' };
        const params = new URLSearchParams();
        for (const key in payload) params.append(key, payload[key]);

        const response = await axios.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': 'app.orderkuota.com',
                'User-Agent': 'okhttp/4.9.3',
                'auth-token': CONFIG.AUTH_TOKEN
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("API Error:", error.message);
        return { success: false, message: "Koneksi Error" };
    }
}

function cleanNumber(str: any): number {
    if (!str) return 0;
    return Number(String(str).replace(/[^0-9]/g, '')) || 0;
}

export async function GET() {
    const result = await hitOrderkuotaAPI('https://app.orderkuota.com/api/v2/qris/mutasi/1349636', {
        'requests[0]': 'account',
        'requests[qris_history][page]': '1',
        'requests[qris_history][dari_tanggal]': '',
        'requests[qris_history][ke_tanggal]': '',
        'requests[qris_history][keterangan]': ''
    });

    const transactions = result.qris_history?.results;

    if (result.success && transactions && transactions.length > 0) {
        const cleanList = transactions.map((t: any) => ({
            ...t,
            kredit_clean: cleanNumber(t.kredit),
            status: t.status 
        }));
        return NextResponse.json({ success: true, data: cleanList });
    } else {
        return NextResponse.json({ success: false, data: [] });
    }
}
