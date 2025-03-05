import "./home.css"

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"

import { Navbar } from "@/components/global/navbar"
import { Footer } from "@/components/global/footer"

import Link from "next/link"

export default function Home() {
  return (
    <>
      <main className="relative">
        <div className="w-full max-w-[75rem] mx-auto mb-4">
          <Navbar />
        </div>

        <div className="w-full max-w-[75rem] mx-auto flex flex-col">
          <div className="px-10 py-16 text-center">
            <div className="w-full max-w-[75rem] mx-auto flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-[#F5F5F5] px-3 py-1.5 rounded-full">
                <span className="text-blue-600 text-sm font-medium">NEW!</span>
                <span className="text-sm text-gray-600">Article Writer 智能助手 ✨</span>
              </div>
            </div>

            <h1 className="text-[3.5rem] font-bold tracking-tight mb-6">
              <span className="bg-gradient-text animate-gradient-normal">Article Writer</span><br />
              <span className="bg-gradient-text animate-gradient-reverse">智能文章生成器</span>
            </h1>

            <p className="text-[#5E5F6E] mx-auto mb-8 max-w-[35rem] text-xl">
              专业级AI写作工具，只需输入关键词，即可生成高质量、原创性强的专业文章。
              让您的内容创作更轻松，文章更专业。
            </p>

            <div className="flex gap-3 justify-center">
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold"
                >
                  开始写作
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
                    立即登录
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
