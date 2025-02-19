file path: api/Read Before Use.md
content: **Instructions for Using the Web Proxy**

1. **Start the web proxy server:**

```
cd /path/to/web-proxy
python server.py
```

2. **Configure your browser to use the web proxy:**

- **For Chrome:**
  - Click on the three dots in the top right corner of the browser.
  - Select "Settings".
  - Scroll down to the "Network" section and click on "Change proxy settings".
  - Click on the "LAN Settings" tab.
  - Check the "Use a proxy server for your LAN" checkbox.
  - Enter the IP address and port of the web proxy server (e.g., 127.0.0.1:8080).
  - Click on "OK" to save your changes.
- **For Firefox:**
  - Click on the three lines in the top right corner of the browser.
  - Select "Options".
  - Click on the "Network & Internet" tab.
  - Scroll down to the "Connection Settings" section and click on "Settings...".
  - Select the "Manual proxy configuration" radio button.
  - Enter the IP address and port of the web proxy server (e.g., 127.0.0.1:8080).
  - Click on "OK" to save your changes.

**Note:** The web proxy will only work for HTTP traffic. HTTPS traffic will not be proxied.

To use the web proxy, simply open your browser and navigate to any website. The web proxy will automatically handle the request and return the response.

**Additional Information:**

- The web proxy can be used to bypass website blocks and access restricted content.
- The web proxy can also be used to improve your privacy and security by hiding your IP address from websites.
- The web proxy is not a complete solution for online anonymity. It is important to use other privacy measures, such as a VPN, to protect your privacy.

**New Files:**

- `CHANGELOG.md`: Track changes to the web proxy project.
- `.gitignore`: Ignore unnecessary files from version control.