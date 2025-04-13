<?php
$conn = new mysqli("localhost", "root", "", "task7");
$search = $_GET['search'];

$result = $conn->query("SELECT * FROM bills WHERE transaction_id LIKE '%$search%'");

while ($row = $result->fetch_assoc()) {
  echo "<p><b>Transaction ID:</b> ".$row['transaction_id']." | ₹".$row['total_amount']." | ".$row['purchase_date']."</p>";
}
?>
