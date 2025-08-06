interface GoogleOAuth2Client {
  requestAccessToken(): void;
}

interface GoogleOAuth2TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface Window {
  google: {
    accounts: {
      oauth2: {
        initTokenClient(options: {
          client_id: string;
          scope: string;
          callback: (response: GoogleOAuth2TokenResponse) => void;
        }): GoogleOAuth2Client;
      };
    };
  };
}
