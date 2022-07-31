import React, { useState } from "react";

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = ({ isLoggedIn }) => {
    return (
        <Router>
            <Switch>
                {isLoggedIn ? (
                    //<>는 부모요소가 없을때 많은 요소들을 render하고싶을때 사용
                    <>
                        <Route exact path="/">
                            <Home />
                        </Route>
                    </>) : (
                    <Route exact path="/">
                        <Auth />
                    </Route>)}
            </Switch>
        </Router>
    )
};
export default AppRouter;