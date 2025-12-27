from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

SECRET_KEY = os.getenv("JWT_SECRET", "fallback-secret-key")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 43200))

# Initialize the password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# enforce bcrypt byte-limit centrally (72 bytes)
BCRYPT_MAX_PASSWORD = 72

def _truncate_password_to_bcrypt(password: str) -> str:
	# ensure we truncate by bytes (bcrypt counts bytes), then decode safely
	b = (password or "").encode("utf-8")
	if len(b) > BCRYPT_MAX_PASSWORD:
		b = b[:BCRYPT_MAX_PASSWORD]
		# decode back to string, ignore truncated partial character if any
		return b.decode("utf-8", errors="ignore")
	return password or ""

def verify_password(plain_password, hashed_password):
    truncated = _truncate_password_to_bcrypt(plain_password)
    return pwd_context.verify(truncated, hashed_password)

def get_password_hash(password: str):
    # Force truncation here
    password = password[:72]
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)