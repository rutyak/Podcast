import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';

import { STRIPE_PUBLIC_KEY } from './config/stripe'; // Correct the path to your stripe config
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY); // Load Stripe with your public key

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
    </Provider>
  </React.StrictMode>
);


