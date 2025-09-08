import AppProvider from "./app/AppProvider.js";
import AppRouter from "./app/router.js";
import Toast from "./components/ui/Toast.js";
import { applyTheme } from "./styles/colors.css.js";

applyTheme();

function App() {
  return (
    <>
      <AppProvider>
        <Toast duration={3000} expand visibleToasts={2} closeButton />
        <AppRouter />
      </AppProvider>
    </>
  );
}

export default App;
