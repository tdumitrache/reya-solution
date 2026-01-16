import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { PositionsTable } from "@/components/PositionsTable";
import { Footer } from "@/components/Footer";

const App = () => {
  return (
    <div className="flex flex-col h-screen bg-black-700 text-white-100 font-sans overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block w-64 h-full shrink-0">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1 min-w-0 h-full">
          <main className="flex-1 overflow-auto">
            <PositionsTable />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
