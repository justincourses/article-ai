import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";

import { Writer } from "@/components/writer";

export default async function DashboardPage() {
  return (
    <>
      <main className="max-w-[75rem] w-full mx-auto">
        <div className="grid gap-10 pb-10">
          <div>
            <Navbar />
            <Writer />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
