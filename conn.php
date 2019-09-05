<?php
$servername = "35.234.65.85";
$username = "root";
$password = "password";
$dbname = "SpoonsEntries";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM entries";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "Pub: " . $row["pub"]. " - Username: " . $row["username"]. " Date:" . $row["date"]." Order Total:" . $row["orderTotal"]. "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();
?>