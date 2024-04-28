import { useMutation } from "@apollo/client";
import { UpdateInvoiceMutation } from "../../graphql/mutation/update_invoice";
import { CreateInvoiceMutation } from "../../graphql/mutation/create_invoice";
import React, { useState } from "react";

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
            usd_amount: amount,
          },
        },
      });
      // Handle success or navigate to success page
      console.log("Invoice created successfully!");
      // Close the popup after creating the invoice
      setShowPopup(false);
    } catch (error) {
      // Handle error
      console.error("Error creating invoice:", error);
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
        <a className="text-sm md:text-lg font-semibold" href="/transfer">
          Transfer
        </a>
      </div>
      <div className="p-4 px-6 md:py-6 md:px-12 bg-white rounded-2xl">
        <button
          onClick={openPopup}
          className="text-sm md:text-lg font-semibold"
        >
          Create invoice
        </button>
        {showPopup && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 text-start"
                htmlFor="usd-amount"
              >
                USD Amount
              </label>
              <input
                type="text"
                value={usdAmount}
                onChange={handleAmountChange}
                className="border border-gray-300 p-2 mb-4 w-full"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleCreateInvoice}
                  className="bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create
                </button>
                <button
                  onClick={closePopup}
                  className="bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
