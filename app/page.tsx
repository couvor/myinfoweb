import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Narrative from "@/components/narrative";
import Chapters from "@/components/chapters";
import Numbers from "@/components/numbers";
import Tech from "@/components/tech";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Narrative />
        <Chapters />
        <Numbers />
        <Tech />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
