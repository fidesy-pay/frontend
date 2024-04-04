import user_photo from "../../assets/user.png";
import {useQuery} from "@apollo/client";
import {MeQuery} from "../../graphql/query/me";
import {useNavigation} from "react-router-dom";

export default function Header() {

    return (
            <div className="p-8 w-full max-w-md flex justify-between items-center">
                <a href="http://pay.fidesy.tech/overview">
                    <span className="font-semibold text-sm">Overview</span>
                </a>
                <a href="http://pay.fidesy.tech/profile">
                    <img src={user_photo} alt="User Photo" className="h-12 w-12 rounded-lg"/>
                </a>
            </div>
    )
}