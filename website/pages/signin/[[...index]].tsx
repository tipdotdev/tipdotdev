import SEOHead from "@/comps/seohead";
import { SignIn, SignUp } from "@clerk/nextjs";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] })

export default function page() {
    return (
        <main
			className={`flex min-h-screen flex-col justify-center items-center px-10 ${inter.className}`}
	  		data-theme="dracula"
  		>	
	  		<SEOHead title="Signin to tip.dev" />
	  

            <SignIn path="/signin" routing="path" />

  		</main>
    )
}