import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import { Footer } from "@/components/global/footer";
import { UserDetails } from "@/components/global/user-details";

import { CodeSwitcher } from "@/components/global/code-switcher";

import { SiteLogo } from "@/components/global/site-logo";
import { SiteTitle } from "@/components/global/site-title";

export default async function DashboardPage() {
  return (
    <>
      <main className="max-w-[75rem] w-full mx-auto">
        <div className="gap-10">
          <header className="flex items-center justify-between w-full h-16 gap-4">
            <div className="flex gap-4">
              <SiteLogo />
              <div aria-hidden className="w-px h-6 bg-[#C7C7C8]" />
              <SiteTitle />
            </div>
            <div className="flex items-center gap-2">
              <OrganizationSwitcher
                appearance={{
                  elements: {
                    organizationPreviewAvatarBox: "size-6",
                  },
                }}
              />
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-6",
                  },
                }}
              />
            </div>
          </header>
        </div>
        <div className="grid grid-cols-[1fr_20.5rem] gap-10">
          <UserDetails />
          <CodeSwitcher />
        </div>
      </main>
      <Footer />
    </>
  );
}
