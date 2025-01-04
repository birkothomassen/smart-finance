from flask import Flask, request, jsonify
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score
import yfinance as yf
import pandas as pd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Funksjon: Hent aksjehistorikk
def fetch_stock_data(ticker_symbol):
    stock = yf.Ticker(ticker_symbol)
    data = stock.history(period="max")
    del data["Dividends"]
    del data["Stock Splits"]
    return data

# Funksjon: Beregn prediktorer
def add_predictors(data):
    data["Price_Change_1d"] = data["Close"].pct_change(periods=1)
    data["Price_Change_7d"] = data["Close"].pct_change(periods=7)
    data["Price_Change_30d"] = data["Close"].pct_change(periods=30)
    data["Streak"] = np.where(data["Close"] > data["Close"].shift(1), 1, -1)
    data["Streak"] = data["Streak"].groupby((data["Streak"] != data["Streak"].shift()).cumsum()).cumsum()
    data["Tomorrow"] = data["Close"].shift(-1)
    data["Target"] = (data["Tomorrow"] > data["Close"]).astype(int)
    return data.dropna()

# Funksjon: Tren modellen
def train_model(data):
    predictors = ["Close", "Volume", "Open", "High", "Low", "Price_Change_1d", "Price_Change_7d", "Price_Change_30d", "Streak"]
    train = data.iloc[:-100]
    test = data.iloc[-100:]
    model = RandomForestClassifier(n_estimators=100, min_samples_split=100, random_state=1)
    model.fit(train[predictors], train["Target"])
    predictions = model.predict(test[predictors])
    accuracy = accuracy_score(test["Target"], predictions)
    precision = precision_score(test["Target"], predictions)
    return model, accuracy, precision


@app.route('/predict', methods=['GET'])
def predict():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400
    try:
        data = fetch_stock_data(ticker)
        data = add_predictors(data)
        model, accuracy, precision = train_model(data)
        return jsonify({
            "ticker": ticker,
            "accuracy": accuracy,
            "precision": precision
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
