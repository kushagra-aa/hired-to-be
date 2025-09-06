import AppProvider from "./app/AppProvider.js";
import AppRouter from "./app/router.js";
import Toast from "./components/ui/Toast.js";
import { injectCssVariables, watchSystemTheme } from "./styles/colors.css.js";

// Load CSS Variables
injectCssVariables();
// Watch CSS Theme
watchSystemTheme();

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
