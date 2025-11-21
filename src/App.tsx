// import './App.css'
import { Link, Outlet } from "react-router";
function App() {
  return (
    <>
      <header>
        <h1>Personal training app</h1>
        <nav>
          <Link to={"/"}>Homepage</Link>
          <Link to={"/customerslist"}>Customers page</Link>
          <Link to={"/trainingslist"}>Trainings page</Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
}

export default App;
