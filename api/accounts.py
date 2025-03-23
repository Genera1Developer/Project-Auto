import os
from cryptography.fernet import Fernet
import base64
import hashlib
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend

# Generate a key (keep this secret!) or load from environment variable
key = os.environ.get("ACCOUNT_KEY")
if not key:
    key = Fernet.generate_key().decode()
    print("Generated new key. Store securely! ACCOUNT_KEY=", key)
else:
    key = key.encode()
f = Fernet(key)

def derive_key(password: str, salt: bytes = None) -> bytes:
    """Derives a secure key from a password using PBKDF2."""
    if salt is None:
        salt = os.urandom(16)  # Generate a new salt if none provided
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    kdf.verify = lambda a,b: kdf.verify(a,b) if hasattr(kdf, 'verify') else None #Conditional call

    return kdf, salt


def encrypt_account(account_data: str, password:str) -> tuple[str,bytes]:
    """Encrypts account data with key derived from password and returns salt."""
    kdf,salt = derive_key(password)
    key = kdf.derive(password.encode())
    f = Fernet(base64.urlsafe_b64encode(key))

    encrypted_data = f.encrypt(account_data.encode())
    return base64.b64encode(encrypted_data).decode(), salt

def decrypt_account(encrypted_data: str, password:str, salt:bytes) -> str:
    """Decrypts account data using key derived from password."""
    kdf,salt = derive_key(password,salt)
    key = kdf.derive(password.encode())
    f = Fernet(base64.urlsafe_b64encode(key))
    decoded_data = base64.b64decode(encrypted_data.encode())
    decrypted_data = f.decrypt(decoded_data).decode()
    return decrypted_data

def save_account(username: str, password: str, master_password: str):
    """Saves an encrypted account to a file, derives encryption from master."""
    account_string = f"{username}:{password}"
    encrypted_data, salt = encrypt_account(account_string,master_password)
    salt_b64 = base64.b64encode(salt).decode()
    with open("api/accounts.txt", "a") as file:
        file.write(f"{encrypted_data}:{salt_b64}\n")

def load_accounts(master_password:str) -> list:
    """Loads and decrypts accounts from the file using master password."""
    accounts = []
    try:
        with open("api/accounts.txt", "r") as file:
            for line in file:
                try:
                    encrypted_data, salt_b64 = line.strip().split(":", 1)
                    salt = base64.b64decode(salt_b64.encode())

                    decrypted_data = decrypt_account(encrypted_data,master_password, salt)
                    username, password = decrypted_data.split(":", 1)
                    accounts.append((username, password))
                except Exception as e:
                    print(f"Error decrypting account: {e}")
    except FileNotFoundError:
        pass
    return accounts