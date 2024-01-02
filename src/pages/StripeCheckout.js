import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { selectCurrentOrder } from "../features/order/orderSlice";
import CheckoutForm from "./CheckoutForm";
import "../Stripe.css";

const stripePromise = loadStripe(
  "pk_test_51ODomQSJv0vJsn9f0cho474x4rHpExH2OZeij7z3dHj6AokH8ZtBih4OeQsRnFd9fbk7nA1KTbLXUVYxjhdB2LWu00EhOLiR39"
);

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const currentOrder = useSelector(selectCurrentOrder);

  console.log(currentOrder);

  useEffect(() => {
    // create PaymentIntent as soon as the page loads
    fetch("http://localhost:8080/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalAmount: currentOrder.totalAmount }),
      meta: { order_id: currentOrder.id }, // this info will go to stripe => and then to our webhook
      // so we can conclude that payment was successfull, even if client coses window after pay
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="stripe">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
