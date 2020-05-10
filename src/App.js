import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import logo from "./logo.svg";
import "./App.css";

const { ipcRenderer } = window.require("electron");

function App() {
  const [loadedFile, setLoadedFile] = useState("");
  useEffect(() => {
    ipcRenderer.on("new-file", (event, fileContent) => {
      setLoadedFile(fileContent);
    });
  });

  return (
    <div className="App">
      <Markdown>{loadedFile}</Markdown>
    </div>
  );
}

export default App;
