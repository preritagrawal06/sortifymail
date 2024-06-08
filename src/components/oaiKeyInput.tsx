"use client"
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

const OaiKeyInput = () => {
    const [key, setKey] = useState(localStorage.getItem("oaikey") || "")
    const router = useRouter()
    const {toast} = useToast()
    
    const handleSubmit = ()=>{
        if(key.length > 0){
            localStorage.setItem("oaikey", key)
            router.push('/emails')
        } else{
            toast({
                title: "Error",
                description: "Please enter your OpenAI key",
                variant: "destructive"
            })
        }
        // TODO: handle error
    }

    return (
        <>
            <Input placeholder="Your OpenAI key" value={key} required onChange={(e)=>setKey(e.target.value)}/>
            <Button onClick={handleSubmit}>Submit</Button>
        </>
    );
}
 
export default OaiKeyInput;