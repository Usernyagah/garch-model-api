#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QWidget>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QGridLayout>
#include <QLabel>
#include <QLineEdit>
#include <QPushButton>
#include <QTextEdit>
#include <QSpinBox>
#include <QCheckBox>
#include <QGroupBox>
#include <QProgressBar>
#include <QStatusBar>
#include <QJsonObject>
#include <QJsonDocument>
#include "ApiClient.h"

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void onFitClicked();
    void onPredictClicked();
    void onHealthCheckClicked();
    void onFitResponse(bool success, const QString &message, const QJsonObject &data);
    void onPredictResponse(bool success, const QString &message, const QJsonObject &forecast);
    void onHealthResponse(const QString &message);
    void onError(const QString &error);

private:
    void setupUI();
    void setupStyles();
    void updateStatus(const QString &message, bool isError = false);
    void clearResults();
    void formatForecastResults(const QJsonObject &forecast);

    // UI Components
    QWidget *m_centralWidget;
    QVBoxLayout *m_mainLayout;
    
    // Fit Model Section
    QGroupBox *m_fitGroup;
    QGridLayout *m_fitLayout;
    QLineEdit *m_tickerInput;
    QCheckBox *m_useNewDataCheck;
    QSpinBox *m_nObservationsSpin;
    QSpinBox *m_pSpin;
    QSpinBox *m_qSpin;
    QPushButton *m_fitButton;
    
    // Predict Section
    QGroupBox *m_predictGroup;
    QGridLayout *m_predictLayout;
    QLineEdit *m_predictTickerInput;
    QSpinBox *m_nDaysSpin;
    QPushButton *m_predictButton;
    
    // Results Section
    QGroupBox *m_resultsGroup;
    QVBoxLayout *m_resultsLayout;
    QTextEdit *m_resultsDisplay;
    
    // Status and Actions
    QPushButton *m_healthButton;
    QProgressBar *m_progressBar;
    QStatusBar *m_statusBar;
    
    // API Client
    ApiClient *m_apiClient;
};

#endif // MAINWINDOW_H

