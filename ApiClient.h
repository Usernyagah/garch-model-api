#ifndef APICLIENT_H
#define APICLIENT_H

#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QJsonDocument>
#include <QJsonObject>
#include <QString>

class ApiClient : public QObject
{
    Q_OBJECT

public:
    explicit ApiClient(QObject *parent = nullptr);
    void setBaseUrl(const QString &url);
    
    void fitModel(const QString &ticker, bool useNewData, int nObservations, int p, int q);
    void predictVolatility(const QString &ticker, int nDays);
    void checkHealth();

signals:
    void fitResponseReceived(bool success, const QString &message, const QJsonObject &data);
    void predictResponseReceived(bool success, const QString &message, const QJsonObject &forecast);
    void healthResponseReceived(const QString &message);
    void errorOccurred(const QString &error);

private slots:
    void onFitFinished();
    void onPredictFinished();
    void onHealthFinished();

private:
    QNetworkAccessManager *m_manager;
    QString m_baseUrl;
    QNetworkReply *m_fitReply;
    QNetworkReply *m_predictReply;
    QNetworkReply *m_healthReply;
    
    void handleError(QNetworkReply::NetworkError error, const QString &context);
};

#endif // APICLIENT_H

