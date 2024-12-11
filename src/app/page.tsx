import Board from "@/components/Board";
import Navbar from "@/components/Nav/NavBar"
import Sidebar from "@/components/SideBar";

export default function Home() {
  return (
    <div >
      <Navbar />
      <Sidebar />
      <main>
      <Board />
      </main>
      <footer >

      </footer>
    </div>
  );
}
