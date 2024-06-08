// app/api/gmail/messages/route.ts
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse as res } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  const {batch} = body
  
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return res.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: Number(batch),
    });

    const messages = response.data.messages || [];
    // console.log(response.data.messages);

    const messageDetails = await Promise.all(
      messages.map(async (message) => {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: message.id!,
        });

        const headers = msg.data.payload?.headers || [];
        const fromHeader = headers.find((header) => header.name === "From");
        const from = fromHeader ? fromHeader.value : "Unknown sender";

        // Extract email content
        const body = msg.data.payload?.parts?.find(
          (part) =>
            part.mimeType === "text/plain" || part.mimeType === "text/html"
        );
        const content = body?.body?.data
          ? Buffer.from(body.body.data, "base64").toString("utf-8")
          : "No content available";

        return {
          id: msg.data.id,
          snippet: msg.data.snippet,
          content,
          from,
        };
      })
    );
    // console.log(messageDetails);
      
    return res.json(messageDetails, { status: 200 });
  } catch (error) {
    console.log((error as Error).message);
    
    return res.json({ error: (error as Error).message }, { status: 500 });
  }
};
