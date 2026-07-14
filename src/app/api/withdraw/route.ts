import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount } = body;

        if (!amount || amount < 1000) {
            return NextResponse.json({ 
                success: false, 
                message: "Minimal transfer Rp 1.000" 
            });
        }

        const result = await hitOrderkuotaAPI('https://app.orderkuota.com/api/v2/get', {
            'requests[qris_withdraw][amount]': amount
        });

        if (result.success && result.qris_withdraw && result.qris_withdraw.success) {
            return NextResponse.json({
                success: true,
                message: `Saldo Rp ${Number(amount).toLocaleString('id-ID')} berhasil dipindahkan ke saldo utama.`
            });
        } else {
            return NextResponse.json({
                success: false,
                message: result.message || "Gagal memproses transfer"
            });
        }
    } catch (error) {
        console.error("Withdraw Error:", error);
        return NextResponse.json({ success: false, message: "Terjadi kesalahan server" });
    }
}
