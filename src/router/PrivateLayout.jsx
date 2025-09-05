import { useState, useEffect } from "react";
import Sidebar from "../components/menu/SideBar";
import MobileMenu from "../components/menu/MobileMenu";
import Footer from "../components/footer/Footer";
import { TagContext } from "../context/TagContext";
import { useAuth } from "../context/AuthContext";
import { ref, onValue } from "firebase/database";
import { db } from "../service/FirebaseConfig";
import { PageThemeProvider } from "../context/PageThemeContext";

function PrivateLayout({ children }) {
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    if (currentUser) {
      const tagsRef = ref(db, `users/${currentUser.uid}/tags`);
      const unsubscribe = onValue(tagsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedTags = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        setTags(loadedTags);
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        if (unsubscribe) unsubscribe();
      };
    }
  }, [currentUser]);

  return (
    <PageThemeProvider> {/* Envolva tudo com o Provedor */}
      <TagContext.Provider value={{ tags }}>
        <div className="bg-slate-100 min-h-screen">
          {isMobile ? (
            <MobileMenu />
          ) : (
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          )}

          <div
            className={`transition-all duration-300 ${
              isMobile ? "pt-20" : isSidebarOpen ? "pl-64" : "pl-20"
            }`}
          >
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </div>
        </div>
      </TagContext.Provider>
    </PageThemeProvider>
  );
}

export default PrivateLayout;