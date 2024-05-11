import { Wallets } from "./Wallets";
import { MainBalance } from "./MainBalance";
import Invoices from "./Invoices";
import Actions from "./Actions";
import Header from "../Header/Header";
import { Transactions } from "../Transactions/Transactions";

export default function Overview() {
  return (
    <div className="p-6 w-full flex flex-col items-center">
      <Header />

      <MainBalance />
      <Actions />
      <Wallets />
      <Invoices />
      <Transactions/>
    </div>
  );
}
