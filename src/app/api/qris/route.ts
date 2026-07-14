import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const QRIS_RAW = "00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214508257991305870303UMI51440014ID.CO.QRIS.WWW0215ID20232921284770303UMI5204541153033605802ID5920JOJO STORE OK13496366006CIAMIS61054621162070703A0163045679";

export async function GET(request: NextRequest) {
    const amount = new URL(request.url).searchParams.get('amount');
    if (!amount) return NextResponse.json({ success: false, message: "Nominal wajib" });
    try {
        const response = await axios.post('https://qrisku.my.id/api', { qris_statis: QRIS_RAW, amount }, { headers: { 'Content-Type': 'application/json' } });
        if (response.data.status === 'success') return NextResponse.json({ success: true, qris_base64: response.data.qris_base64 });
        return NextResponse.json({ success: false, message: response.data.message });
    } catch (error) { return NextResponse.json({ success: false, message: "Gagal generate QRIS" }); }
}