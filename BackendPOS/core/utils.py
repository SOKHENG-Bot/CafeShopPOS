import os
import uuid
from datetime import datetime, date
from django.utils.text import get_valid_filename


def get_upload_path(instance, filename: str, folder: str = "upload") -> str:
    # Function to upload file image item
    name, ext = os.path.splitext(filename)
    ext = ext or ""  # null if no extension
    random_filename = f"{uuid.uuid4().hex[:12]}-{ext}"
    now = datetime.now()
    date_path = f"{now.year}/{now.month:02d}/{now.day:02d}"
    return os.path.join(folder, date_path, get_valid_filename(random_filename))


def generate_order_number() -> str:
    # Function to generate unique order number
    today = date.today().strftime("%Y%m%d")
    random_suffix = str(uuid.uuid4().int)[:4]
    return f"ORD-{today}-{random_suffix}"
