'use client'
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Page = () => {
    const router = useRouter();
    const { code, state } = router.query;
  
    useEffect(() => {
      if (code) {
        const fetchAccessToken = async () => {
          try {
            const response = await axios.post(
              "https://open-api.tiktok.com/oauth/access_token/",
              {
                client_key: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID,
                client_secret: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                redirect_uri: `${window.location.origin}/tiktok/callback`,
              }
            );
  
            const { data } = response;
  
            if (data.data && data.data.access_token) {
              // Simpan token ke localStorage atau gunakan sesuai kebutuhan
              localStorage.setItem("tiktok_access_token", data.data.access_token);
              alert("Login successful!");
  
              // Arahkan ke halaman dashboard atau halaman lain
              router.push("/dashboard");
            } else {
              alert("Failed to login with TikTok");
            }
          } catch (error) {
            console.error("Error fetching access token:", error);
            alert("An error occurred while logging in with TikTok.");
          }
        };
  
        fetchAccessToken();
      }
    }, [code]);
  
    return (
      <div>
        <h1>Processing TikTok Login...</h1>
      </div>
    );
  }

export default Page