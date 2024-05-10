import error_photo from "../../assets/error.png";

type ErrorProps = {
  message: string
}

export const Error = ({ message }: ErrorProps) => {
  return (
    <div className="mt-4 p-4 rounded-xl  bg-red-200 flex items-center">
      <img src={error_photo} width="32" alt="error"/>
      <span className="mx-2">{ message }</span>
    </div>
  )
}