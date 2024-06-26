import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "../../services/apollo_client";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import Invoice from "../Invoice/Invoice";
import Profile from "../Profile/Profile";
import Error from "../NotFound/NotFound";
import Transfer from "../Transfer/Transfer";
import Overview from "../Overview/Overview";
import Home from "../Home/Home";
import RestorePassword from "../RestorePassword/RestorePassword";
import NotFound from "../NotFound/NotFound";

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
    errorElement: <NotFound />,
  },
  {
    path: "/transfer",
    element: <Transfer />,
  },
  {
    path: "/restore-password",
    element: <RestorePassword />,
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
