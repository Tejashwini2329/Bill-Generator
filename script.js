function addProduct() {
    const table = document.querySelector("#productTable tbody");
    const row = table.insertRow();
    row.innerHTML = `
      <td><input type="text" class="productName"></td>
      <td><input type="number" class="quantity" value="1" oninput="updateTotal()"></td>
      <td><input type="number" class="unitPrice" value="0" oninput="updateTotal()"></td>
      <td class="productTotal">0.00</td>
    `;
    updateTotal();
  }
  
  function updateTotal() {
    let subtotal = 0;
    document.querySelectorAll("#productTable tbody tr").forEach(row => {
      const qty = parseFloat(row.querySelector(".quantity").value) || 0;
      const price = parseFloat(row.querySelector(".unitPrice").value) || 0;
      const total = qty * price;
      row.querySelector(".productTotal").innerText = total.toFixed(2);
      subtotal += total;
    });
  
    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("totalAmount").innerText = subtotal.toFixed(2);
  }
  
  function previewBill() {
    const customerName = document.getElementById("buyerName").value;
    const email = document.getElementById("email").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const transactionDate = document.getElementById("purchaseDate").value;
    const total = document.getElementById("totalAmount").innerText;
  
    let productList = '';
    const productRows = document.querySelectorAll("#productTable tbody tr");
  
    productRows.forEach(row => {
      const product = row.querySelector(".productName").value;
      const qty = row.querySelector(".quantity").value;
      const price = row.querySelector(".unitPrice").value;
      const totalPrice = (parseFloat(qty) * parseFloat(price)).toFixed(2);
  
      productList += `
        <p><strong>Product:</strong> ${product}</p>
        <p><strong>Quantity:</strong> ${qty}</p>
        <p><strong>Price:</strong> ₹${price}</p>
        <p><strong>Total:</strong> ₹${totalPrice}</p>
        <hr>
      `;
    });
  
    const previewContent = `
      <p><strong>Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      <p><strong>Date:</strong> ${transactionDate}</p>
      <hr>
      ${productList}
      <p><strong>Total Amount:</strong> ₹${total}</p>
    `;
  
    document.getElementById("previewContent").innerHTML = previewContent;
    document.getElementById("previewSection").style.display = "block";
  }
  
  function downloadPDF() {
    window.print(); // You can integrate html2pdf.js for better PDF control
  }
  
  function saveBill() {
    const buyerData = {
      buyerName: document.getElementById("buyerName").value,
      address: document.getElementById("address").value,
      contact: document.getElementById("contact").value,
      email: document.getElementById("email").value,
      transactionId: document.getElementById("transactionId").value,
      purchaseDate: document.getElementById("purchaseDate").value,
      paymentMethod: document.getElementById("paymentMethod").value,
      subtotal: document.getElementById("subtotal").innerText,
      totalAmount: document.getElementById("totalAmount").innerText
    };
  
    const productRows = document.querySelectorAll("#productTable tbody tr");
    let productList = [];
  
    productRows.forEach(row => {
      const productName = row.querySelector(".productName").value;
      const quantity = row.querySelector(".quantity").value;
      const unitPrice = row.querySelector(".unitPrice").value;
      const total = row.querySelector(".productTotal").innerText;
  
      productList.push({ productName, quantity, unitPrice, total });
    });
  
    fetch("save_bill.php", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerData, productList })
    })
      .then(response => response.text())
      .then(data => alert(data))
      .catch(err => console.error(err));
  }
  
  function searchBill() {
    const transactionId = document.getElementById("searchTransactionId").value;
    window.open(`search_bill.php?transactionId=${transactionId}`, "_blank");
  }
  