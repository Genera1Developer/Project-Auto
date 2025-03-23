import os
import json
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend

def encrypt_data(data, password):
    password_provided = password.encode()
    salt = os.urandom(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=390000,
        backend=default_backend()
    )
    key = base64.urlsafe_b64encode(kdf.derive(password_provided))
    f = Fernet(key)
    encrypted_data = f.encrypt(data.encode())
    return base64.b64encode(salt).decode() + ":" + base64.b64encode(encrypted_data).decode()

def decrypt_data(encrypted_data, password):
    salt, encrypted_content = encrypted_data.split(":")
    salt = base64.b64decode(salt)
    encrypted_content = base64.b64decode(encrypted_content)
    password_provided = password.encode()

    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=390000,
        backend=default_backend()
    )
    key = base64.urlsafe_b64encode(kdf.derive(password_provided))
    f = Fernet(key)
    decrypted_data = f.decrypt(encrypted_content).decode()
    return decrypted_data

def backup(data, filename, password):
    encrypted_data = encrypt_data(json.dumps(data), password)
    with open(filename, 'w') as f:
        f.write(encrypted_data)

def restore(filename, password):
    with open(filename, 'r') as f:
        encrypted_data = f.read()
    decrypted_data = decrypt_data(encrypted_data, password)
    return json.loads(decrypted_data)

if __name__ == '__main__':
    # Example Usage (For testing - REMOVE IN PRODUCTION)
    data = {"name": "test", "value": 123}
    password = "mysecretpassword"
    filename = "backup.enc"

    backup(data, filename, password)
    restored_data = restore(filename, password)
    print(f"Restored Data: {restored_data}")
    assert data == restored_data
    os.remove(filename)
    print("Backup and restore successful!")