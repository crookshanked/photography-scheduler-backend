<?php
require_once __DIR__ . '/../app/config.php';

// --- Set HTTP Header for JSON Response ---
// This tells the client (browser, app, etc.) to expect a JSON response.
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // Optional: Allows cross-origin requests

// --- Establish Database Connection using PDO ---
try {
    $db = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    // If connection fails, send a JSON error response with a 500 status code.
    http_response_code(500);
    // It's good practice to not expose detailed error messages in production
    error_log('Database connection failed: ' . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed.'
    ]);
    exit(); // Terminate the script
}

$response = [];

// --- Prepare and Execute SQL Query ---
// The 'upload.php' script inserts into 'schedule_imported', so we'll query that table.
// The original query was for a 'users' table, which seems to be from a template.
try {
    $stmt = $db->query("SELECT * FROM schedule_imported ORDER BY date, start_time");
    $data = $stmt->fetchAll();

    if ($data) {
        $response = [
            'status' => 'success',
            'data' => $data
        ];
    } else {
        // No results found
        $response = [
            'status' => 'success',
            'message' => 'No records found.',
            'data' => []
        ];
    }
} catch (PDOException $e) {
    // If the query fails, send a JSON error response.
    http_response_code(500);
    error_log('Query failed: ' . $e->getMessage());
    $response = [
        'status' => 'error',
        'message' => 'Query failed.'
    ];
}

// --- Return JSON Encoded Response ---
// json_encode converts the PHP array into a JSON string.
// JSON_PRETTY_PRINT makes the output human-readable (optional).
echo json_encode($response, JSON_PRETTY_PRINT);