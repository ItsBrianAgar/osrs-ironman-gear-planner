import React from "react";
// Assets
import "./App.css";
// Utils
import "./hooks/useSiteMeta";
// Hooks
import useSiteMeta from "./hooks/useSiteMeta";
// Components
import PageHeader from "./components/PageHeader/PageHeader";
import ContentCanvas from "./components/ContentCanvas/ContentCanvas";

function App() {
  useSiteMeta();

  return (
    <div className="App">
      <main className="content-wrapper">
        <PageHeader />
        <ContentCanvas />
      </main>
    </div>
  );
}

export default App;
