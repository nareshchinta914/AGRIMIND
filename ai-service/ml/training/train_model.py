import os
import sys

# Ensure UTF-8 output encoding for Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from preprocess import load_and_preprocess_data

def train_crop_recommendation_model():
    print("[AGRIMIND ML] Training Crop Recommendation Machine Learning Model...")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, "../data/sample_dataset.csv")
    models_dir = os.path.join(base_dir, "../saved_models")

    os.makedirs(models_dir, exist_ok=True)

    # 1. Preprocess Dataset
    X_train, X_test, y_train, y_test, scaler, label_encoder, feature_cols = load_and_preprocess_data(dataset_path)

    # 2. Train Random Forest Classifier
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X_train, y_train)

    # 3. Evaluate Model
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"[SUCCESS] Model Trained! Test Accuracy: {accuracy * 100:.2f}%\n")
    print("Classification Report:\n", classification_report(y_test, y_pred, target_names=label_encoder.classes_))

    # 4. Save Model Artifacts
    model_file = os.path.join(models_dir, "crop_recommendation_model.joblib")
    scaler_file = os.path.join(models_dir, "scaler.joblib")
    encoder_file = os.path.join(models_dir, "label_encoder.joblib")

    joblib.dump(clf, model_file)
    joblib.dump(scaler, scaler_file)
    joblib.dump(label_encoder, encoder_file)

    print(f"[SAVED] Model artifacts written cleanly to: {models_dir}")

if __name__ == "__main__":
    train_crop_recommendation_model()
