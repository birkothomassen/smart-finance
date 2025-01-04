from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import yfinance as yf
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Tillat CORS for alle opprinnelser

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
    data["Streak"] = np.where(data["Close"] > data["Close"].shift(1), 1, -1)
    data["Streak"] = data["Streak"].groupby((data["Streak"] != data["Streak"].shift()).cumsum()).cumsum()
    data["Tomorrow"] = data["Close"].shift(-1)
    data["Target"] = (data["Tomorrow"] > data["Close"]).astype(int)
    return data.dropna()

# API-endepunkt: Prediksjon for neste dag
@app.route('/predict', methods=['GET'])
def predict():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400

    try:
        # Hent aksjehistorikk og lag prediktorer
        data = fetch_stock_data(ticker)
        data = add_predictors(data)

        # Trenings- og testdata
        predictors = ["Close", "Volume", "Open", "High", "Low", "Price_Change_1d", "Price_Change_7d", "Streak"]
        train = data.iloc[:-1]  # Alt unntatt siste dag
        test = data.iloc[-1:]  # Kun siste dag for prediksjon

        # Tren modellen
        model = RandomForestClassifier(n_estimators=100, min_samples_split=100, random_state=1)
        model.fit(train[predictors], train["Target"])

        # Prediker for neste dag
        next_day_prediction = model.predict(test[predictors])[0]
        next_day_proba = model.predict_proba(test[predictors])[0]

        # Lag anbefaling
        recommendation = "Kjøp" if next_day_prediction == 1 else "Ikke kjøp"

        return jsonify({
            "ticker": ticker,
            "next_day_prediction": int(next_day_prediction),
            "next_day_probability_up": next_day_proba[1],
            "recommendation": recommendation
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
