'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [longLivedToken, setLongLivedToken] = useState(null);

  // Function to exchange short-lived token for long-lived token
  const getLongLivedToken = async (shortLivedToken) => {
    const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const clientSecret = process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET;

    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${shortLivedToken}`
      );

      const data = await response.json();
      const longLivedToken = data.access_token;

      if (longLivedToken) {
        setLongLivedToken(longLivedToken);
      } else {
        console.error('Error retrieving long-lived token');
      }
      
    } catch (error) {
      console.error('Error exchanging token: ', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        if (token) {
          setAccessToken(token);
          // Exchange short-lived token for long-lived token
          getLongLivedToken(token);
          return;
        }
      }
    }

    if (router.isReady) {
      const { access_token } = router.query;
      if (access_token) {
        setAccessToken(access_token);
      }
    }
  }, [router.isReady, router.query]);

  const copyToClipboard = () => {
    if (longLivedToken) {
      navigator.clipboard.writeText(longLivedToken).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Pesan sukses muncul selama 2 detik
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: '24rem' }}>
        {longLivedToken ? (
          <div className="text-center">
            <h1 className="card-title mb-4">Facebook Access Token</h1>
            <div className="card bg-light p-3 mb-3">
              <p className="text-break">{longLivedToken}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="btn btn-primary btn-block"
            >
              {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            {copySuccess && (
              <p className="text-success mt-2">Access token copied to clipboard!</p>
            )}
          </div>
        ) : (
          <p className="text-center">Getting Access Token...</p>
        )}
      </div>
    </div>
  );
};

export default Page;
