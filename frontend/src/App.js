import React from "react";
import { Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import "./App.css"

const App = () => {
  return (
    <div className="App">
      <Route path='/' component={Home} exact/>
      <Route  path='/chats' component={Chat} exact/>
    </div>
  );
};

export default App;




