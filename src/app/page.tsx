import GoogleSignInButton from "@/components/GoogleSignInButton";
import OaiKeyInput from "@/components/oaiKeyInput";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-8 w-[40vw] p-8">
        {
          session ?
            <p>Hi {session?.user?.name}, please enter your openAI api key</p>
          :
          <GoogleSignInButton>Login with Google</GoogleSignInButton>
        }
        {
          session &&
          <OaiKeyInput/>
        }
      </div>
    </main>
  );
}
