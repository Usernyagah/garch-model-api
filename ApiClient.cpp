#include "ApiClient.h"
#include <QJsonDocument>
#include <QJsonObject>
#include <QNetworkRequest>
#include <QUrl>
#include <QDebug>

ApiClient::ApiClient(QObject *parent)
    : QObject(parent)
    , m_manager(new QNetworkAccessManager(this))
    , m_baseUrl("http://localhost:8008")
    , m_fitReply(nullptr)
    , m_predictReply(nullptr)
    , m_healthReply(nullptr)
{
}

void ApiClient::setBaseUrl(const QString &url)
{
    m_baseUrl = url;
}

void ApiClient::fitModel(const QString &ticker, bool useNewData, int nObservations, int p, int q)
{
    if (m_fitReply) {
        m_fitReply->abort();
        m_fitReply->deleteLater();
    }

    QUrl url(m_baseUrl + "/fit");
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QJsonObject json;
    json["ticker"] = ticker;
    json["use_new_data"] = useNewData;
    json["n_observations"] = nObservations;
    json["p"] = p;
    json["q"] = q;

    QJsonDocument doc(json);
    QByteArray data = doc.toJson();

    m_fitReply = m_manager->post(request, data);
    connect(m_fitReply, &QNetworkReply::finished, this, &ApiClient::onFitFinished);
    connect(m_fitReply, QOverload<QNetworkReply::NetworkError>::of(&QNetworkReply::errorOccurred),
            [this](QNetworkReply::NetworkError error) {
        handleError(error, "Fit Model");
    });
}

void ApiClient::predictVolatility(const QString &ticker, int nDays)
{
    if (m_predictReply) {
        m_predictReply->abort();
        m_predictReply->deleteLater();
    }

    QUrl url(m_baseUrl + "/predict");
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QJsonObject json;
    json["ticker"] = ticker;
    json["n_days"] = nDays;

    QJsonDocument doc(json);
    QByteArray data = doc.toJson();

    m_predictReply = m_manager->post(request, data);
    connect(m_predictReply, &QNetworkReply::finished, this, &ApiClient::onPredictFinished);
    connect(m_predictReply, QOverload<QNetworkReply::NetworkError>::of(&QNetworkReply::errorOccurred),
            [this](QNetworkReply::NetworkError error) {
        handleError(error, "Predict");
    });
}

void ApiClient::checkHealth()
{
    if (m_healthReply) {
        m_healthReply->abort();
        m_healthReply->deleteLater();
    }

    QUrl url(m_baseUrl + "/hello");
    QNetworkRequest request(url);

    m_healthReply = m_manager->get(request);
    connect(m_healthReply, &QNetworkReply::finished, this, &ApiClient::onHealthFinished);
    connect(m_healthReply, QOverload<QNetworkReply::NetworkError>::of(&QNetworkReply::errorOccurred),
            [this](QNetworkReply::NetworkError error) {
        handleError(error, "Health Check");
    });
}

void ApiClient::onFitFinished()
{
    if (!m_fitReply) return;

    if (m_fitReply->error() == QNetworkReply::NoError) {
        QByteArray data = m_fitReply->readAll();
        QJsonDocument doc = QJsonDocument::fromJson(data);
        QJsonObject obj = doc.object();

        bool success = obj["success"].toBool();
        QString message = obj["message"].toString();
        
        emit fitResponseReceived(success, message, obj);
    } else {
        emit errorOccurred("Network error: " + m_fitReply->errorString());
    }

    m_fitReply->deleteLater();
    m_fitReply = nullptr;
}

void ApiClient::onPredictFinished()
{
    if (!m_predictReply) return;

    if (m_predictReply->error() == QNetworkReply::NoError) {
        QByteArray data = m_predictReply->readAll();
        QJsonDocument doc = QJsonDocument::fromJson(data);
        QJsonObject obj = doc.object();

        bool success = obj["success"].toBool();
        QString message = obj["message"].toString();
        QJsonObject forecast = obj["forecast"].toObject();
        
        emit predictResponseReceived(success, message, forecast);
    } else {
        emit errorOccurred("Network error: " + m_predictReply->errorString());
    }

    m_predictReply->deleteLater();
    m_predictReply = nullptr;
}

void ApiClient::onHealthFinished()
{
    if (!m_healthReply) return;

    if (m_healthReply->error() == QNetworkReply::NoError) {
        QByteArray data = m_healthReply->readAll();
        QJsonDocument doc = QJsonDocument::fromJson(data);
        QJsonObject obj = doc.object();
        
        QString message = obj["message"].toString();
        emit healthResponseReceived(message);
    } else {
        emit errorOccurred("Health check failed: " + m_healthReply->errorString());
    }

    m_healthReply->deleteLater();
    m_healthReply = nullptr;
}

void ApiClient::handleError(QNetworkReply::NetworkError error, const QString &context)
{
    Q_UNUSED(error);
    QString errorMsg = context + " request failed. Please ensure the API server is running.";
    emit errorOccurred(errorMsg);
}

