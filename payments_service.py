import requests
import base64

# TODO: 개발자센터에 로그인해서 내 결제위젯 연동 키 > 시크릿 키를 입력하세요. 시크릿 키는 외부에 공개되면 안돼요.
secret_key = "test_ck_XZYkKL4Mrjq5M4vpNEDkV0zJwlEW"

def confirm_payment_service(payment_info):
    payment_key = payment_info.get('paymentKey')
    order_id = payment_info.get('orderId')
    amount = payment_info.get('amount')

    encrypted_secret_key = "Basic " + base64.b64encode(f"{secret_key}:".encode()).decode()

    headers = {
        'Authorization': encrypted_secret_key,
        'Content-Type': 'application/json'
    }

    response = requests.post(
        "https://api.tosspayments.com/v1/payments/confirm",
        json={'orderId': order_id, 'amount': amount, 'paymentKey': payment_key},
        headers=headers
    )

    return response.json()