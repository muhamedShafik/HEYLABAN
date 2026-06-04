import AppRouter from "./router/AppRouter";
import { useEffect , useRef} from "react";
import { useAuthStore } from "./store/authStore";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    initializeAuth();
  }, [initializeAuth]);

  return <AppRouter />;
}

export default App;