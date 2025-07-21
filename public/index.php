<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Upload Scheduler File(s)</title>
    <link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">
    <!-- ////////////////////////////////////////////////////////////////////
    // This is a simple HTML form to upload .xlsx and PDF files for the scheduler.
    // The form submits to upload.php, which handles the file upload and processing.
    // The form includes two sections: one for .xlsx files and another for PDF files.
    // The .xlsx files are expected to be processed by PhpSpreadsheet, and the PDF files
    // are expected to be processed by a PDF library like TCPDF or FPDF.
    // Make sure to have the necessary libraries installed via Composer:
    // composer require phpoffice/phpspreadsheet
    // composer require tecnickcom/tcpdf
    // composer require setasign/fpdf
    // The upload.php script should handle the file validation, moving, and processing.
    // The form uses Bootstrap for styling and layout.
    // Make sure to adjust the paths to your libraries and upload directories as needed.
    ////////////////////////////////////////////////////////////////////
    //  Note: Ensure that the upload directories exist and have the correct permissions.
    //  The upload.php script should handle the file validation, moving, and processing.
    //  The form uses Bootstrap for styling and layout.
    //  Make sure to adjust the paths to your libraries and upload directories as needed.
    ////////////////////////////////////////////////////////////////////
    // Other possible libraries to obtain
    // datatables.net
    // datatables.net-bs5
    // datatables.net-buttons-bs5
    // datatables.net-buttons-dts
    // datatables.net-buttons-jszip
    // datatables.net-buttons-pdfmake
    // datatables.net-buttons-html5
    // datatables.net-buttons-print
    // datatables.net-colreorder-bs5
    // datatables.net-colreorder-dts
    // datatables.net-fixedcolumns-bs5
    // datatables.net-fixedcolumns-dts
    // datatables.net-fixedheader-bs5
    // datatables.net-fixedheader-dts
    // datatables.net-keytable-bs5  
    ////////////////////////////////////////////////////////////////////////
    -->
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <h2 class="card-title mb-4">Upload .xlsx File</h2>
                        <form action="upload.php" method="post" enctype="multipart/form-data">
                            <div class="mb-3">
                                <label for="xlsxFile" class="form-label">Select .xlsx file to upload:</label>
                                <input type="file" name="xlsxFile" id="xlsxFile" accept=".xlsx" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Upload</button>
                        </form>
                        <!-- Create javascript to perform an ajax call to upload.php so the upload can be handled without a page refresh. -->
                        <p class="mt-3 text-muted">Note: The .xlsx file should contain the schedule data in the expected format.</p>
                        <script>
                            function setupAjaxUpload(inputId, validMimeType, formFieldName) {
                                const input = document.getElementById(inputId);
                                if (!input) return;
                                const form = input.closest('form');
                                input.addEventListener('change', function() {
                                    const file = this.files[0];
                                    if (file) {
                                        console.log('File selected:', file);
                                        const fileName = file.name;
                                        const fileSize = file.size;
                                        const fileType = file.type;
                                        console.log(`Selected file: ${fileName}, Size: ${fileSize} bytes, Type: ${fileType}`);
                                        if (fileType !== validMimeType) {
                                            alert(`Please select a valid file of type: ${validMimeType}`);
                                            this.value = '';
                                            return;
                                        }
                                    }
                                });
                                form.addEventListener('submit', function(event) {
                                    event.preventDefault();
                                    const fileInput = document.getElementById(inputId);
                                    const file = fileInput.files[0];
                                    if (!file) {
                                        alert('Please select a file to upload.');
                                        return;
                                    }
                                    const fileType = file.type;
                                    if (fileType !== validMimeType) {
                                        alert(`Please select a valid file of type: ${validMimeType}`);
                                        fileInput.value = '';
                                        return;
                                    }
                                    const formData = new FormData();
                                    formData.append(formFieldName, file);
                                    console.log('Uploading file:', file.name);
                                    fetch('upload.php', {
                                        method: 'POST',
                                        body: formData
                                    }).then(response => response.text()).then(data => {
                                        console.log('Server response:', data);
                                        alert(data);
                                        fileInput.value = '';
                                    }).catch(error => {
                                        console.error('Error uploading file:', error);
                                        alert('Error uploading file.');
                                    });
                                });
                            }
                            // Initialize the AJAX upload for the .xlsx file input
                            setupAjaxUpload('xlsxFile', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsxFile');
                        </script>
                    </div>
                </div>
                <!-- File selected: 
File { name: "SHHSSenior_1001253426.pdf", lastModified: 1750836790000, webkitRelativePath: "", size: 659288, type: "application/pdf" }
public:70:49
Selected file: SHHSSenior_1001253426.pdf, Size: 659288 bytes, Type: application/pdf public:74:49
Uploading file: SHHSSenior_1001253426.pdf public:98:45
Server response: <empty string> public:103:49
 -->

                <div class="card shadow-sm">
                    <div class="card-body">
                        <h2 class="card-title mb-4">Upload PDF File</h2>
                        <form action="upload.php" method="post" enctype="multipart/form-data">
                            <div class="mb-3">
                                <label for="pdfFile" class="form-label">Select PDF file to upload:</label>
                                <input type="file" name="pdfFile" id="pdfFile" accept=".pdf" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Upload</button>
                        </form>
                        <script>
                            setupAjaxUpload('pdfFile', 'application/pdf', 'pdfFile');
                        </script>
                        <p class="mt-3 text-muted">Note: The PDF file should contain the schedule data in the expected format.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
      <script src="../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>