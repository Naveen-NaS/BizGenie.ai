import Image from "next/image";
import Navbar from "@/components/Navbar";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
      <CardContainer className="inter-var">
          <CardBody className="neon-border bg-slate-800 relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] border-white/[0.2] w-auto sm:w-[40rem] h-auto rounded-xl p-6 border flex flex-row items-center">
            <CardItem translateZ="100" className="w-1/2 pr-6">
              <Image
                src='/chatbot.gif'
                height="1000"
                width="1000"
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </CardItem>

            {/* Right Side - Content */}
            <div className="w-1/2">
              <CardItem
                translateZ="50"
                as="h1"
                className="text-4xl font-bold text-white"
              >
                Welcome to{" "}
                <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  BizGenie.ai
                </span>
              </CardItem>

              <CardItem
                as="p"
                translateZ="60"
                className="text-sm mt-4 text-neutral-300"
              >
                Smart AI-powered, genie-themed business analyst to assist you in making informed decisions. Get insights, recommendations, and forecasts in a magical way!
              </CardItem>
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
              >
                Sign up
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>
    </>
  );
}
