FILE PATH: server.py
CONTENT: from flask import Flask, request, Response

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def proxy():
    if request.method == 'GET':
        return Response(status=405)

    url = request.form['url']
    response = requests.get(url)
    return Response(response.content, response.status_code)

if __name__ == '__main__':
    app.run()