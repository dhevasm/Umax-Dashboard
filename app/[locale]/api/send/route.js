import nodemailer from 'nodemailer';

export async function GET(req) {
    const url = new URL(req.url);
    const from = url.searchParams.get('from');
    const name = url.searchParams.get('name');
    const phone = url.searchParams.get('phone');
    const message = url.searchParams.get('message');

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.NEXT_PUBLIC_MAILER_EMAIL,
            pass: process.env.NEXT_PUBLIC_MAILER_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: from,
            to: process.env.NEXT_PUBLIC_MAILER_EMAIL,
            subject: `Message from ${name}`,
            text: `
                Name: ${name}
                Phone: ${phone}
                Message: ${message}
            `,
        });

        return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ success: false, message: 'Failed to send email' }), { status: 500 });
    }
}
