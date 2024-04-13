import { useQuery, useMutation } from "@apollo/client";
import { MeQuery } from "../../graphql/query/me";
import { RegenerateAPIKey } from "../../graphql/mutation/regenerate_api_key";
import { useState, useEffect } from "react";
import { UpdateClientMutation } from "../../graphql/mutation/update_client";

export default function Profile() {
  const { loading, error, data } = useQuery(MeQuery);
  const [showApiKey, setShowApiKey] = useState(false);
  const [enableInvoiceNotification, setEnableInvoiceNotification] =
    useState(false);

  const [updateClient] = useMutation(UpdateClientMutation);
  const [regenerateAPIKey] = useMutation(RegenerateAPIKey);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    if (error.networkError?.message.includes("401")) {
      return <div></div>;
    }

    return <p className="text-center text-red-500 mt-4">Error :(</p>;
  }

  return (
    <div className="p-6 mt-8 w-full max-w-md custom-shadow rounded-2xl">
      <h1 className="text-lg mb-4 font-semibold">User information</h1>
      <div className="flex flex-col space-y-5">
        <div className="flex items-center space-x-4 text-gray-700">
          <span>Username</span>
          <p className="font-semibold">{data.me.username}</p>
        </div>

        <div className="flex items-center space-x-4 text-gray-700">
          <span>Email</span>
          <p className="font-semibold">{data.me.email}</p>
        </div>

        <div className="flex items-center space-x-4 text-gray-700">
          <span>Enable Invoice Notifications</span>
          <input
            type="checkbox"
            checked={enableInvoiceNotification}
            onChange={toggleInvoiceNotification}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
        </div>

        <div className="flex flex-col  text-gray-700">
          <div className="flex items-center space-x-4">
            <span>API Key</span>
            <button
              onClick={handleRegenerateApiKey}
              className="bg-base font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Regenerate
            </button>
          </div>
          <p
            className="mt-3 font-semibold cursor-pointer"
            onClick={toggleApiKeyVisibility}
          >
            {showApiKey ? data.me.api_key : "*".repeat(data.me.api_key.length)}
          </p>
        </div>
      </div>
    </div>
  );
}
