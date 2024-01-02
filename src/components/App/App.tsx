import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ApolloProvider} from "@apollo/client";
import client from "../../services/apollo_client";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import Profile from "../Profile/Profile";
import Invoice from "../Invoice/Invoice";



const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/signup",
        element: <SignUp/>
    },
    {
        path: "/profile",
        element: <Profile/>
    },
    {
        path: "/invoices/:invoice_id",
        element: <Invoice/>
    },

])
export default function App() {

    return (
        <main>

            <ApolloProvider client={client}>
                <RouterProvider router={router}/>
            </ApolloProvider>

        </main>
    )
}