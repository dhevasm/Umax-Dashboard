import nodemailer from 'nodemailer';

/**
 * Sends an email using the provided parameters and returns a response indicating the success or failure of the operation.
 *
 * @param {Request} req - The request object containing the FormData parameters.
 * @return {Promise<Response>} A Promise that resolves to a Response object with a JSON body indicating the success or failure of the email sending operation.
 */
export async function POST(req) {
    const formData = await req.formData();
    const from = formData.get('from');
    const to = formData.get('to');
    const body = formData.get('body');

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
            to: to,
            subject: `Message from ${from}`,
            html: body
        });

        return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ success: false, message: 'Failed to send email' }), { status: 500 });
    }
}
