import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DocList from "./pages/DocList";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TextEditor from "./pages/TextEditor";
import UpdateDoc from "./pages/UpdateDoc";


function App() {
  return (
    <BrowserRouter basename={process.env.REACT_APP_BASE_NAME} className="App">
      {/* <Navbar /> need to fix */}
      <Routes >
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/docs" element={<DocList />} />
        <Route path="/create" element={<TextEditor />} />
        <Route path="/edit" element={<UpdateDoc />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
