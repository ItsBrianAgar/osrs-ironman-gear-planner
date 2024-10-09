import "./App.css";
// Hooks
import "./hooks/useSiteMeta";
import useSiteMeta from "./hooks/useSiteMeta";

function App() {
  useSiteMeta();

  return (
    <div className="App">
      <main className="content-wrapper">
        <header className="page-header">
          <h1 className="page-title">Gear Planner</h1>
          <button className="button--primary">Add an itemmmm</button>
        </header>
      </main>
    </div>
  );
}

export default App;
