import { Wallets } from "./Wallets";
import {MainBalance} from "./MainBalance";
import Invoices from "./Invoices";
import Actions from "./Actions";
import user_photo from "../../assets/user.png";


export default function Overview() {
    return (
        <div className="p-6 w-full flex flex-col items-center">
            <MainBalance/>
            <Actions/>
            <Wallets/>
            <Invoices/>
        </div>
    )
}