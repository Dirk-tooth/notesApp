import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import AceEditor from "react-ace";
import brase from "brace";
import "brace/mode/markdown";
import "brace/theme/dracula";
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
      <AceEditor
        mode="markdown"
        theme="dracula"
        onChange={newContent => {
          setLoadedFile(newContent);
        }}
        name="markdown_editor"
        value={loadedFile}
      />
      <Markdown>{loadedFile}</Markdown>
    </div>
  );
}

export default App;
