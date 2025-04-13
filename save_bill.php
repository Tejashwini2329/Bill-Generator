<?php 
$mysqli = new mysqli("localhost", "root", "", "task7");

// Read and decode the incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Check for connection error
if ($mysqli->connect_error) {
  die("Database connection error: " . $mysqli->connect_error);
}

if (isset($data->buyerData) && isset($data->productList)) {
  $buyer = $data->buyerData;

  // Ensure numeric values are properly formatted
  $buyer->subtotal = isset($buyer->subtotal) ? (float) str_replace('₹', '', $buyer->subtotal) : 0;
  $buyer->totalAmount = isset($buyer->totalAmount) ? (float) str_replace('₹', '', $buyer->totalAmount) : 0;

  // Prepare and execute bill insert
  $stmt = $mysqli->prepare("INSERT INTO bills (buyer_name, address, contact, email, transaction_id, purchase_date, payment_method, subtotal, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  
  $stmt->bind_param("sssssssdd",
    $buyer->buyerName,
    $buyer->address,
    $buyer->contact,
    $buyer->email,
    $buyer->transactionId,
    $buyer->purchaseDate,
    $buyer->paymentMethod,
    $buyer->subtotal,
    $buyer->totalAmount
  );
  
  if ($stmt->execute()) {
    $billId = $stmt->insert_id;

    // Insert products
    foreach ($data->productList as $product) {
      $stmt2 = $mysqli->prepare("INSERT INTO bill_products (bill_id, product_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)");
      $stmt2->bind_param("isidd",
        $billId,
        $product->productName,
        $product->quantity,
        $product->unitPrice,
        $product->total
      );
      $stmt2->execute();
      $stmt2->close();
    }

    echo "Bill saved successfully with ID: $billId";
  } else {
    echo "Error saving bill: " . $stmt->error;
  }

  $stmt->close();
} else {
  echo "Invalid data received.";
}

$mysqli->close();
?>
