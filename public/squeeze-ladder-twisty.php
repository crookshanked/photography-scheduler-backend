<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../app/config.php';
use Ramsey\Uuid\Uuid;
// This file is linked to directly only via direct messaging or email to a user. 
// The functionality of this page is to start a php session, and set a session variable.
// Ideal functionality would be to log the user's IP,http_user_agent,http_referrer, session start date/time...

session_start();

// Block any IP geolocated in China, Russia, South Korea, and India.
$blockedCountries = ['CN', 'RU', 'KP', 'IN']; // ISO 3166-1 alpha-2 country codes

$ipAddress = $_SERVER['REMOTE_ADDR'];
$countryCode = '';

// Attempt to get country code from a geo-IP service or local database
// This is a placeholder. You'd typically use a library or service like GeoIP2.
// For demonstration, let's assume a function `getCountryCodeFromIp` exists.
// In a real scenario, you'd integrate with a GeoIP database or API.
function getCountryCodeFromIp($ip) {
    // Example: Using a free API (rate-limited, not for production)
    $url = "http://ip-api.com/json/{$ip}";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($response, true);
    return $data['countryCode'] ?? '';
}

$countryCode = getCountryCodeFromIp($ipAddress);

if (in_array($countryCode, $blockedCountries)) {
    // Clear all session variables and destroy the session.
    session_destroy();
    error_log("Blocked access from IP: {$ipAddress} (Country: {$countryCode})");
    http_response_code(403); // Forbidden
    die('Access Denied.');
}

// This sets a session variable to simulate a logged-in user.
if (!isset($_SESSION['loggedin'])) {
    $_SESSION['loggedin'] = false;
}
if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 0;
}
if (isset($_REQUEST['logout']) && $_REQUEST['logout'] == 1){
    $_SESSION['loggedin'] = false;
    $_SESSION['user_id'] = 0;
    error_log("Test user logged out, session destroyed.");
    header('Location: https://youtu.be/sT-t6lAbHgY');
    exit();
}
if (isset($_REQUEST['donut']) && $_REQUEST['donut'] == 67274744){
    $_SESSION['processing_login'] = true;
};
if(isset($_SESSION['processing_login']) && $_SESSION['processing_login'] && isset($_REQUEST['donut']) && $_REQUEST['donut'] == 67274744)
{
    $_SESSION['processing_login'] = false;
    $_SESSION['loggedin'] = true;

}
// Need to possibly create a unique id for each user? Possibly UUID?
$userUuid = Uuid::uuid4()->toString();
$_SESSION['user_id'] = $userUuid; // Example user ID
// Capture the desired fields here as variables.
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'N/A';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'N/A';
$httpReferrer = $_SERVER['HTTP_REFERER'] ?? 'N/A';
$sessionStartTime = date('Y-m-d H:i:s');
// Save these variables as $_SESSION variables.
$_SESSION['ip_address'] = $ipAddress;
$_SESSION['user_agent'] = $userAgent;
$_SESSION['http_referrer'] = $httpReferrer;
$_SESSION['session_start_time'] = $sessionStartTime;
$_SESSION['session_end_time'] = null;
error_log("Test user ".$userUuid." logged in from ".$ipAddress.", user agent: ".$userAgent.", referrer: ".$httpReferrer.", session created.");
// Redirect back to the React application.
header('Location: /scheduler/public/interface/');
exit();
