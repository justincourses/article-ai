"use client";

import { OrganizationSwitcher, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteLogo } from "@/components/global/site-logo";
import { SiteTitle } from "@/components/global/site-title";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  const pathname = usePathname();
  const isDashboardActive = pathname?.startsWith("/dashboard");

  return (
    <header className="flex items-center justify-between w-full h-16 gap-4 px-4 rounded-xl bg-white/30 backdrop-blur-md border border-white/20">
      <div className="flex gap-4">
        <SiteLogo />
        <div aria-hidden className="w-px h-6 bg-[#C7C7C8]" />
        <SiteTitle />
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/dashboard"
                className={cn(
                  navigationMenuTriggerStyle(),
                  isDashboardActive && "bg-accent text-accent-foreground"
                )}
              >
                ✍️ 写作中心
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="https://justincourse.com"
                target="_blank"
                className={navigationMenuTriggerStyle()}
              >
                📚 相关课程
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="https://interjc.net/contact"
                target="_blank"
                className={navigationMenuTriggerStyle()}
              >
                👨‍💻 关于作者
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

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
