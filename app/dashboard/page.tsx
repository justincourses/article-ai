import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";

import { UserDetails } from "@/components/global/user-details";

import { CodeSwitcher } from "@/components/global/code-switcher";

export default async function DashboardPage() {
  return (
    <>
      <main className="max-w-[75rem] w-full mx-auto">
        <div className="grid grid-cols-[1fr_20.5rem] gap-10 pb-10">
          <div>
            <Navbar />
            <UserDetails />
          </div>
          <div className="pt-[3.5rem]">
            <CodeSwitcher />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
