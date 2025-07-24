<?php require_once __DIR__ . '/../../app/config.php'; ?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Photography Schedule</title>
    <script>
      window.VITE_CONFIG = {
        API_KEY: "<?php echo htmlspecialchars($apiKey, ENT_QUOTES, 'UTF-8'); ?>"
      };
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
  <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@^19.1.0",
    "react/": "https://esm.sh/react@^19.1.0/",
    "react-dom/": "https://esm.sh/react-dom@^19.1.0/",
    "react-router-dom": "https://esm.sh/react-router-dom@^7.7.0",
    "react-qrcode-logo": "https://esm.sh/react-qrcode-logo@^3.0.0"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body class="bg-gray-50">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
