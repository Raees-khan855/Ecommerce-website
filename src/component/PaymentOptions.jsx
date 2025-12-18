// src/components/PaymentOptions.jsx
import React from "react";

function PaymentOptions({ selectedMethod, onSelect }) {
  return (
    <div className="mb-6 w-full">
      <h3 className="text-lg font-semibold mb-3">Payment Method</h3>

      <label
        htmlFor="cod"
        className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-100 transition text-sm"
      >
        <input
          type="radio"
          id="cod"
          name="payment"
          value="COD"
          checked={selectedMethod === "COD"}
          onChange={() => onSelect("COD")}
          className="h-4 w-4"
        />
        <span>Cash on Delivery</span>
      </label>
    </div>
  );
}

export default PaymentOptions;
