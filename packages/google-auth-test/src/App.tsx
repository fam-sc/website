function App() {
  const onClick = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id:
        '921417074798-7m6bis906h6ca7ag2u1b831qa2qm2sd6.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/calendar',
      callback: (response) => {
        console.log(response);
      },
    });
    client.requestAccessToken();
  };

  return (
    <div>
      <script src="https://accounts.google.com/gsi/client" async />
      <button onClick={onClick}>Auth</button>
    </div>
  );
}

export default App;
