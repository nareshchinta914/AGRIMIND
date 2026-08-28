import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder

def load_and_preprocess_data(csv_path: str):
    """
    Load crop dataset, encode categorical variables and normalize numerical features.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at path: {csv_path}")

    df = pd.read_csv(csv_path)

    # Feature Columns: N, P, K, temperature, humidity, ph, rainfall
    feature_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[feature_cols].copy()
    y = df['label'].copy()

    # Fit and transform label encoder
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    # Standard scale numerical features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    return X_train, X_test, y_train, y_test, scaler, label_encoder, feature_cols
