import { useEffect } from "react";

export function OAuthPopupCallback() {
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');

    if (token && refreshToken && window.opener) {
      window.opener.postMessage({ token, refreshToken }, window.location.origin);
      window.close();
    }
  }, []);

  return <p>Processing...</p>;
}