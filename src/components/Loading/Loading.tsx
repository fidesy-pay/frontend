import { ethereumLogoUrl } from "../../constants/constants";

interface LoadingProps {
  height: string; // Define the height prop as a string
}

export default function Loading({ height }: LoadingProps) {
  return (
    <div>
      <img
        src={ethereumLogoUrl}
        alt="Loading"
        style={{ height: `${height}px` }} // Set the height dynamically using inline styles
        className="animate-spin"
      />
    </div>
  );
}
