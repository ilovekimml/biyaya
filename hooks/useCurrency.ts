"use client";

import { useEffect, useState } from "react";
import { detectCountry } from "@/utils/location";
import { getCurrencyForCountry } from "@/utils/currencyMap";
import { convertCurrency } from "@/utils/convert";

export default function useCurrency() {
  const [currency, setCurrency] = useState("PHP");
  const [country, setCountry] = useState("PH");

  useEffect(() => {
    async function init() {
      const ctry = await detectCountry();
      setCountry(ctry);
      setCurrency(getCurrencyForCountry(ctry));
    }

    init();
  }, []);

  return { currency, country, convertCurrency };
}
