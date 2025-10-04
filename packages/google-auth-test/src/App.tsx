import { GoogleDrivePickerWithAction } from '../../website/src/components/GoogleDrivePickerWithAction';

function App() {
  return (
    <div>
      <GoogleDrivePickerWithAction text="Open" onPicked={console.log} />
    </div>
  );
}

export default App;
