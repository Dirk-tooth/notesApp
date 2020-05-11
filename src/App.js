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
const fs = window.require("fs");

// if you need to use react dev tools in election, run this:
// require('electron-react-devtools').install()

function App() {
  const [loadedFile, setLoadedFile] = useState("");
  const [directory, setDirectory] = useState(settings.get("directory") || null);
  const [filesData, setFilesData] = useState([]);
  const [activeIndex, setActiveIndex] = useState();

  useEffect(() => {
    const directory = settings.get("directory");
    if (directory) {
      loadAndReadFiles(directory);
    }

    ipcRenderer.on("new-file", (event, fileContent) => {
      setLoadedFile(fileContent);
    });
    ipcRenderer.on("new-dir", (event, directory) => {
      setDirectory(directory);
      settings.set("directory", directory);
      loadAndReadFiles(directory);
    });
    ipcRenderer.on("save-file", event => {
      saveFile();
    });
  });
  function loadAndReadFiles(directory) {
    fs.readdir(directory, (err, files) => {
      const filteredFiles = files.filter(file => file.includes(".md"));
      const filesData = filteredFiles.map(file => ({
        path: `${directory}/${file}`
      }));
      setFilesData(filesData);
    });
  }

  function changeFile(index) {
    console.log("---");
    console.log(`saving`, index);
    // if (index !== activeIndex) {
    saveFile(index);
    loadFile(index);
    // }
  }

  function loadFile(index) {
    const content = fs.readFileSync(filesData[index].path).toString();
    setLoadedFile(content);
    setActiveIndex(index);
  }

  function saveFile(index) {
    if (activeIndex !== undefined) {
      fs.writeFile(filesData[activeIndex].path, loadedFile, err => {
        if (err) return console.log(err);
        console.log("saved!");
      });
    }
  }

  return (
    <AppWrap>
      <Header>Journal</Header>
      {directory ? (
        <Split>
          <FilesWindow>
            {filesData.map((file, idx) => (
              <button onClick={() => changeFile(idx)}>{file.path}</button>
            ))}
          </FilesWindow>
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
          <p>
            we save some information, like your settings, on your computer. You
            can find that file and do what ever you want with it here:
          </p>
          <p>~/Library/Application Support/journal/Settings</p>
          <p>
            Just be careful, you may break something. If you do, just delete the
            file all together and restart the app! easy.
          </p>
        </LoadingMessage>
      )}
    </AppWrap>
  );
}

export default App;

const AppWrap = styled.div`
  margin-top: 23px;
`;

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
  text-align: center;
  p {
    padding: 0 20% 0 20%;
  }
`;

const Split = styled.div`
  display: flex;
  height: 100vh;
`;

const FilesWindow = styled.div`
background: #140f1d;
border-right: solid 1px #302b3a;
position: relitive;
width: 20%;
&:after {
  content: '';
  position: absolute;
  left: 0;
  right 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.3) inset;
}
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
  word-wrap: break-word;
  overflow: auto;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
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
