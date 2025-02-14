import { useState, useEffect } from "react";
import Sidebar from "../../components/menu/sideBar/SideBar";
import MobileMenu from "../../components/menu/mobileMenu/MobileMenu";
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
    <div>
      {isMobile ? <MobileMenu /> : <Sidebar />}
      <div>{children}</div>
    </div>
  );
}

export default PrivateLayout;
