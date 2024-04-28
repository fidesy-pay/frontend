import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "../../services/apollo_client";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import Invoice from "../Invoice/Invoice";
import Profile from "../Profile/Profile";
import Error from "../../Error/Error";
import Transfer from "../Transfer/Transfer";
import Overview from "../Overview/Overview";
import Home from "../Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/overview",
    element: <Overview />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/invoices/:invoice_id",
    element: <Invoice />,
  },
  {
    errorElement: <Error />,
  },
  {
    path: "/transfer",
    element: <Transfer />,
  },
]);

export default function App() {
  return (
    <main>
      <ApolloProvider client={client}>
        <div>
          <RouterProvider router={router} />
        </div>
      </ApolloProvider>
    </main>
  );
}
