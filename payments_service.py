import requests
import base64
import os, json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# TODO: 개발자센터에 로그인해서 내 결제위젯 연동 키 > 시크릿 키를 입력하세요. 시크릿 키는 외부에 공개되면 안돼요.
secret_file = os.path.join(BASE_DIR, 'secrets.json')

with open(secret_file) as f:
    secrets = json.loads(f.read())

def get_secret(setting):
    try:
        return secrets[setting]
    except KeyError:
        error_msg = "Set the {} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)

# SECRET_KEY = get_secret("SECRET_KEY")
SECRET_KEY = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6"

def confirm_payment_service(payment_info):
    payment_key = payment_info.get('paymentKey')
    order_id = payment_info.get('orderId')
    amount = payment_info.get('amount')

    ENCRYPTED_SECRET_KEY = "Basic " + base64.b64encode(f"{SECRET_KEY}:".encode()).decode()

    headers = {
        'Authorization': ENCRYPTED_SECRET_KEY,
        'Content-Type': 'application/json'
    }

    response = requests.post(
        "https://api.tosspayments.com/v1/payments/confirm",
        json={'orderId': order_id, 'amount': amount, 'paymentKey': payment_key},
        headers=headers
    )

    return response.json()