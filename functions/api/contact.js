export async function onRequestPost({ request, env }) {
	const token = env.TELEGRAM_BOT_TOKEN;
	const chatId = env.TELEGRAM_CHAT_ID;

	if (!token || !chatId) {
		return new Response(JSON.stringify({ ok: false, error: 'Missing Telegram credentials' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	let data;
	try {
		data = await request.json();
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { type, phone = '', name = '', appliance = '', time = '' } = data;

	let message;
	if (type === 'booking') {
		message = `📅 NEW BOOKING REQUEST\nPhone: ${phone}\nName: ${name}\nAppliance: ${appliance}\nTime: ${time}`;
	} else if (type === 'callback') {
		message = `📞 CALLBACK REQUEST\nPhone: ${phone}`;
	} else {
		return new Response(JSON.stringify({ ok: false, error: 'Unknown type' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: chatId, text: message })
	});

	if (!tgRes.ok) {
		const errText = await tgRes.text();
		return new Response(JSON.stringify({ ok: false, error: 'Telegram send failed', detail: errText }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}
