# Basis-Image
FROM node:20-alpine

# Arbeitsverzeichnis im Container
WORKDIR /src

# Abhängigkeiten kopieren (Package-Dateien zuerst für effizientes Caching)
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install --production

# Quellcode kopieren
COPY . .

# Entrypoint-Skript ausführbar machen
RUN chmod +x entrypoint.sh

# Port 4000 für Docker freigeben
EXPOSE 4000

# Startbefehl via Entrypoint
ENTRYPOINT ["sh", "/src/entrypoint.sh"]