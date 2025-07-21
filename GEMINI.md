
## Building and running

To build the project, you need to have Composer installed. You can then run the following command to install the dependencies:

```bash
composer install
```

Once the dependencies are installed, you can run the project using a PHP web server.

## Writing Tests

This project uses PHPUnit for testing. To run the tests, you can use the following command:

```bash
./vendor/bin/phpunit
```

## The file path for this application consists of the following:
```bash
tree -I 'node_modules|cache|test_*|tests|vendor' 
.
├── app
│   └── config.php
├── composer.json
├── composer.lock
├── GEMINI.md
├── package.json
├── package-lock.json
├── public
│   ├── css
│   ├── download.php
│   ├── index.php
│   ├── js
│   ├── scheduler.code-workspace
│   ├── upload.php
│   └── uploads
│       ├── pdfs
│       │   └── ...File.pdf
│       └── spreadsheets
│           └── ...File.xlsx
├── README.md
└── requirements.txt
```