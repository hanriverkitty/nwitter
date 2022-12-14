import React, { useState } from "react";
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "routes/Profile";
const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    return (
        <Router>
            {/* &&는 Navigation이 존재하려면 isLoggedIn이 참이여야한다 */}
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Switch>
                {isLoggedIn ? (
                    //<>는 부모요소가 없을때 많은 요소들을 render하고싶을때 사용
                    <div
                        style={{
                            maxWidth: 890,
                            width: "100%",
                            margin: "0 auto",
                            marginTop: 80,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Route exact path="/">
                            <Home userObj={userObj} />
                        </Route>
                        <Route exact path="/profile">
                            <Profile userObj={userObj} refreshUser={refreshUser} />
                        </Route>
                        {/* <Redirect from="*" to="/" /> */}
                    </div>) : (
                    <>
                        <Route exact path="/">
                            <Auth />
                        </Route>
                        {/* <Redirect from="*" to="/" /> */}
                    </>
                )}
            </Switch>
        </Router>
    )
};
export default AppRouter;