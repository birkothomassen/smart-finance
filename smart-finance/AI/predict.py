import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score
import matplotlib.pyplot as plt


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
    data["Price_Change_60d"] = data["Close"].pct_change(periods=60)
    data["Price_Change_120d"] = data["Close"].pct_change(periods=120)
    data["Price_Change_1y"] = data["Close"].pct_change(periods=252)
    data["Streak"] = np.where(data["Close"] > data["Close"].shift(1), 1, -1)
    data["Streak"] = data["Streak"].groupby((data["Streak"] != data["Streak"].shift()).cumsum()).cumsum()
    return data


# Funksjon: Lag målvariabel
def add_target(data):
    data["Tomorrow"] = data["Close"].shift(-1)
    data["Target"] = (data["Tomorrow"] > data["Close"]).astype(int)
    return data


# Funksjon: Forbered data
def prepare_data(data):
    return data.dropna()


# Funksjon: Tren og evaluer modellen
def train_and_evaluate_model(train, test, predictors):
    model = RandomForestClassifier(n_estimators=100, min_samples_split=100, random_state=1)
    model.fit(train[predictors], train["Target"])
    predictions = model.predict(test[predictors])
    accuracy = accuracy_score(test["Target"], predictions)
    precision = precision_score(test["Target"], predictions)
    return model, predictions, accuracy, precision


# Hovedlogikk: Prosesser flere aksjer
def process_multiple_stocks(tickers):

    #Prosesserer flere aksjer og trener modeller for hver enkelt.
    
    results = {}
    predictors = ["Close", "Volume", "Open", "High", "Low", 
                  "Price_Change_1d", "Price_Change_7d", 
                  "Price_Change_30d", "Price_Change_60d", 
                  "Price_Change_120d", "Price_Change_1y", "Streak"]

    for ticker in tickers:
        print(f"Prosesserer {ticker}...")
        data = fetch_stock_data(ticker)
        data = add_predictors(data)
        data = add_target(data)
        data = prepare_data(data)

        train = data.iloc[:-100]
        test = data.iloc[-100:]

        model, predictions, accuracy, precision = train_and_evaluate_model(train, test, predictors)

        results[ticker] = {
            "model": model,
            "accuracy": accuracy,
            "precision": precision,
            "predictions": predictions,
            "test": test
        }

        print(f"{ticker} - Nøyaktighet: {accuracy:.2f}, Presisjon: {precision:.2f}")
    return results


# Kjøreeksempel: Flere aksjer
tickers = ["AAPL", "GOOG", "MSFT"]  # Legg til flere tickers her
results = process_multiple_stocks(tickers)
