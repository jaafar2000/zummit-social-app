import "./App.css";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import Home from "./page/Home/Home";
import LoginAndSign from "./page/LoginRegister/LoginAndSign";
import Loading from "./components/Loading/Loading";

function App() {
  const { currentUser, loading } = useContext(UserContext);
  console.log(currentUser)
  return (
    <div className="App">
      {loading ? <Loading /> : !currentUser ? <LoginAndSign /> : <Home />}
    </div>
  );
}

export default App;
