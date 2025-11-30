import { Link, Outlet } from "react-router";
function App() {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
        <h1 className="text-xl font-semibold">Personal training app</h1>
        <nav className="flex gap-6">
          <Link to="/">Homepage</Link>
          <Link to="/customerslist">Customers page</Link>
          <Link to="/trainingslist">Trainings page</Link>
          <Link to="/calendarview">Calendar page</Link>
          <Link to="/chartsview">Charts page</Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
}

export default App;
