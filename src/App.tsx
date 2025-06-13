import { ModelProvider } from "./context/ModelContext";
import { Main } from "./components/ui/Main";

function App() {
  return (
    <ModelProvider>
      <Main />
    </ModelProvider>
  );
}
export default App;
