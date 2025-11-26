#include "MainWindow.h"
#include <QApplication>
#include <QMessageBox>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QHeaderView>
#include <QTableWidget>
#include <QTableWidgetItem>
#include <QSplitter>
#include <QFrame>
#include <QTimer>
#include <algorithm>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , m_apiClient(new ApiClient(this))
{
    setupUI();
    setupStyles();
    
    // Connect API signals
    connect(m_apiClient, &ApiClient::fitResponseReceived, this, &MainWindow::onFitResponse);
    connect(m_apiClient, &ApiClient::predictResponseReceived, this, &MainWindow::onPredictResponse);
    connect(m_apiClient, &ApiClient::healthResponseReceived, this, &MainWindow::onHealthResponse);
    connect(m_apiClient, &ApiClient::errorOccurred, this, &MainWindow::onError);
    
    // Connect UI signals
    connect(m_fitButton, &QPushButton::clicked, this, &MainWindow::onFitClicked);
    connect(m_predictButton, &QPushButton::clicked, this, &MainWindow::onPredictClicked);
    connect(m_healthButton, &QPushButton::clicked, this, &MainWindow::onHealthCheckClicked);
    
    setWindowTitle("GARCH Model API - Volatility Forecasting");
    resize(900, 700);
    
    // Initial health check
    m_apiClient->checkHealth();
}

MainWindow::~MainWindow()
{
}

void MainWindow::setupUI()
{
    m_centralWidget = new QWidget(this);
    setCentralWidget(m_centralWidget);
    m_mainLayout = new QVBoxLayout(m_centralWidget);
    m_mainLayout->setSpacing(15);
    m_mainLayout->setContentsMargins(20, 20, 20, 20);

    // Header
    QLabel *headerLabel = new QLabel("GARCH Model API Client", this);
    headerLabel->setStyleSheet("font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 10px;");
    m_mainLayout->addWidget(headerLabel);

    // Health Check Button
    m_healthButton = new QPushButton("Check API Health", this);
    m_healthButton->setStyleSheet(
        "QPushButton { background-color: #3498db; color: white; padding: 8px 16px; border-radius: 4px; }"
        "QPushButton:hover { background-color: #2980b9; }"
    );
    m_mainLayout->addWidget(m_healthButton);

    // Fit Model Section
    m_fitGroup = new QGroupBox("Train GARCH Model", this);
    m_fitLayout = new QGridLayout(m_fitGroup);
    m_fitLayout->setSpacing(10);
    m_fitLayout->setContentsMargins(15, 15, 15, 15);

    m_fitLayout->addWidget(new QLabel("Ticker:"), 0, 0);
    m_tickerInput = new QLineEdit("SHOPERSTOP.BSE", this);
    m_tickerInput->setPlaceholderText("e.g., SHOPERSTOP.BSE");
    m_fitLayout->addWidget(m_tickerInput, 0, 1);

    m_useNewDataCheck = new QCheckBox("Use New Data", this);
    m_useNewDataCheck->setChecked(false);
    m_fitLayout->addWidget(m_useNewDataCheck, 0, 2);

    m_fitLayout->addWidget(new QLabel("Observations:"), 1, 0);
    m_nObservationsSpin = new QSpinBox(this);
    m_nObservationsSpin->setRange(100, 10000);
    m_nObservationsSpin->setValue(2000);
    m_fitLayout->addWidget(m_nObservationsSpin, 1, 1);

    m_fitLayout->addWidget(new QLabel("P (GARCH):"), 2, 0);
    m_pSpin = new QSpinBox(this);
    m_pSpin->setRange(1, 5);
    m_pSpin->setValue(1);
    m_fitLayout->addWidget(m_pSpin, 2, 1);

    m_fitLayout->addWidget(new QLabel("Q (ARCH):"), 3, 0);
    m_qSpin = new QSpinBox(this);
    m_qSpin->setRange(1, 5);
    m_qSpin->setValue(1);
    m_fitLayout->addWidget(m_qSpin, 3, 1);

    m_fitButton = new QPushButton("Train Model", this);
    m_fitButton->setStyleSheet(
        "QPushButton { background-color: #27ae60; color: white; padding: 10px 20px; border-radius: 4px; font-weight: bold; }"
        "QPushButton:hover { background-color: #229954; }"
        "QPushButton:pressed { background-color: #1e8449; }"
    );
    m_fitLayout->addWidget(m_fitButton, 4, 0, 1, 3);

    m_mainLayout->addWidget(m_fitGroup);

    // Predict Section
    m_predictGroup = new QGroupBox("Predict Volatility", this);
    m_predictLayout = new QGridLayout(m_predictGroup);
    m_predictLayout->setSpacing(10);
    m_predictLayout->setContentsMargins(15, 15, 15, 15);

    m_predictLayout->addWidget(new QLabel("Ticker:"), 0, 0);
    m_predictTickerInput = new QLineEdit("SHOPERSTOP.BSE", this);
    m_predictTickerInput->setPlaceholderText("e.g., SHOPERSTOP.BSE");
    m_predictLayout->addWidget(m_predictTickerInput, 0, 1);

    m_predictLayout->addWidget(new QLabel("Days Ahead:"), 1, 0);
    m_nDaysSpin = new QSpinBox(this);
    m_nDaysSpin->setRange(1, 30);
    m_nDaysSpin->setValue(5);
    m_predictLayout->addWidget(m_nDaysSpin, 1, 1);

    m_predictButton = new QPushButton("Get Forecast", this);
    m_predictButton->setStyleSheet(
        "QPushButton { background-color: #9b59b6; color: white; padding: 10px 20px; border-radius: 4px; font-weight: bold; }"
        "QPushButton:hover { background-color: #8e44ad; }"
        "QPushButton:pressed { background-color: #7d3c98; }"
    );
    m_predictLayout->addWidget(m_predictButton, 2, 0, 1, 2);

    m_mainLayout->addWidget(m_predictGroup);

    // Results Section
    m_resultsGroup = new QGroupBox("Results", this);
    m_resultsLayout = new QVBoxLayout(m_resultsGroup);
    m_resultsLayout->setContentsMargins(15, 15, 15, 15);

    m_resultsDisplay = new QTextEdit(this);
    m_resultsDisplay->setReadOnly(true);
    m_resultsDisplay->setPlaceholderText("Results will appear here...");
    m_resultsDisplay->setStyleSheet(
        "QTextEdit { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 10px; font-family: 'Consolas', 'Courier New', monospace; }"
    );
    m_resultsLayout->addWidget(m_resultsDisplay);

    m_mainLayout->addWidget(m_resultsGroup, 1); // Stretch factor

    // Progress Bar
    m_progressBar = new QProgressBar(this);
    m_progressBar->setRange(0, 0);
    m_progressBar->setVisible(false);
    m_mainLayout->addWidget(m_progressBar);

    // Status Bar
    m_statusBar = statusBar();
    m_statusBar->showMessage("Ready");
    m_statusBar->setStyleSheet("QStatusBar { background-color: #ecf0f1; color: #2c3e50; }");
}

void MainWindow::setupStyles()
{
    setStyleSheet(
        "QMainWindow { background-color: #ffffff; }"
        "QGroupBox { font-weight: bold; border: 2px solid #bdc3c7; border-radius: 5px; margin-top: 10px; padding-top: 10px; }"
        "QGroupBox::title { subcontrol-origin: margin; left: 10px; padding: 0 5px; }"
        "QLineEdit, QSpinBox { padding: 6px; border: 1px solid #bdc3c7; border-radius: 3px; }"
        "QLineEdit:focus, QSpinBox:focus { border: 2px solid #3498db; }"
        "QCheckBox { spacing: 5px; }"
    );
}

void MainWindow::onFitClicked()
{
    QString ticker = m_tickerInput->text().trimmed();
    if (ticker.isEmpty()) {
        QMessageBox::warning(this, "Input Error", "Please enter a ticker symbol.");
        return;
    }

    m_progressBar->setVisible(true);
    m_fitButton->setEnabled(false);
    updateStatus("Training model...");
    clearResults();

    m_apiClient->fitModel(
        ticker,
        m_useNewDataCheck->isChecked(),
        m_nObservationsSpin->value(),
        m_pSpin->value(),
        m_qSpin->value()
    );
}

void MainWindow::onPredictClicked()
{
    QString ticker = m_predictTickerInput->text().trimmed();
    if (ticker.isEmpty()) {
        QMessageBox::warning(this, "Input Error", "Please enter a ticker symbol.");
        return;
    }

    m_progressBar->setVisible(true);
    m_predictButton->setEnabled(false);
    updateStatus("Fetching prediction...");
    clearResults();

    m_apiClient->predictVolatility(ticker, m_nDaysSpin->value());
}

void MainWindow::onHealthCheckClicked()
{
    m_progressBar->setVisible(true);
    m_healthButton->setEnabled(false);
    updateStatus("Checking API health...");
    m_apiClient->checkHealth();
}

void MainWindow::onFitResponse(bool success, const QString &message, const QJsonObject &data)
{
    m_progressBar->setVisible(false);
    m_fitButton->setEnabled(true);
    m_healthButton->setEnabled(true);

    QString result = QString("=== Model Training Result ===\n\n");
    result += QString("Status: %1\n").arg(success ? "✓ Success" : "✗ Failed");
    result += QString("Message: %1\n\n").arg(message);
    
    if (success) {
        result += QString("Ticker: %1\n").arg(data["ticker"].toString());
        result += QString("Observations: %1\n").arg(data["n_observations"].toInt());
        result += QString("GARCH(p=%1, q=%2)\n").arg(data["p"].toInt()).arg(data["q"].toInt());
        result += QString("Use New Data: %1\n").arg(data["use_new_data"].toBool() ? "Yes" : "No");
    }

    m_resultsDisplay->setPlainText(result);
    updateStatus(success ? "Model trained successfully!" : "Training failed: " + message, !success);
}

void MainWindow::onPredictResponse(bool success, const QString &message, const QJsonObject &forecast)
{
    m_progressBar->setVisible(false);
    m_predictButton->setEnabled(true);
    m_healthButton->setEnabled(true);

    QString result = QString("=== Volatility Forecast ===\n\n");
    result += QString("Status: %1\n").arg(success ? "✓ Success" : "✗ Failed");
    result += QString("Message: %1\n\n").arg(message);

    if (success && !forecast.isEmpty()) {
        result += "Day-by-Day Forecast:\n";
        result += "─────────────────────\n";
        
        QStringList keys = forecast.keys();
        std::sort(keys.begin(), keys.end(), [](const QString &a, const QString &b) {
            return a.toInt() < b.toInt();
        });

        for (const QString &key : keys) {
            double value = forecast[key].toDouble();
            result += QString("Day %1: %2%3\n")
                .arg(key)
                .arg(value * 100, 0, 'f', 4)
                .arg("%");
        }
        
        result += "\n─────────────────────\n";
        result += QString("Note: Values represent predicted volatility (standard deviation)\n");
    }

    m_resultsDisplay->setPlainText(result);
    updateStatus(success ? "Forecast received successfully!" : "Prediction failed: " + message, !success);
}

void MainWindow::onHealthResponse(const QString &message)
{
    m_progressBar->setVisible(false);
    m_healthButton->setEnabled(true);
    
    QString result = QString("=== API Health Check ===\n\n");
    result += QString("Status: ✓ Connected\n");
    result += QString("Message: %1\n").arg(message);
    
    m_resultsDisplay->setPlainText(result);
    updateStatus("API is healthy and connected!");
}

void MainWindow::onError(const QString &error)
{
    m_progressBar->setVisible(false);
    m_fitButton->setEnabled(true);
    m_predictButton->setEnabled(true);
    m_healthButton->setEnabled(true);

    QString result = QString("=== Error ===\n\n");
    result += QString("✗ %1\n").arg(error);
    
    m_resultsDisplay->setPlainText(result);
    updateStatus("Error: " + error, true);
}

void MainWindow::updateStatus(const QString &message, bool isError)
{
    m_statusBar->showMessage(message);
    if (isError) {
        m_statusBar->setStyleSheet("QStatusBar { background-color: #e74c3c; color: white; }");
    } else {
        m_statusBar->setStyleSheet("QStatusBar { background-color: #27ae60; color: white; }");
    }
    
    // Reset to default after 3 seconds
    QTimer::singleShot(3000, [this]() {
        m_statusBar->setStyleSheet("QStatusBar { background-color: #ecf0f1; color: #2c3e50; }");
    });
}

void MainWindow::clearResults()
{
    m_resultsDisplay->clear();
}

#include "MainWindow.moc"

