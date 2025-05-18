import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import Ridge
from sklearn.preprocessing import OneHotEncoder
from datetime import timedelta

# Load and preprocess data
with open("data.json", "r") as file:
    data = json.load(file)

df = pd.DataFrame(data)
df['day'] = pd.to_datetime(df['day'])

# Aggregate by day
daily = df.groupby('day')['count'].sum().reset_index()

# Feature engineering
daily['day_num'] = (daily['day'] - daily['day'].min()).dt.days
daily['day_of_week'] = daily['day'].dt.weekday
daily['month'] = daily['day'].dt.month

# One-hot encode day_of_week and month
encoder = OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore')
encoded_features = encoder.fit_transform(daily[['day_of_week', 'month']])
X = np.concatenate([daily[['day_num']].values, encoded_features], axis=1)
y = daily['count'].values

# Train Ridge regression model
model = Ridge(alpha=1.0)
model.fit(X, y)

# Forecast next 30 days
future_dates = [daily['day'].max() + timedelta(days=i) for i in range(1, 31)]
future_day_num = np.array([(d - daily['day'].min()).days for d in future_dates])
future_day_of_week = np.array([d.weekday() for d in future_dates])
future_month = np.array([d.month for d in future_dates])
future_df = pd.DataFrame({'day_num': future_day_num, 'day_of_week': future_day_of_week, 'month': future_month})

# One-hot encode future features
future_encoded = encoder.transform(future_df[['day_of_week', 'month']])
X_future = np.concatenate([future_df[['day_num']].values, future_encoded], axis=1)

# Predict
future_predictions = model.predict(X_future)

# Combine historical and future data for CSV
actual_df = daily[['day', 'count']].copy()
actual_df.columns = ['date', 'reservations']
actual_df['type'] = 'actual'

future_results = pd.DataFrame({
    'date': future_dates,
    'reservations': future_predictions,
    'type': 'predicted'
})

combined_df = pd.concat([actual_df, future_results], ignore_index=True)
combined_df.to_csv("reservation_predictions_ridge.csv", index=False)

# Plot results
plt.figure(figsize=(12, 6))
plt.plot(actual_df['date'], actual_df['reservations'], label='Actual Reservations')
plt.plot(future_results['date'], future_results['reservations'], label='Ridge Predictions', linestyle='--', color='orange')
plt.title("Ridge Regression Forecast of Reservations")
plt.xlabel("Date")
plt.ylabel("Reservation Count")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
