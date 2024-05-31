from flask import Flask, render_template, redirect, url_for

import gpiod
from gpiod.line import Direction, Value

app = Flask(__name__)

# RELAY 설정 시작
CHIP = "/dev/gpiochip4"
LINE = 4

request = gpiod.request_lines(
    CHIP,
    consumer="RELAY",
    config={
        LINE: gpiod.LineSettings(
             direction=Direction.OUTPUT, output_value=Value.ACTIVE
        )
    }
)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/relay/<state>', methods=['POST'])
def realy_control(state):
    if state == 'on':
        request.set_value(LINE, Value.ACTIVE)
    elif state == 'off':
        request.set_value(LINE, Value.INACTIVE)
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
