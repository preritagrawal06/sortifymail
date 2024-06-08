"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button";
import EmailCard from "./EmailCard";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { formatText } from "@/lib/formatText";
import { useToast } from "./ui/use-toast";

type Email = {
    from: string,
    snippet: string,
    content: string,
    id: string
}

type Classification = {
    snippet: string,
    classification: string
}

const EmailSection = () => {
    const temp = localStorage.getItem("emails") ? JSON.parse(localStorage.getItem("emails")!) : []
    const [emails, setEmails] = useState(temp)
    const [classification, setClassification] = useState<Classification[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [batch, setBatch] = useState("10")
    const [classifierLoading, setClassifierLoading] = useState(false)
    const {toast} = useToast()
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                if (emails.length === 0 || emails.length != batch) {
                    setClassification(null)
                    const { data } = await axios.post(`http://localhost:3000/api/gmail/messages`, {
                        batch: batch
                    })
                    // console.log(data);
                    localStorage.setItem("emails", JSON.stringify(data))
                    setEmails(data)
                }
            } catch (err) {
                const {error} = (err as AxiosError).response?.data as any
                toast({
                    title: error,
                    description: "Please logout and login again!"
                })
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [batch])

    const handleClick = async () => {
        try {
            setClassifierLoading(true)
            const { data } = await axios.post(`${process.env.BASE_URL}/api/agent/classifyemail`, { emails: emails })
            // console.log(data.data)
            setClassification(data.data)
            setClassifierLoading(false)
        } catch (error) {
            console.log((error as Error).message);
            toast({
                title:"Something went wrong",
                description: "Plese try again!"
            })
        } finally {
            setClassifierLoading(false)
        }
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <Select defaultValue={batch} onValueChange={(value) => { setBatch(value) }}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="ghost" disabled={classifierLoading} onClick={handleClick}>{classifierLoading ? <Image src={"/loading.svg"} alt="loader" width={16} height={16} /> : "Classify"}</Button>
            </div>
            <div className="flex flex-col gap-4 h-[70vh] overflow-auto py-4 no-scrollbar">
                {
                    loading ?
                        <div className="mx-auto">
                            <Image src={"/loading.svg"} alt="loader" width={32} height={32} />
                        </div>
                        :
                        emails &&
                        emails.map((email: Email, index: number) => {
                            const sender_name = email.from.split(" ").length > 1 ? email.from.split(" ").slice(0, -1).join(" ") : email.from;

                            return (
                                <Sheet key={index}>
                                    <SheetTrigger><EmailCard sender={sender_name!} snippet={email.snippet!} classification={classification ? classification[index].classification : null} /></SheetTrigger>
                                    <SheetContent className="overflow-auto">
                                        <SheetHeader>
                                            <SheetTitle>{email.from.split(" ").slice(0, -1).join(" ")}</SheetTitle>
                                            <SheetTitle>{classification && classification[index].classification}</SheetTitle>
                                            <SheetDescription className="overflow-auto">
                                                {formatText(email.content)}
                                            </SheetDescription>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            )
                        })
                }
            </div>
        </>
    );
}

export default EmailSection;