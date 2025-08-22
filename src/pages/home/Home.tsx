import { useNavigate } from "react-router-dom";
import todoImg from "../../assets/todo.png";
import quizImg from "../../assets/quiz.png";
import multiStepImg from "../../assets/multi-step-form.png";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  const projects = [
    {
      title: "Todo App",
      description: "Manage your daily tasks and stay productive.",
      image: todoImg,
      route: "/todo",
    },
    {
      title: "Quiz App",
      description: "Test your knowledge with a fun quiz game.",
      image: quizImg,
      route: "/quiz",
    },
    {
      title: "Multi-Step Form",
      description: "Fill in details step by step with validation.",
      image: multiStepImg,
      route: "/multy-step-form",
    },
  ];

  return (
    <div className="home">
        <h1 className="home-heading">Learning Projects</h1>
      <div className="cards-wrapper">
        {projects.map((project) => (
          <div
            key={project.title}
            className="card1"
            onClick={() => navigate(project.route)}
          >
            <div className="image">
              <img src={project.image} alt={project.title} />
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
