import "./app.css";
import { useContext } from "react";
import { UserContext } from "./context/UserContect";
import Home from "./page/Home/Home";
import LoginAndSign from "./page/LoginRegister/LoginAndSign";
import Loading from "./components/Loading/Loading";

function App() {
  const { currentUser, loading } = useContext(UserContext);
   return(

    <div className="App">
      {
        loading ? <Loading/> :       !currentUser ? <LoginAndSign /> : <Home/>

      }
      </div>
   )
}

export default App;
