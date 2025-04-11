import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Script from "next/script";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://shinbun.news/"),
  title: "Article AI｜智能文章生成器",
  description:
    "A professional article rendering platform with advanced formatting and publishing capabilities.",
  openGraph: {
    type: "website",
    url: "https://shinbun.news/",
    title: "Article AI｜智能文章生成器",
    description: "A professional article rendering platform with advanced formatting and publishing capabilities.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Article AI｜智能文章生成器",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Article AI｜智能文章生成器",
    description: "A professional article rendering platform with advanced formatting and publishing capabilities.",
    images: ["/og.png"],
    creator: "@zhaikr",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "mfw57bbfor");
          `}
        </Script>
      </head>
      <ClerkProvider
        appearance={{
          variables: { colorPrimary: "#000000" },
          elements: {
            formButtonPrimary:
              "bg-black border border-black border-solid hover:bg-white hover:text-black",
            socialButtonsBlockButton:
              "bg-white border-gray-200 hover:bg-transparent hover:border-black text-gray-600 hover:text-black",
            socialButtonsBlockButtonText: "font-semibold",
            formButtonReset:
              "bg-white border border-solid border-gray-200 hover:bg-transparent hover:border-black text-gray-500 hover:text-black",
            membersPageInviteButton:
              "bg-black border border-black border-solid hover:bg-white hover:text-black",
            card: "bg-[#fafafa]",
          },
        }}
      >
        <body className={`min-h-screen flex flex-col antialiased`}>
          {children}
          <Toaster richColors />
        </body>
      </ClerkProvider>

      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js" />
    </html>
  );
}
