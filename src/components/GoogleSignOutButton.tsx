"use client"
import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

interface GoogleSignInProvider {
    children: ReactNode
}

const GoogleSignOutButton : FC<GoogleSignInProvider> = ({children}) => {
    const logoutGoogle = ()=>{ 
        localStorage.removeItem("oaikey")
        localStorage.removeItem("emails")
        signOut()
    }    
    return ( 
        <Button onClick={logoutGoogle}>
            {children}
        </Button>
    );
}
 
export default GoogleSignOutButton;