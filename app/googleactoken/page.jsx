'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to parse the URL hash and extract the access token
  const extractTokenFromHash = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        const tokenType = params.get('token_type');
        const expiresIn = params.get('expires_in');
        const scope = params.get('scope');

        if (token) {
          setAccessToken(token);
          // You can store or handle the token here as needed
          console.log('Access Token:', token);
          // Optionally, handle the refresh token or other parameters if needed
        } else {
          console.error('Access token not found in URL');
        }
      }
    }
  };

  useEffect(() => {
    extractTokenFromHash();

    if (router.isReady) {
      const { code } = router.query;
      if (code) {
        // You might want to exchange the authorization code for tokens if needed
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
            <h1 className="card-title mb-4">Google Access Token</h1>
            <div className="card bg-light p-3 mb-3">
              <p className="text-break"><strong>Access Token:</strong> {accessToken}</p>
            </div>
            <button
              onClick={() => copyToClipboard(accessToken)}
              className="btn btn-primary btn-block"
            >
              {copySuccess ? 'Copied!' : 'Copy Access Token'}
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
