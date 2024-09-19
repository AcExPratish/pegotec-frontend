import "./App.css";
import { Routes, Route } from "react-router-dom";
import Task from "./modules/public/task/Task";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<Task />} />
      </Routes>
    </>
  );
}

export default App;
