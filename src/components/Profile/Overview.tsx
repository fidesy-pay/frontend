import { Wallets } from "./Wallets";
import {MainBalance} from "./MainBalance";
import LastInvoices from "./LastInvoices";
import Actions from "./Actions";
import user_photo from "../../assets/user.png";


export default function Overview() {
    return (
        <div className="p-6 w-full flex flex-col items-center">
            <MainBalance/>
            <Actions/>
            <Wallets/>
            <LastInvoices/>
        </div>
    )
}