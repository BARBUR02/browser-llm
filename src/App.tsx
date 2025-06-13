import { Home } from "./components/ui/Home";
import { ModelProvider } from "./context/ModelContext";

function App() {
  return (
    <ModelProvider>
      <Home />
    </ModelProvider>
  );
}
export default App;
