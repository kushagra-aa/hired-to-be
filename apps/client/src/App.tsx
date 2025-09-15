import AppProvider from "./app/AppProvider";
import AppRouter from "./app/router";
import Toast from "./components/ui/Toast";
import { applyTheme } from "./styles/colors.css";

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
