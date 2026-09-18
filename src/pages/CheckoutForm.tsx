import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router';
import './../css/Checkout.css';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51Qhz5oLdc2iSKI3I7tq5I9KBEBDJLR0uUzCoOmhNKv0wN7gY11pGlYk9PzMueMQD7Y0d2iZnLxTOJ5ocIChoZaZp007OS4wvoH");

const CheckoutForm = () => {
 const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the background state payload
  const clientSecret = location.state?.clientSecret;

  useEffect(() => {
    // UX Safeguard: If someone tries to visit /checkout directly with no active session, send them back
    if (!clientSecret) {
      navigate("/cart");
    }
  }, [clientSecret, navigate]);

  if (!clientSecret) return null;

  const options = {clientSecret};

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default CheckoutForm
