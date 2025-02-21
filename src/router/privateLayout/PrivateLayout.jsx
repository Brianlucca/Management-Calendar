import { useState, useEffect } from "react";
import Sidebar from "../../components/menu/sideBar/SideBar";
import MobileMenu from "../../components/menu/mobileMenu/MobileMenu";
import Footer from "../../components/footer/Footer";

function PrivateLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {isMobile ? <MobileMenu /> : <Sidebar />}
      
      <div className="flex-grow">{children}</div>

      <Footer />
    </div>
  );
}

export default PrivateLayout;
