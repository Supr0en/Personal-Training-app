import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css';
import App from "./App.tsx";
import CustomersList from "./Conponents/CustomersList.tsx";
import TrainingsList from "./Conponents/TrainingsList.tsx";
import Index from "./Conponents/Index.tsx";
import { createHashRouter, RouterProvider } from "react-router";
import CalendarView from "./Conponents/CalendarView.tsx";
const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Index />,
        index: true,
      },
      {
        path: "customerslist",
        element: <CustomersList />,
      },
      {
        path: "trainingslist",
        element: <TrainingsList />,
      },
      {
        path: "calendarview",
        element: <CalendarView />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
