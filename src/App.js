import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Markdown from "markdown-to-jsx";
import AceEditor from "react-ace";
import brase from "brace";
import "brace/mode/markdown";
import "brace/theme/dracula";
import "./App.css";

const settings = window.require("electron-settings");
const { ipcRenderer } = window.require("electron");

function App() {
  const [loadedFile, setLoadedFile] = useState("");
  const [directory, setDirectory] = useState(settings.get("directory") || null);

  useEffect(() => {
    ipcRenderer.on("new-file", (event, fileContent) => {
      setLoadedFile(fileContent);
    });
    ipcRenderer.on("new-dir", (event, filepaths, dir) => {
      setDirectory(dir);
      settings.set("directory", dir);
    });
  });

  return (
    <div className="App">
      <Header>Journal</Header>
      {directory ? (
        <Split>
          <CodeWindow>
            <AceEditor
              mode="markdown"
              theme="dracula"
              onChange={newContent => {
                setLoadedFile(newContent);
              }}
              name="markdown_editor"
              value={loadedFile}
            />
          </CodeWindow>
          <RenderedWindow>
            <Markdown>{loadedFile}</Markdown>
          </RenderedWindow>
        </Split>
      ) : (
        <LoadingMessage>
          <h1>cmd + o to open a file</h1>
          <h1>cmd + shift + o to open a directory</h1>
        </LoadingMessage>
      )}
    </div>
  );
}

export default App;

const Header = styled.header`
  background-color: #191324;
  color: #75717c;
  font-size: 0.8rem;
  height: 23px;
  text-align: center;
  position: fixed;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  -webkit-app-region: drag;
`;

const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  background-color: #191324;
  height: 100vh;
`;

const Split = styled.div`
  display: flex;
  height: 100vh;
`;

const CodeWindow = styled.div`
  flex: 1;
  padding-top: 2rem;
  background-color: #191324;
`;

const RenderedWindow = styled.div`
  background-color: #191324;
  width: 35%;
  padding: 20px;
  color: #ffffff;
  border-left: 1px solid #302b3a;
  word-wrap: break-word:
  h1,
  h2,
  h3,
  h4,
  h5. h6 {
    color: #82d8d8;
  }
  h1 {
    border-bottom: solid 3px #e54b4b;
    padding-bottom: 10px;
  }
  a {
    color: #e54b4b;
  }
`;
