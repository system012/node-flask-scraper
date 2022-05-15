from flask.json import jsonify
from app.browser import anticaptcha_browser
from app.driver import create_driver
from app import app

@app.route('/', methods=["GET"])
def index():
    return 'hello'

@app.route("/amz/<code>", methods=["GET"])
def get_code(code):
    if code:
        url = f'https://amazon.it/dp/{code}'
        print(f"Checking product {code}")
        driver = create_driver()
        response = anticaptcha_browser(url, driver)
        return jsonify(message=response)
        
    return "Error"