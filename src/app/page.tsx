import Image from "next/image";
import Navbar from "@/components/Navbar";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen p-4">
        <CardContainer className="inter-var">
          <CardBody className="neon-border bg-slate-800 relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] border-white/[0.2] w-full max-w-4xl h-auto rounded-xl p-6 border flex flex-col md:flex-row items-center space-y-6 md:space-y-0">
            <CardItem
              translateZ="100"
              className="w-full md:w-1/2 flex justify-center md:justify-end pr-0 md:pr-6"
            >
              <Image
                src="/chatbot.gif"
                height="1000"
                width="1000"
                className="h-40 md:h-60 lg:h-80 w-auto object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </CardItem>

            <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
              <CardItem
                translateZ="50"
                as="h1"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
              >
                Welcome to{" "}
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  BizGenie.ai
                </span>
              </CardItem>

              <CardItem
                as="p"
                translateZ="60"
                className="text-sm sm:text-base lg:text-lg mt-4 text-neutral-300"
              >
                Smart AI-powered, genie-themed business analyst to assist you in making informed
                decisions. Get insights, recommendations, and forecasts in a magical way!
              </CardItem>

              <CardItem
                translateZ={20}
                as="a"
                href="/auth/sign-in"
                className="inline-block mt-4 px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs sm:text-sm font-bold"
              >
                Sign In
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>
    </>
  );
}
