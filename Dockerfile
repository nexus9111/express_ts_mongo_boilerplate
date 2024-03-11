FROM node:20
WORKDIR /app/

# Copier d'abord seulement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY ./ ./

# Mise à jour des dépendances
RUN npm update

CMD ["npm", "run", "dev"]
