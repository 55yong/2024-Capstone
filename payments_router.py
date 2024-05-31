from flask import Blueprint
from payments_controller import confirm_payment

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/confirm', methods=['POST'])
def confirm():
    return confirm_payment()