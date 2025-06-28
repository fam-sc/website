import { TelegramLoginWidget } from '../../website/src/components/TelegramLoginWidget';

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
