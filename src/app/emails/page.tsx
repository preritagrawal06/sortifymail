import EmailSection from "@/components/EmailSection";
import GoogleSignOutButton from "@/components/GoogleSignOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";



const EmailsPage = async () => {

    const session = await getServerSession(authOptions)
    // console.log(session);
    if(!session){
        redirect("/")
    }

    return (
        <div className="w-full min-h-screen flex justify-center">
            <div className="flex flex-col w-[90vw] md:w-[50vw] mt-10 p-4 gap-8">
                <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-4 md:gap-0">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={session?.user?.image!} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="text-sm">{session?.user?.name!}</p>
                            <p className="text-sm">{session?.user?.email!}</p>
                        </div>
                    </div>
                    <GoogleSignOutButton>Logout</GoogleSignOutButton>
                </div>
                <EmailSection/>
            </div>
        </div>
    );
}

export default EmailsPage;