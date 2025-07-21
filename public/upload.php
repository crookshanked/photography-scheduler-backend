<?php 
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../app/config.php';
use Ramsey\Uuid\Uuid;

// Receive File: Handle the POST request from an HTML form. Validate the uploaded file (is it present? no errors? is it an .xlsx file?).
// Move File: Move the uploaded file from the temporary directory to your /uploads/spreadsheets/ folder.
// Clear Old Data: Before importing, clear the schedule_imported table to start fresh.
// Parse and Import: Use PhpOffice\PhpSpreadsheet.
// Load the spreadsheet file.
// Get the active worksheet.
// Iterate through rows (skipping the header row).
// For each row, extract data from the cells (e.g., A=Date, B=Start Time, etc.).
// Sanitize all data to prevent issues.
// Prepare a PDO INSERT statement to insert the row into the schedule_imported table. Use prepared statements to prevent SQL injection.
// Wrap the entire import process in a database transaction for data integrity.
// Depending on the form submission, handle the file upload for either .xlsx or PDF files.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['xlsxFile']) && $_FILES['xlsxFile']['error'] === UPLOAD_ERR_OK) {
        // Handle .xlsx file upload
        $fileTmpPath = $_FILES['xlsxFile']['tmp_name'];
        $fileName = $_FILES['xlsxFile']['name'];
        $fileSize = $_FILES['xlsxFile']['size'];
        $fileType = $_FILES['xlsxFile']['type'];

        // Validate file type
        if (strtolower(pathinfo($fileName, PATHINFO_EXTENSION)) !== 'xlsx') {
            die('Error: Please upload a valid .xlsx file.');
        }

        // Move the uploaded file to the uploads/spreadsheets directory
        $spreadsheetDir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'spreadsheets' . DIRECTORY_SEPARATOR;
        if (!is_dir($spreadsheetDir)) {
            mkdir($spreadsheetDir, 0755, true);
        }
        $safeFileName = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', pathinfo($fileName, PATHINFO_FILENAME));
        $uniqueFileName = $safeFileName . '_' . uniqid() . '.xlsx';
        $destination = $spreadsheetDir . $uniqueFileName;
        if (move_uploaded_file($fileTmpPath, $destination)) {
            echo 'File successfully uploaded: ' . htmlspecialchars($fileName);
            error_log('File successfully uploaded: ' . $fileName . '\n File size: ' . $fileSize . ' bytes, File type: ' . $fileType . ', Destination: ' . $destination);
            // TODO: Process the uploaded .xlsx file here using PhpSpreadsheet.
            // Example:

            // $uuid = Uuid::uuid4();
            
            // Use environment variables for DB credentials (never hardcode in source)
            // error_log("\nDB Config: Host=$dbHost, Name=$dbName, User=$dbUser, Pass=$dbPass"); // Mask password in logs for security
            error_log("DB Config: Host=$dbHost, Name=$dbName, User=$dbUser, Pass=" . str_repeat('*', strlen($dbPass))); // Mask password in logs for security
            
            // die;
            // Validate DB config (fail fast if missing)
            if (!$dbHost || !$dbName || !$dbUser) {
                die('Database configuration is missing.');
            }

             
            // print_r("<pre align='left'>");
            // print_r("<div>");
            // var_dump($_SERVER);
            // var_dump($_REQUEST);
            // var_dump($_FILES);
            // print_r("</div>");
            // print_r("</pre>");
            try {
                $db = new PDO(
                    "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
                    $dbUser,
                    $dbPass,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false, // Use native prepares
                    ]
                );
                error_log('\nDatabase connection established.');
            } catch (PDOException $e) {
                error_log('Database connection failed: ' . $e->getMessage());
                die('Database connection failed.');
            }
            $db->beginTransaction();
            error_log('\nBegin spreadsheet processing');
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($destination);
            // Process the spreadsheet data as needed 
            // For example, iterate through rows and import data into the database.
            $worksheet = $spreadsheet->getActiveSheet();
            $rowIterator = $worksheet->getRowIterator();
            // Try and map the columns to your database structure.
            // Iterate through the first row to get the headers if needed.
            $headerRow = $rowIterator->current();
            $cellIterator = $headerRow->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false); // Loop through all cells, even if they are empty
            $headers = [];
            foreach ($cellIterator as $cell) {
                $headers[] = $cell->getValue(); // Collect header values
            }
            error_log('Headers: ' . implode(', ', $headers));
            // Here you can map the headers to your database columns if needed.
            // For example, if your headers are ['Date', 'Start Time', 'End Time', ...],
            // you can map them to your database columns like this:
            // $columnMap = [
            //     'Date' => 'date',
            //     'Start Time' => 'start_time',
            //     'End Time' => 'end_time',
            //     // Add more mappings as needed
            // ];
            $columnMap = [];
            foreach ($headers as $index => $header) {
                // Sanitize header names to create a mapping
                // Replace spaces with _, remove special characters, and convert to lowercase
                // This will help in accessing the columns later in a consistent way.
                // For example, 'Date' becomes 'date', 'Start Time' becomes 'start_time', etc.
                $sanitizedHeader = preg_replace('/[^a-zA-Z0-9_]/', '', str_replace(' ', '_', strtolower($header)));
                $columnMap[$sanitizedHeader] = $index; // Map sanitized header to its index
            }
            // Add an entry for the filename if you want to store it in the database
            error_log('Column map: ' . print_r($columnMap, true));

            /// Use $columnMap later to map the headers to your database columns.

            // Now you can use $columnMap to access the correct columns in each row.
            // For example, if you want to access the 'Date' column, you can do
            // $dateColumnIndex = $columnMap['date'] ?? null; // Get the index of the 'date' column
            // if ($dateColumnIndex !== null) {
            //     $dateValue = $row->getCell($dateColumnIndex + 1)->getValue(); // +1 because PhpSpreadsheet is 1-indexed
            //     error_log('Date value: ' . $dateValue);
            // }

            // You can also validate the headers here to ensure they match your expected format.
            error_log('Headers processed, ready to iterate through rows...');
            // Validate that the header row contains at least one non-empty cell
            $hasHeader = false;
            foreach ($headers as $headerCell) {
                if (!empty($headerCell)) {
                    $hasHeader = true;
                    break;
                }
            }
            if (!$headerRow || !$hasHeader) {
                die('Error: Invalid header row in the spreadsheet.');
            }
            // Now iterate through the rest of the rows
            $rowIterator->next(); // Skip the header row
            // Iterate through each row in the worksheet
            error_log('Processing rows...');
            if (empty($rowIterator)) {
                die('Error: No data found in the spreadsheet.');
            }
            // Loop through each row in the worksheet
            error_log('Starting to iterate through rows...');
            if (!$rowIterator->valid()) {
                die('Error: No valid rows found in the spreadsheet.');
            }
            error_log('Valid rows found, proceeding to iterate...');
            // Iterate through each row in the worksheet
            error_log('Iterating through rows...');
            foreach ($rowIterator as $row) {
                $cellIterator = $row->getCellIterator();
                $cellIterator->setIterateOnlyExistingCells(false); // Loop through all cells, even if they are empty
                $rowData = [];
                foreach ($cellIterator as $cell) {
                    $rowData[] = $cell->getValue(); // Collect cell values
                }
                error_log('Row data: ' . implode(', ', $rowData));
                $uuid = Uuid::uuid4()->toString();
                // Insert the row into the schedule_imported table 
                $db->prepare(
                    "INSERT INTO schedule_imported (id, date, start_time, end_time, reason, student_first_name, student_last_name, comments, source, datetimeadded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())"
                )->execute([
                    $uuid,
                    $rowData[$columnMap['date']] ?? null,
                    $rowData[$columnMap['start_time']] ?? null,
                    $rowData[$columnMap['end_time']] ?? null,
                    $rowData[$columnMap['reason']] ?? null,
                    $rowData[$columnMap['student_first_name']] ?? null,
                    $rowData[$columnMap['student_last_name']] ?? null,
                    $rowData[$columnMap['comments']] ?? null,
                    $uniqueFileName,
                ]);
                // Here you can process $rowData, e.g., insert into the database
                // Example: $db->prepare("INSERT INTO schedule_imported (date, start_time, end_time, ...) VALUES (?, ?, ?, ...)")
                //          ->execute([$rowData[0], $rowData[1], $rowData[2], ...]);
                // Make sure to sanitize and validate the data before inserting into the database.
            }
            echo 'Spreadsheet processed successfully.';   
        } else {
            die('Error: Could not move the uploaded file. Please check permissions on the uploads directory.');
        }
    } elseif (isset($_FILES['pdfFile']) && $_FILES['pdfFile']['error'] === UPLOAD_ERR_OK) {
        // Handle PDF file upload
        $fileTmpPath = $_FILES['pdfFile']['tmp_name'];
        $fileName = $_FILES['pdfFile']['name'];
        $fileSize = $_FILES['pdfFile']['size'];
        $fileType = $_FILES['pdfFile']['type'];
        
        // Validate file type
        if (pathinfo($fileName, PATHINFO_EXTENSION) !== 'pdf') {
            die('Error: Please upload a valid PDF file.');
        }
        
        // Move the uploaded file to the uploads/pdfs directory
        $pdfDir = __DIR__ . '/uploads/pdfs/';
        if (!is_dir($pdfDir)) {
            mkdir($pdfDir, 0755, true);
        }
        // Sanitize filename and generate unique name to prevent collisions and security issues
        $safeFileName = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', pathinfo($fileName, PATHINFO_FILENAME));
        $uniqueFileName = $safeFileName . '_' . uniqid() . '.pdf';
        $destination = $pdfDir . $uniqueFileName;
        if (move_uploaded_file($fileTmpPath, $destination)) {
            echo 'PDF successfully uploaded: ' . htmlspecialchars($uniqueFileName);
            error_log('File successfully uploaded: ' . $uniqueFileName);
        } else {
            die('Error: Could not move the uploaded PDF file.');
        }
    } else {
        die('Error: No valid file uploaded or an error occurred during upload.');
    }
} else {
    die('Error: Invalid request method.');
}
