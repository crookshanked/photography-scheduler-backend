<?php
require_once __DIR__ . '/../app/config.php';

// --- Set HTTP Header for JSON Response ---
// This tells the client (browser, app, etc.) to expect a JSON response.
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // Optional: Allows cross-origin requests

// --- API Key Check ---
// Use a secure, randomly generated key in your actual config.
// Example in config.php: $apiKey = 'your_super_secret_api_key';
if (!isset($apiKey) || !isset($_REQUEST['api_key']) || !hash_equals($apiKey, $_REQUEST['api_key'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit();
}

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

$action = $_REQUEST['action'] ?? 'get_all'; // Default action if not specified
$response = [];

try {
    switch ($action) {
        case 'get_events':
            // Fetch distinct dates to represent "events"
            $stmt = $db->query("SELECT * FROM schedule_events ORDER BY date ASC");
            $eventsData = $stmt->fetchAll();
            $events = [];
            foreach ($eventsData as $event) {
                // Create an event object for each unique date
                $events[] = [
                    'event_id' => $event['event_id'],
                    'date' => $event['date'], 
                    'name' => $event['name'], 
                    'location' => $event['location'], 
                ];
            }
            $response = [
                'status' => 'success',
                'data' => $events
            ];
            break;

        case 'get_entries':
            $parentEventId = $_REQUEST['parent_event_id'] ?? null;
            if ($parentEventId) {
                // Fetch entries for a specific event (date) using a prepared statement
                $stmt = $db->prepare("SELECT * FROM schedule_imported WHERE parent_event_id = ? ORDER BY start_time ASC");
                // var_dump($stmt);
                // var_dump($parentEventId);
                $stmt->execute([$parentEventId]);
                // var_dump($stmt);
                $data = $stmt->fetchAll();
                // var_dump($data);
            } else {
                // Fetch all entries if no event_id is specified
                $stmt = $db->query("SELECT * FROM schedule_imported ORDER BY date, start_time");
                $data = $stmt->fetchAll();
            }

            $response = [
                'status' => 'success',
                'data' => $data ?: []
            ];
            break;

        case 'updateEntryStatus':
            $entryId = $input['entry_id'] ?? null;
            $status = $input['status'] ?? null;

            if ($entryId === null || $status === null) {
                $response = ['status' => 'error', 'message' => 'Missing entry_id or status for updateEntryStatus.'];
                break;
            }

            $stmt = $db->prepare("UPDATE schedule_imported SET done = ? WHERE entry_id = ?");
            $stmt->execute([(int)$status, $entryId]);

            $response = ['status' => 'success', 'message' => 'Entry status updated successfully.', 'entry_id' => $entryId, 'new_status' => (int)$status];
            break;

        case 'get_all': // The original behavior
            // Fetch all entries and events
        default:
            $stmt = $db->query("SELECT * FROM schedule_imported ORDER BY date, start_time");
            $data = $stmt->fetchAll();

            if ($data) {
                $response = [
                    'status' => 'success',
                    'data' => $data
                ];
            } else {
                $response = [
                    'status' => 'success',
                    'message' => 'No records found.',
                    'data' => []
                ];
            }
            break;
    }
} catch (PDOException $e) {
    // If the query fails, send a JSON error response.
    http_response_code(500);
    error_log('Query failed: ' . $e->getMessage());
    $response = [
        'status' => 'error',
        'message' => 'A database error occurred.' // Avoid exposing detailed errors
    ];
}

// --- Return JSON Encoded Response ---
// json_encode converts the PHP array into a JSON string.
// JSON_PRETTY_PRINT makes the output human-readable (optional).
echo json_encode($response, JSON_PRETTY_PRINT);