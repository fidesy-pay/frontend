import { useMutation } from "@apollo/client";
import { UpdateInvoiceMutation } from "../../graphql/mutation/update_invoice";
import { CreateInvoiceMutation } from "../../graphql/mutation/create_invoice";
import { useState } from "react";

export default function Actions() {
    const [createInvoice] = useMutation(CreateInvoiceMutation);
    const [usdAmount, setUsdAmount] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const handleCreateInvoice = async () => {
        try {
            // Convert the USD amount to a float
            const amount = parseFloat(usdAmount);
            if (isNaN(amount)) {
                console.error("Invalid USD amount");
                return;
            }
            // Send request to create the invoice
            await createInvoice({
                variables: {
                    input: {
                        usd_amount: amount
                    },
                },
            });
            // Handle success or navigate to success page
            console.log('Invoice created successfully!');
            // Close the popup after creating the invoice
            setShowPopup(false);
        } catch (error) {
            // Handle error
            console.error('Error creating invoice:', error);
        }
    };

    const handleAmountChange = (event: any) => {
        const value = event.target.value;
        // Allow only numbers and decimal point
        if (/^\d*\.?\d*$/.test(value) || value === "") {
            setUsdAmount(value);
        }
    };

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="mt-24 md:mt-36 w-full max-w-md flex justify-between space-x-2">
            <div className="p-4 px-12 md:py-6 md:px-12 bg-white rounded-2xl">
                <button className="text-sm md:text-lg font-semibold opacity-50 cursor-not-allowed">Transfer</button>
            </div>
            <div className="p-4 px-6 md:py-6 md:px-12 bg-white rounded-2xl">
                <button onClick={openPopup} className="text-sm md:text-lg font-semibold">Create invoice</button>
                {showPopup && (
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Enter Invoice Amount (USD)</h2>
                            <input type="text" value={usdAmount} onChange={handleAmountChange} className="border border-gray-300 p-2 mb-4 w-full" />
                            <div className="flex justify-between">
                                <button onClick={handleCreateInvoice} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Create</button>
                                <button onClick={closePopup} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
