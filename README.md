# Serverless Challenge

## Acesso as Rotas

Existe um documento chamado "my-serverless-challenge.postman_collection.json" que possui todas as rotas gravadas e que podem ser testadas no postman

GET /healthCheck - Verifica se a aplicação está up
POST /funcionarios - Cria novo funcionário
GET /funcionarios - Lista todos os funcionários da base
GET /fucionarios/:id - Busca funcionário pelo id
PUT /funcionarios/:id - Atualiza funcionário baseado no id
DELETE /funcionarios/:id - Deleta funcionario baseado no id

### Formato do body do request

Abaixo deixo um exemplo para o body da request necessário para o POST
{
"id":3454,
"nome":"Matheus",
"cargo":"Administrador",
"idade":30

}

O PUT não precisa de id na requisiçao pois ja existe como parametro na url

/funcionarios/3454

{
"id":3454,
"nome":"Matheus",
"cargo":"Administrador",
"idade":30

}

## Testes locais

Para realizar testes locais será necessário algumas etapas

### Etapas

npm i #para instalar as dependencias
npm i serverless -g #para instalar o serverless globalmente na maquina local

#Se windows recomendo utilizar git bash em vez de PowerShell

serverless login #é necessário estar logado no serverless
serverless config credentials --provider aws --key 1234 --secret 5678 #configurar credenciais AWS
sls dynamodb install #instalar dynamodb localmente
sls offline start #rodar app localmente
