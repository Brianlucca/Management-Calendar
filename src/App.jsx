import RenderRouter from "./router/Router"
import { AuthProvider } from "./context/AuthContext"

function App() {
    return (
        <>
        <AuthProvider>
            <RenderRouter />
        </AuthProvider>
        </>
    )
}

export default App
