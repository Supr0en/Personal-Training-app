import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";

import './index.css';
import App from "./App.tsx";
import Index from "./Conponents/Index.tsx";
import CustomersList from "./Conponents/CustomersList.tsx";
import TrainingsList from "./Conponents/TrainingsList.tsx";
import CalendarView from "./Conponents/CalendarView.tsx";
import ChartsView from "./Conponents/ChartsView.tsx";

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
      },
      {
        path: "chartsview",
        element: <ChartsView />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
