 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/script.js
index 0000000000000000000000000000000000000000..b4942841e0de4b92fbbd174ceb387e1b8dd541ff 100644
--- a//dev/null
+++ b/script.js
@@ -0,0 +1,83 @@
+document.addEventListener('DOMContentLoaded', () => {
+  loadCurrencies();
+});
+
+let chart;
+
+async function loadCurrencies() {
+  try {
+    const res = await fetch('https://api.exchangerate.host/symbols');
+    const data = await res.json();
+    const options = Object.keys(data.symbols)
+      .map(code => `<option value="${code}">${code}</option>`)
+      .join('');
+    document.getElementById('from').innerHTML = options;
+    document.getElementById('to').innerHTML = options;
+    document.getElementById('from').value = 'USD';
+    document.getElementById('to').value = 'EUR';
+  } catch (err) {
+    document.getElementById('result').textContent = 'Failed to load currencies.';
+  }
+}
+
+async function convert() {
+  const amount = parseFloat(document.getElementById('amount').value);
+  if (isNaN(amount)) {
+    document.getElementById('result').textContent = 'Please enter a valid amount.';
+    return;
+  }
+
+  const from = document.getElementById('from').value;
+  const to = document.getElementById('to').value;
+
+  try {
+    const res = await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`);
+    const data = await res.json();
+    const rate = data.rates[to];
+    const converted = amount * rate;
+    document.getElementById('result').textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
+    document.getElementById('timestamp').textContent = `Rates from: ${data.date}`;
+    drawChart(from, to);
+  } catch (err) {
+    document.getElementById('result').textContent = 'Conversion failed.';
+    document.getElementById('timestamp').textContent = '';
+  }
+}
+
+async function drawChart(from, to) {
+  try {
+    const end = new Date();
+    const start = new Date();
+    start.setDate(end.getDate() - 6); // last 7 days including today
+    const endStr = end.toISOString().slice(0,10);
+    const startStr = start.toISOString().slice(0,10);
+
+    const res = await fetch(`https://api.exchangerate.host/timeseries?start_date=${startStr}&end_date=${endStr}&base=${from}&symbols=${to}`);
+    const data = await res.json();
+    const labels = Object.keys(data.rates).sort();
+    const values = labels.map(d => data.rates[d][to]);
+
+    const ctx = document.getElementById('rateChart').getContext('2d');
+    if (chart) chart.destroy();
+    chart = new Chart(ctx, {
+      type: 'line',
+      data: {
+        labels,
+        datasets: [{
+          label: `${from}/${to}`,
+          data: values,
+          borderColor: '#0074D9',
+          fill: false
+        }]
+      },
+      options: {
+        responsive: true,
+        scales: {
+          y: { beginAtZero: false }
+        }
+      }
+    });
+  } catch (err) {
+    console.error('Chart error', err);
+  }
+}
 
EOF
)
