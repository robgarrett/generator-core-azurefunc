FROM mcr.microsoft.com/azure-functions/dotnet:latest

RUN mkdir -p /home/site/wwwroot
VOLUME /home/site/wwwroot
WORKDIR /home/site/wwwroot

ENV AzureWebJobsScriptRoot=/home/site/wwwroot
