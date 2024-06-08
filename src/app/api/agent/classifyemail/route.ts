// app/api/gmail/messages/route.ts
import { NextRequest, NextResponse as res } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage} from "@langchain/core/messages"

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro",
    maxOutputTokens: 2048,
    temperature: 0
})


export const POST = async (req: NextRequest) => {
    const body = await req.json()
    const {emails} = body
    // console.log(emails);
    const snippets = emails.map((email: any)=>{return email.snippet})
    // console.log(snippets);
    
    const prompt = `act as an email classifier. your work is to classify the emails based on its content. 
                    I will provide you the snippet of the email in an array where each element is a different snippet. 
                    You have to analyse the content and classify the email into following category: "IMPORTANT", "SPAM", "MARKETING", "SOCIAL", "GENERAL", "PROMOTION".
                    short description of each category are as follows:
                    "IMPORTANT" = Emails that are personal or work-related or any bills to be paid and require immediate attention
                    "PROMOTION" = Emails related to sales, discounts and marketing campaigns
                    "SOCIAL" = Emails from friends, social network ot family,
                    "MARKETING" = Emails related to marketing, newsletter and notification
                    "SPAM" = Unwanted or unsolicited emails
                    "GENERAL" = If none of the above matches, use GENERAL 
                    the output must be in json format. the output format is mentioned below. just give me the json output only.
                    to classify the email, use the "snippet" field of input array
                        output format:
                            [
                                {
                                    classification: ,
                                    snippet: ,
                                }
                            ]
                    `

    const input2 = [
        new HumanMessage({
            content:[
                {
                    type: "text",
                    text: prompt
                },
                {
                    type: "text",
                    text: `here is the actual snippet array: ${snippets}. provide the output based on this array input`
                }
            ]
        })
    ]
    
  try {

    const response = await model.invoke(input2)
    console.log(response.content);
    return res.json({data : JSON.parse((response.content as string).slice((response.content as string).indexOf("["), (response.content as string).lastIndexOf("]")+1)), success: true}, {status: 200})

  } catch (error) {
    console.log((error as Error).message);
    
    return res.json({ error: (error as Error).message }, { status: 500 });
  }
};
