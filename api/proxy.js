import logging
import datetime
import socket
import structlog
import os
import json

# Configure structlog
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer(sort_keys=True)
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

def log_request(method, url, status_code, response_time, client_ip, content_length=None):
    """Logs proxy requests with detailed information using structlog."""
    logger.info(
        "proxy_request",
        method=method,
        url=url,
        status_code=status_code,
        response_time=response_time,
        client_ip=client_ip,
        content_length=content_length,
        hostname=get_hostname()
    )

def setup_logging():
    """Sets up structlog logging."""
    pass # structlog configuration is handled globally

def get_hostname():
    """Gets the hostname of the machine."""
    return socket.gethostname()

def get_environment():
    """Gets the environment the application is running in."""
    return os.environ.get("ENVIRONMENT", "development")

if __name__ == '__main__':
    # Example usage (for testing purposes)
    setup_logging()
    hostname = get_hostname()
    log_request("GET", "https://www.example.com", 200, 0.15, "192.168.1.1", 1234)
    log_request("POST", "https://api.example.com/data", 500, 1.23, "10.0.0.5", 56789)
    log_request("PUT", "https://api.example.com/resource", 201, 0.50, "172.16.0.10", 1024)
    logger.info("Application started", hostname=hostname, environment=get_environment())