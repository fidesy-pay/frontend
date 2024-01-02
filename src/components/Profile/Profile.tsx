import {gql, useQuery} from "@apollo/client";
import { Invoices } from "./Invoices";
import { Me } from "./Me";
import { Wallets } from "./Wallets";


export default function Profile() {
    return (
        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <Me/>
            <Wallets/>
            <Invoices/>
        </div>
    );
}