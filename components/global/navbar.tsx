import { OrganizationSwitcher, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";

import { SiteLogo } from "@/components/global/site-logo";
import { SiteTitle } from "@/components/global/site-title";

export function Navbar() {
  return (
    <header className="flex items-center justify-between w-full h-16 gap-4">
      <div className="flex gap-4">
        <SiteLogo />
        <div aria-hidden className="w-px h-6 bg-[#C7C7C8]" />
        <SiteTitle />
      </div>

      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton>
            <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
              登录
            </button>
          </SignInButton>
        </SignedOut>

        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationPreviewAvatarBox: "size-6",
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "size-6",
            },
          }}
        />
      </div>
    </header>
  );
}
