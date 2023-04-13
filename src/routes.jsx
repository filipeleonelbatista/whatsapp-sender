import React from "react";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact element={<Home />} />        
        <Route path="*" element={<NotFound />} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
