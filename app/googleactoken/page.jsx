'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Import axios to handle the token exchange

const Page = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null);

  // Function to exchange the authorization code for access and refresh tokens
  const exchangeCodeForToken = async (code) => {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // Replace with your Google client_id
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET, // Replace with your Google client_secret
        redirect_uri: 'http://127.0.0.1:51659/authorize/', // Replace with your redirect URI
        grant_type: 'authorization_code',
      }), { 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, refresh_token, expires_in } = response.data;

      // Store the tokens
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      console.log('Access Token:', access_token);
      console.log('Refresh Token:', refresh_token);
      setLoading(false); // Stop loading when tokens are set

    } catch (error) {
      console.error('Error exchanging code for access token:', error);
      setError('Failed to exchange code for access token');
      setLoading(false); // Stop loading even on error
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const { code } = router.query;

      if (code) {
        // Exchange authorization code for access token
        exchangeCodeForToken(code);
      } else {
        setLoading(false); // Stop loading if no code found
        setError('Authorization code not found in URL');
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

  if (loading) {
    return <p className="text-center">Getting Access Token....</p>;
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

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
              {copySuccess ? 'Copied!' : 'Copy Access Token' }
            </button>
            {copySuccess && (
              <p className="text-success mt-2">Token copied to clipboard!</p>
            )}
          </div>
        ) : (
          <p className="text-center">Access token not available</p>
        )}
      </div>
    </div>
  );
};

export default Page;
