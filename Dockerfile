# Usa a imagem oficial do Node.js
FROM node:18-alpine

# Cria e define o diretório de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia todo o código para o container
COPY . .

# Gera os tipos do Prisma (seu schema.prisma deve estar em /app/prisma)
RUN npx prisma generate

# Compila o Next.js
RUN npm run build

# Expõe a porta 4000 do container
EXPOSE 4000

# Define o comando de inicialização
CMD ["npm", "run", "start"]
