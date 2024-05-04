import user_photo from "../../assets/user.png";
import { useQuery } from "@apollo/client";
import { MeQuery } from "../../graphql/query/me";

export default function Header() {
  const { loading, data } = useQuery(MeQuery);

  return (
    <div className="absolute inset-x-0 top-0 flex justify-center">
      <div className="p-8 w-full max-w-md flex flex-row justify-between items-center">
        <a href="/overview">
          <span className="font-semibold text-sm">FidesyPay</span>
        </a>
        <a href="/profile">
          {!loading && (
            <img
              src={
                data && data.me.photo_url !== null
                  ? data.me.photo_url
                  : user_photo
              }
              alt="User"
              className="h-12 w-12 rounded-lg"
            />
          )}
        </a>
      </div>
    </div>
  );
}
