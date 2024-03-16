import user_photo from "../../assets/user.png";


export default function Header() {
    return (
            <div className="pt-8 pr-8 w-full max-w-md flex justify-between">
                <div></div>
                <a href="http://pay.fidesy.tech/profile">
                    <img src={user_photo} alt="User Photo" className="h-12 w-12 rounded-lg"/>
                </a>
            </div>
    )
}