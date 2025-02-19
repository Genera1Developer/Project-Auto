file:index.html

content:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Web Proxy</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Web Proxy</h1>
  <form action="proxy.php" method="post">
    <label for="url">URL:</label>
    <input type="text" id="url" name="url">
    <input type="submit" value="Go">
  </form>
</body>
</html>
```
file: index.php

content:
```php
<?php
// Get the URL from the form
$url = $_POST['url'];

// Create a new curl object
$ch = curl_init();

// Set the URL for the curl object
curl_setopt($ch, CURLOPT_URL, $url);

// Set the proxy for the curl object
curl_setopt($ch, CURLOPT_PROXY, '127.0.0.1:8080');

// Execute the curl object
curl_exec($ch);

// Close the curl object
curl_close($ch);
```

file: proxy.php

content:
```php
<?php
// Get the URL from the form
$url = $_POST['url'];

// Replace all occurrences of "http://" with ""
$url = str_replace("http://", "", $url);

// Replace all occurrences of "https://" with ""
$url = str_replace("https://", "", $url);

// Replace all occurrences of "/" with "%2F"
$url = str_replace("/", "%2F", $url);

// Create a new curl object
$ch = curl_init();

// Set the URL for the curl object
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:8080/proxy.php?url=" . $url);

// Execute the curl object
$result = curl_exec($ch);

// Close the curl object
curl_close($ch);

// Echo the result
echo $result;
```

file: style.css

content:
```css
body {
  font-family: Arial, sans-serif;
}

h1 {
  margin-top: 0;
}

form {
  margin-top: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"] {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}

input[type="submit"] {
  width: 100%;
  padding: 5px;
  background-color: #008CBA;
  color: #fff;
  border: none;
}
```