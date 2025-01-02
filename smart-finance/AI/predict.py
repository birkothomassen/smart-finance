import yfinance as yf
import matplotlib.pyplot as plt

# Velg ticker-symbolet for aksjen
ticker_symbol = "AAPL"  # Eksempel: Apple Inc.

# Hent data for aksjen
stock = yf.Ticker(ticker_symbol)
appleHist = stock.history(period="max")  # Hent alle tilgjengelige data
del appleHist["Dividends"]
del appleHist["Stock Splits"]

appleHist["Tomorrow"] = appleHist["Close"].shift(-1)
appleHist["Target"] = (appleHist["Tomorrow"]>appleHist["Close"]).astype(int)

appleHist = appleHist.loc["1990-01-01":].copy()


#print(appleHist)

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score
import pandas as pd


# Initialiser modellen
model = RandomForestClassifier(n_estimators=100, min_samples_split=100, random_state=1)

# Forbered trenings- og testdata
train = appleHist.iloc[:-100]  # Bruk alle unntatt de siste 100 datapunktene til trening
test = appleHist.iloc[-100:]   # Bruk de siste 100 datapunktene til testing

# Prediktorer (input-funksjoner)
predictors = ["Close", "Volume", "Open", "High", "Low"]

# Tren modellen
model.fit(train[predictors], train["Target"])

# Lag prediksjoner
predictions = model.predict(test[predictors])
predictions = pd.Series(predictions, index=test.index)


# Beregn nøyaktigheten
accuracy = precision_score(test["Target"], predictions)
print(f"Modellens nøyaktighet: {accuracy:.2f}")

# Visualiser de faktiske og predikerte verdiene
combined = pd.concat([test["Target"], predictions], axis=1)
combined.plot()



