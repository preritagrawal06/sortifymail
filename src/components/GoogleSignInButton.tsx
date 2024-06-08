"use client"
import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

interface GoogleSignInProvider {
    children: ReactNode
}

const GoogleSignInButton : FC<GoogleSignInProvider> = ({children}) => {
    const loginGoogle = ()=> signIn('google', {callbackUrl:process.env.PROD_BASE_URL})
    return ( 
        <Button onClick={loginGoogle} className="w-full">
            {children}
        </Button>
    );
}
 
export default GoogleSignInButton;