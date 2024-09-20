import { Inter } from "next/font/google";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nobox Analytics",
  description: "Ultimate Marketing Experience",

};

export default async function LocaleLayout({
  children,
  params: {locale}
}) { // no type annotations in JS
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="../assets/icon.png" />
      </head>
      <body>
      {/* <script src={`https://sandbox.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`} async></script> */}
      {/* <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID" ></script> */}
      <script type="text/javascript" src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} async></script>
        <NextIntlClientProvider messages={messages}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            {children}
          </GoogleOAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

