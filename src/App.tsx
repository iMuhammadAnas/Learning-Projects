import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Todo from "./pages/todo/Todo";
import Quiz from "./pages/quiz/Quiz";
import MultiForm from "./pages/multi-step-form/MultiStepForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/multy-step-form" element={<MultiForm />} />
      </Routes>
    </Router>
  );
}

export default App;
