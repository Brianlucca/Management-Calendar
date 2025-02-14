import RenderRouter from "./router/RenderRouter";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./components/notification/Notification";

function App() {
  return (
    <>
      <NotificationProvider>
        <BrowserRouter>
          <AuthProvider>
            <RenderRouter />
          </AuthProvider>
        </BrowserRouter>
      </NotificationProvider>
    </>
  );
}

export default App;
