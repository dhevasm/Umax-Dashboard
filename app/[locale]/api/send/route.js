import nodemailer from 'nodemailer';

/**
 * Sends an email using the provided parameters and returns a response indicating the success or failure of the operation.
 *
 * @param {Request} req - The request object containing the URL and search parameters.
 * @return {Promise<Response>} A Promise that resolves to a Response object with a JSON body indicating the success or failure of the email sending operation.
 */
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
