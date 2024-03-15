import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ApolloProvider} from "@apollo/client";
import client from "../../services/apollo_client";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import Overview from "../Profile/Overview";
import Invoice from "../Invoice/Invoice";
import Profile from "../Profile/Profile";
import Header from "../Header/Header";



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
        path: "/overview",
        element: <Overview/>
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
                <div className="p-8 rounded-lg flex flex-col items-center">
                    <Header/>
                    <RouterProvider router={router}/>
                </div>

            </ApolloProvider>

        </main>
    )
}