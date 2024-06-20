import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Crush from "./crush";
import Ludo from "./ludo";
import Minesweeper from "./minesweeper";
import ErrorPage from "./error";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="App">
        <section style={{ height: "100vh", padding: "auto", display: "flex" }}>
          <Ludo />
        </section>
      </div>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "crush",
    element: <Crush />,
    errorElement: <ErrorPage />,
  },
  {
    path: "minesweeper",
    element: <Minesweeper />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
