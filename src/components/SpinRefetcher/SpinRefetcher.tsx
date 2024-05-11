import { useState } from "react";

import arrows_photo from "../../assets/arrows.png";


export const SpinRefetcher = ({ refetchFunc }: any) => {
  const [isRotating, setIsRotating] = useState(false);
  
  const handleRefetch = async () => {
    setIsRotating(true);

    await refetchFunc()

    setTimeout(() => {
      setIsRotating(false);
    }, 100);
  }

  return (
    <div>
      <img src={arrows_photo} alt="Refresh" width="24" className={ "cursor-pointer " + (isRotating ? "animate-spin" : "")} onClick={() => handleRefetch()}/>
    </div>
  )
}