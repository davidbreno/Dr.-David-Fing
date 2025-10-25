import Sidebar from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";

export default function Home() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-3"><Sidebar /></div>
      <main className="col-span-12 lg:col-span-9"><Dashboard /></main>
    </div>
  );
}
