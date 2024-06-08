import { classificationColor } from "@/lib/classificationColor";
import { formatText } from "@/lib/formatText";
import { FC } from "react";

interface EmailCard {
    sender: string,
    snippet: string,
    classification: string | null
}

const EmailCard : FC<EmailCard> = ({sender, snippet, classification}) => {
    
    return (
        <div className="w-full p-4 border rounded-lg flex flex-col gap-2">
            <div className="flex justify-between">
                <p className="font-semibold">{sender}</p>
                <p className={`font-semibold ${(classificationColor as any)[classification || "null"]}`}>{classification && classification}</p>
            </div>
            <p className="text-left">{formatText(snippet)}</p>
        </div>
    );
}

export default EmailCard;