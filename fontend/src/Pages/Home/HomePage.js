import CreatePaste from "../../Components/CreatePaste/CreatePaste";
import { usePaste } from "../../Context/PasteContext";
import "./HomePageStyles.css";

const HomePage = () => {
  const { recentPaste, clearRecentPaste } = usePaste();

  return (
    <div className="home">
      <h1>Create New Paste</h1>

      {recentPaste && (
        <div className="success">
          <p>Paste created successfully!</p>
          <p>
            URL: <a href={recentPaste.url}>{recentPaste.url}</a>
          </p>
          <button onClick={clearRecentPaste}>Create Another</button>
        </div>
      )}

      <CreatePaste />
    </div>
  );
};

export default HomePage;
