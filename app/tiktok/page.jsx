'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TiktokPage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (code) {
      const fetchAccessToken = async () => {
        try {
          const tokenResponse = await fetch(
            "https://open-api.tiktok.com/oauth/access_token/",
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_key: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID,
                client_secret: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                redirect_uri: `${window.location.origin}/tiktok`,
              }).toString(),
            }
          );

          if (!tokenResponse.ok) {
            throw new Error(`HTTP error! Status: ${tokenResponse.status}`);
          }

          const data = await tokenResponse.json();

          if (data.data && data.data.access_token) {
            const accessToken = data.data.access_token;
            localStorage.setItem("tiktok_access_token", accessToken);

            // Attempt to get user info
            const userResponse = await fetch(
              "https://open-api.tiktok.com/user/info/",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (!userResponse.ok) {
              throw new Error(`HTTP error! Status: ${userResponse.status}`);
            }

            const userData = await userResponse.json();
            setUserInfo(userData.data);
            setLoading(false);
          } else {
            console.error("Failed to retrieve access token:", data);
            alert("We couldn't log in with TikTok.");
            setError("Failed to retrieve access token.");
          }
        } catch (error) {
          console.error("Error fetching access token or user info:", error);
          alert("An error occurred while logging in with TikTok.");
          setError(error.message);
        }
      };

      fetchAccessToken();
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1>TikTok Login Process</h1>
      {userInfo ? (
        <div>
          <h2>Welcome, {userInfo.nickname}</h2>
          <p>Email: {userInfo.email}</p>
          <p>Access Token: {localStorage.getItem("tiktok_access_token")}</p>
        </div>
      ) : (
        <p>No user info available.</p>
      )}
    </>
  );
};

export default TiktokPage;
