import os
from cryptography.fernet import Fernet
import base64

# Generate a key (keep this secret!) or load from environment variable
key = os.environ.get("ACCOUNT_KEY")
if not key:
    key = Fernet.generate_key().decode()
    print("Generated new key. Store securely! ACCOUNT_KEY=", key)
else:
    key = key.encode()
f = Fernet(key)


def encrypt_account(account_data: str) -> str:
    """Encrypts account data."""
    encrypted_data = f.encrypt(account_data.encode())
    return base64.b64encode(encrypted_data).decode()


def decrypt_account(encrypted_data: str) -> str:
    """Decrypts account data."""
    decoded_data = base64.b64decode(encrypted_data.encode())
    decrypted_data = f.decrypt(decoded_data).decode()
    return decrypted_data


def save_account(username: str, password: str):
    """Saves an encrypted account to a file."""
    encrypted_data = encrypt_account(f"{username}:{password}")
    with open("api/accounts.txt", "a") as file:
        file.write(encrypted_data + "\n")


def load_accounts() -> list:
    """Loads and decrypts accounts from the file."""
    accounts = []
    try:
        with open("api/accounts.txt", "r") as file:
            for line in file:
                encrypted_data = line.strip()
                try:
                    decrypted_data = decrypt_account(encrypted_data)
                    username, password = decrypted_data.split(":", 1)
                    accounts.append((username, password))
                except Exception as e:
                    print(f"Error decrypting account: {e}")
    except FileNotFoundError:
        pass
    return accounts
