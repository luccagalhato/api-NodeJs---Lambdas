# Requisitos para rodar o projeto:

- Node.js, caso não tenha instalado use esse link: https://nodejs.org/en/download/package-manager/ ele tem instruções para instalar.

- Yarn, caso não tenha instalado use esse link: https://classic.yarnpkg.com/en/docs/install/#debian-stable ele tem instruções para instalar.

- Docker caso não tenha instalado use esse link: https://docs.docker.com/engine/install/ubuntu/ ele tem instruções para instalar.

- Docker compose caso não tenha instalado use esse link: https://docs.docker.com/compose/install/ ele tem instruções para instalar.

- Serverless framework caso não tenha instalado use esse link: https://www.serverless.com/framework/docs/providers/aws/guide/installation/ ele tem instruções para instalar.

- aws-cli caso não tenha instalado use esse link: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html ele tem instruções para instalar.

# Instruções para configurar o projeto:

- Clonar o projeto
- Acessar o diretório do projeto
- Executar o comando para instalar os modulos que o projeto precisa: **yarn install**

# Instruções para rodar o projeto em ambiente de desenvolvimento:

- Após configurar o projeto acessar o diretório raiz do projeto
- Executar o comando: **docker-compose up -d** para rodar os container com redis localmente.
- Executar o comando: **sls offline start --stage local** isso irá criar um servidor que irá rodar suas lambdas functions.

# Instruções para fazer o deploy da aplicação ambiente de dev:

- Após configurar o projeto acessar o diretório raiz do projeto
- Executar o comando: **sls deploy --stage dev** isso fazer o deploy para a AWS em ambiente de dev.

# Instruções para fazer o deploy da aplicação ambiente de staging:

- Após configurar o projeto acessar o diretório raiz do projeto
- Executar o comando: **sls deploy --stage staging** isso fazer o deploy para a AWS em ambiente de staging.

# Instruções para fazer o deploy da aplicação ambiente de production:

- Após configurar o projeto acessar o diretório raiz do projeto
- Executar o comando: **sls deploy --stage prod** isso fazer o deploy para a AWS em ambiente de produção.

# Observações sobre o deploy da aplicação:

- É necessário ter o aws-cli configurado com um **aws_access_key_id** e **aws_secret_access_key** de um usuário criado no IAM da Aws com as permissões necessárias para fazer o deploy. Isso necessário devido o serveless framework no momento que for fazer o deploy usa essa credencias para criar o que for preciso na Aws.
