import { auth, firebaseInstance } from "fbase";
import React, { useState } from "react";
import AuthForm from "components/AuthForm";
const Auth = () => {


    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;
        let provider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "") {

        }
        await auth.signInWithPopup(provider);
    };
    return (
        <div>
            <AuthForm />
            <div>
                <button name="google" onClick={onSocialClick}>Continue with Google</button>
                <button>Continue</button>
            </div>
        </div>
    );
};
export default Auth;