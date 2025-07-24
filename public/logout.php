<?php
// Ideal functionality would be to log the user's id and session stop date/time...
session_start();
session_unset();
session_destroy();
error_log("User logged out, session destroyed.");
// Redirect back to the React application. (May need a different page for this?)
header('Location: /interface/');
exit();
