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
                <span className="text-blue-600 text-sm font-medium">免费!</span>
                <span className="text-sm text-gray-600">Article AI - 智能文章生成器 ✨</span>
              </div>
            </div>

            <h1 className="text-[3.5rem] font-bold tracking-tight mb-6">
              <span className="bg-gradient-text animate-gradient-normal">Article AI</span><br />
              <span className="bg-gradient-text animate-gradient-reverse">智能文章生成器</span>
            </h1>

            <p className="text-[#5E5F6E] mx-auto mb-8 max-w-[35rem] text-xl">
              AI驱动的写作助手，一键生成高质量文章。
              <br />
              输入关键词，瞬间获得专业内容，让创作更快捷高效。
            </p>

            <div className="flex gap-3 justify-center mb-16">
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-full text-white text-lg font-semibold my-2 bg-gradient-text animate-gradient-normal hover:animate-gradient-reverse transition-all duration-200 shadow-[0_0_15px_rgba(56,114,255,0.5)] hover:shadow-[0_0_20px_rgba(236,72,153,0.7)] animate-shadow-pulse transform hover:scale-105"
                >
                  开始写作
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="px-8 py-4 rounded-full text-white text-lg font-semibold my-2 bg-gradient-text animate-gradient-normal hover:animate-gradient-reverse transition-all duration-200 shadow-[0_0_15px_rgba(56,114,255,0.5)] hover:shadow-[0_0_20px_rgba(236,72,153,0.7)] animate-shadow-pulse transform hover:scale-105">
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
