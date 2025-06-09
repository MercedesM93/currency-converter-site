diff --git a//dev/null b/script.js
new file mode 100644
index 0000000..b1e9e7d
--- /dev/null
+++ b/script.js
@@
+const API_KEY = "30dffd2aba9a6304dfb482c3";
+const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;
+
+const fromCurrency = document.getElementById("from-currency");
+const toCurrency = document.getElementById("to-currency");
+const amount = document.getElementById("amount");
+const result = document.getElementById("result");
+const convertBtn = document.getElementById("convert");
+
+const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "INR", "ZAR"];
+
+currencies.forEach(curr => {
+  fromCurrency.innerHTML += `<option value="${curr}">${curr}</option>`;
+  toCurrency.innerHTML += `<option value="${curr}">${curr}</option>`;
+});
+
+fromCurrency.value = "USD";
+toCurrency.value = "EUR";
+
+convertBtn.addEventListener("click", async () => {
+  const from = fromCurrency.value;
+  const to = toCurrency.value;
+  const amt = parseFloat(amount.value);
+
+  if (isNaN(amt)) {
+    result.innerText = "Please enter a valid number";
+    return;
+  }
+
+  const response = await fetch(`${API_URL}${from}`);
+  const data = await response.json();
+
+  if (data.result === "success") {
+    const rate = data.conversion_rates[to];
+    const converted = (amt * rate).toFixed(4);
+    const inverse = (1 / rate).toFixed(4);
+
+    result.innerHTML = `
+      ${amt} ${from} = <strong>${converted} ${to}</strong><br />
+      1 ${to} = ${inverse} ${from}
+    `;
+  } else {
+    result.innerText = "Failed to fetch exchange rates.";
+  }
+});
