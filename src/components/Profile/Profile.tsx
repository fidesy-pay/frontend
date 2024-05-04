import { useQuery, useMutation } from "@apollo/client";
import { MeQuery } from "../../graphql/query/me";
import { RegenerateAPIKey } from "../../graphql/mutation/regenerate_api_key";
import { useState, useEffect } from "react";
import { UpdateClientMutation } from "../../graphql/mutation/update_client";
import Header from "../Header/Header";
import { DeactivateClient } from "../../graphql/mutation/deactivate_client";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "./ConfirmationPopup";

export default function Profile() {
  const { loading, error, data } = useQuery(MeQuery);
  const [showApiKey, setShowApiKey] = useState(false);
  const [enableInvoiceNotification, setEnableInvoiceNotification] =
    useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const navigate = useNavigate();

  const [updateClient] = useMutation(UpdateClientMutation);
  const [regenerateAPIKey] = useMutation(RegenerateAPIKey);
  const [deactivateClient] = useMutation(DeactivateClient);

  useEffect(() => {
    if (data && data.me) {
      setEnableInvoiceNotification(data.me.is_invoice_notification_enabled);
    }
  }, [data]);

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const toggleInvoiceNotification = async () => {
    try {
      await updateClient({
        variables: {
          input: {
            is_invoice_notification_enabled: !enableInvoiceNotification,
          },
        },
      });
      setEnableInvoiceNotification(!enableInvoiceNotification);
    } catch (error) {
      console.error("Error toggling invoice notification:", error);
    }
  };

  const handleRegenerateApiKey = async () => {
    try {
      await regenerateAPIKey({
        refetchQueries: [{ query: MeQuery }],
      });
      // You may want to refetch the user data after regenerating the API key
    } catch (error) {
      console.error("Error regenerating API key:", error);
    }
  };

  const deactivate = async () => {
    try {
      await deactivateClient({
        refetchQueries: [{ query: MeQuery }],
      });
      // You may want to refetch the user data after regenerating the API key
      localStorage.setItem("token", "");
      navigate("/overview");
    } catch (error) {
      console.error("Error deactivating client:", error);
    }
  };

  if (loading) {
    return (
      <div className="mt-32 w-full flex flex-col items-center">Loading...</div>
    );
  }

  if (error) {
    if (
      error.networkError?.message.includes("401") ||
      error.toString().includes("NO_AUTH")
    ) {
      return <div></div>;
    }
    return <p className="text-center text-red-500 mt-4">Error :(</p>;
  }

  return (
    <section>
      <Header />

      <div className="mt-32 w-full flex flex-col items-center">
        <h1 className="text-lg mb-4 font-semibold">User information</h1>
        <div className="p-6 mt-8 w-full max-w-md custom-shadow rounded-2xl">
          <div className="flex flex-col space-y-5">
            <div className="flex flex-col text-gray-700">
              <p className="font-semibold">{data.me.username}</p>
              <span className="text-sm">Username</span>
            </div>

            <div className="flex flex-col text-gray-700">
              <p className="font-semibold">{data.me.email}</p>
              <span className="text-sm">Email</span>
            </div>

            <div className="flex items-center space-x-4 text-gray-700">
              <span className="font-semibold">Invoice Notifications</span>
              <input
                type="checkbox"
                checked={enableInvoiceNotification}
                onChange={toggleInvoiceNotification}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            </div>

            <div className="flex flex-col text-gray-700">
              <p
                className="mt-3 font-semibold cursor-pointer"
                onClick={toggleApiKeyVisibility}
              >
                {showApiKey
                  ? data.me.api_key
                  : "*".repeat(data.me.api_key.length)}
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm">API Key</span>
                <button
                  onClick={handleRegenerateApiKey}
                  className="bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Regenerate
                </button>
              </div>
            </div>

            <div className="flex flex-col text-gray-700">
              <button
                onClick={() => setConfirmation(true)}
                className="mt-3 bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Deactivate Account
              </button>
              {confirmation && (
                <ConfirmationPopup
                  message="Are you sure?"
                  onConfirm={deactivate}
                  onCancel={() => setConfirmation(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
