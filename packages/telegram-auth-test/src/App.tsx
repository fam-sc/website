import { TelegramLoginWidget } from './LoginWidget';

function App() {
  return (
    <TelegramLoginWidget
      bot="famschedulebot"
      onCallback={(user) => {
        console.log(user);
      }}
    />
  );
}

export default App;
