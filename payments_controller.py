from flask import request, jsonify
from payments_service import confirm_payment_service

def confirm_payment():
    try:
        data = request.get_json()
        payment_info = {
            'paymentKey': data.get('paymentKey'),
            'orderId': data.get('orderId'),
            'amount': data.get('amount')
        }
        confirm_response = confirm_payment_service(payment_info)
        return jsonify({'data': confirm_response})
    except Exception as error:
        return jsonify({'error': str(error)}), 500