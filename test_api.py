import requests

# Test training endpoint
train_url = "http://localhost:8008/fit"
train_params = {
    "ticker": "SHOPERSTOP.BSE",
    "use_new_data": False,
    "n_observations": 2000,
    "p": 1,
    "q": 1
}
train_response = requests.post(train_url, json=train_params)
print("Training Response:", train_response.json())

# Test prediction endpoint
predict_url = "http://localhost:8008/predict"
predict_params = {"ticker": "SHOPERSTOP.BSE", "n_days": 5}
predict_response = requests.post(predict_url, json=predict_params)
print("\nPrediction Response:", predict_response.json())