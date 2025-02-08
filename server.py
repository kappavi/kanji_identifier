from flask import Flask, jsonify, request
import testing as backend

app = Flask(__name__)

@app.route("/kanji-info", methods=["GET"])
def get_kanji_info():
    text = request.args.get("text")
    if not text:
        return jsonify({"error": "no text was provided"}), 400
    
    # kanji processing
    kanji_list = backend.findKanjiFromString(text)
    data = backend.getKanjiInfo(kanji_list)
    return jsonify(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)