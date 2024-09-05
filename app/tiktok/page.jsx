'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const TiktokPage = () => {
    const router = useRouter();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
      
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
                  redirect_uri: `${window.location.origin}/tiktok`,
                }
              );
      
              const { data } = response;
      
              if (data.data && data.data.access_token) {
                // Simpan token ke localStorage atau gunakan sesuai kebutuhan
                localStorage.setItem("tiktok_access_token", data.data.access_token);
                alert("Login successful!");
                document.getElementById('platform').value = 3
                router.push("/dashboard");
              } else {
                console.error("Failed to retrieve access token:", data);
                alert("We couldn't log in with TikTok.");
              }
            } catch (error) {
              console.error("Error fetching access token:", error.response?.data || error.message);
              alert("An error occurred while logging in with TikTok.");
            }
          };
      
          fetchAccessToken();
        }
      }, []);
}

export default TiktokPage;