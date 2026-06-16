import BuyerMessages from "./BuyerMessages";
import FarmerMessages from "./FarmerMessages";

export default function Messages() {
  const user = JSON.parse(localStorage.getItem("kisan_user") || "null");

  if (user?.role === "farmer") {
    return <FarmerMessages />;
  }

  return <BuyerMessages />;
}
