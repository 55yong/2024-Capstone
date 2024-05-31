from flask import Flask, request, jsonify, session
from flask_cors import CORS
from payments_router import payments_bp
from payments_service import confirm_payment_service  # 추가된 임포트
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError


app = Flask(__name__)
CORS(app)

# "/sandbox-dev/api/v1/payments" 경로에 대한 블루프린트 사용
app.register_blueprint(payments_bp, url_prefix='/sandbox-dev/api/v1/payments')

@app.route('/sandbox-dev/api/v1/payments/confirm', methods=['POST'])
def confirm_payment():
    # 요청 바디에서 필요한 데이터를 추출
    data = request.get_json()
    payment_key = data.get("paymentKey")
    order_id = data.get("orderId")
    amount = data.get("amount")

    # 결제 승인 로직을 호출
    confirm_response = confirm_payment_service(payment_key, order_id, amount)

    # 응답을 반환
    return jsonify({'data': confirm_response})

# 세션에 사용될 비밀키 설정
app.secret_key = 'lsh190824!'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    nickname = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    mileage = db.Column(db.Integer, default=0)  

    def __init__(self, username, password, nickname, phone, email, mileage=0):
        self.username = username
        self.password = password
        self.nickname = nickname
        self.phone = phone
        self.email = email
        self.mileage = mileage

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    nickname = data.get('nickname')
    phone = data.get('phone')
    email = data.get('email')
    mileage = data.get('mileage', 0)

    # 간단한 유효성 검사 추가
    if not all([username, password, nickname, phone, email]):
        return jsonify({'message': '모든 필드를 작성해주세요.'}), 400

    new_user = User(username, password, nickname, phone, email)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': '회원가입이 완료되었습니다.'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': '이미 존재하는 사용자입니다.'}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # 사용자가 제공한 사용자 이름을 사용하여 사용자 정보를 찾음
    user = User.query.filter_by(username=username).first()

    if user and user.password == password:
        # 로그인 성공 시 세션에 사용자 ID 저장
        session['user_id'] = user.id
       
        
        # 마일리지 정보를 클라이언트에 반환
        return jsonify({
            'message': '로그인 성공!',
            'nickname': user.nickname,
            'mileage': user.mileage  # 마일리지 정보 반환
        }), 200
    else:
        return jsonify({'message': '로그인 정보가 잘못되었습니다.'}), 401


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0')
