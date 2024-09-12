'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to extract the code from the query parameters
  const extractCodeFromQuery = () => {
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search);
      const code = query.get('code');
      if (code) {
        // Assuming you exchange the code for an access token here
        setAccessToken(code); // Set access token to the code (or later to the actual token if you exchange it)
        console.log('Code:', code);
      } else {
        console.error('Code not found in URL');
      }
    }
  };

  useEffect(() => {
    extractCodeFromQuery();

    if (router.isReady) {
      const { code } = router.query;
      if (code) {
        // Optionally handle the exchange of code for an access token
        // Implement token exchange logic here if necessary
      }
    }
  }, [router.isReady]);

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Show success message for 2 seconds
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: '24rem' }}>
        {accessToken ? (
          <div className="text-center">
            <h1 className="card-title mb-4">TikTok Access Token</h1>
            <div className="card bg-light p-3 mb-3">
              <p className="text-break"><strong>Access Token:</strong> {accessToken}</p>
            </div>
            <button
              onClick={() => copyToClipboard(accessToken)}
              className="btn btn-primary btn-block"
            >
              {copySuccess ? 'Copied!' : 'Copy Access Token' }
            </button>
            {copySuccess && (
              <p className="text-success mt-2">Token copied to clipboard!</p>
            )}
          </div>
        ) : (
          <p className="text-center">Access token tidak tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
