<?php

// Start the session to access session variables.
// This must be called before any output is sent to the browser.
session_start();

// Include the main configuration file which defines $apiKey.
require_once __DIR__ . '/../app/config.php';

// Set the proper JSON content type header for the response.
header('Content-Type: application/json; charset=utf-8');

// --- Authentication Check ---
// This is a placeholder for your actual user authentication logic.
// In a real application, you would check for a valid user session,
// for example, by verifying $_SESSION['user_id'] or a session token.
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    // User is authenticated, respond with the API key.
    echo json_encode([
        'status' => 'success',
        'apiKey' => $apiKey
    ]);
} else {
    // User is not authenticated. Send a 401 Unauthorized response.
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unauthorized. Please log in to get an API key.'
    ]);
}
