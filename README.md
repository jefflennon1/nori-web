# Nori Frontend

Front-end único em React que consome os dois backends do **Nori Portfolio**
(`nori-sales` e `nori-stock`), com telas adaptadas por perfil de usuário
(BUYER, ADMIN do sales, OPERATOR/ADMIN do stock).

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- TanStack React Query (cache/estado de servidor) + Axios
- Zustand (auth + carrinho, com persistência em localStorage)
- React Router v7
- lucide-react (ícones)

## Como rodar

```bash
npm install
cp .env.example .env   # ajuste as URLs se necessário
npm run dev
```

Acesse `http://localhost:5173`.

## ⚠️ Pré-requisito nos backends: configurar CORS

Hoje nenhum dos dois projetos (`SecurityConfigurations` no nori-sales,
`SecurityConfig` no nori-stock) tem configuração de CORS. Sem isso, o browser
vai bloquear todas as chamadas do front (`localhost:5173`) para as APIs
(`localhost:8081` / `8082`) com erro de CORS no console.

Adicione um bean `CorsConfigurationSource` e registre no `.cors()` da
`SecurityFilterChain` de cada projeto. Exemplo:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

E no `SecurityFilterChain`, antes do `.authorizeHttpRequests`:

```java
.cors(cors -> cors.configurationSource(corsConfigurationSource()))
```

## Como o app decide qual backend chamar

- Login tem duas abas: **"Vendas / Loja"** (chama `/auth/login` do
  `nori-sales`) e **"Estoque"** (chama `/auth/login` do `nori-stock`).
- O JWT retornado é decodificado no front (`jwt-decode`) para extrair `role`
  e definir as rotas/menu visíveis.
- Cada workspace usa seu próprio Axios client (`src/api/salesClient.ts` e
  `src/api/stockClient.ts`), com seu próprio token — você pode, inclusive,
  estar logado nos dois ao mesmo tempo (tokens ficam em chaves separadas
  no localStorage).

## Endpoints que ainda não existem no nori-stock (fallback automático)

O `nori-stock` hoje só tem `AuthController` implementado. Os módulos de
Categoria, Setor, Produto e Movimentação de estoque no front (`src/api/stockApi.ts`)
tentam chamar o endpoint real e, se a chamada falhar (404, erro de rede etc.),
caem automaticamente para dados mock (`src/api/stockMockData.ts`) — assim a
tela funciona para demonstração mesmo antes de você terminar os controllers.

**Quando você implementar os controllers reais, não precisa mudar nada no
front** — assim que o endpoint responder, o fallback simplesmente para de
ser usado. Convenção de rotas REST assumida (ajuste em `stockApi.ts` se
você nomear diferente):

| Recurso | Métodos esperados |
|---|---|
| `/categories` | `GET`, `POST` |
| `/sectors` | `GET`, `POST` |
| `/products` | `GET`, `POST`, `PUT /products/{id}` |
| `/stock-movements` | `GET`, `POST` |

## ⚠️ Bug encontrado entre os dois backends (Kafka)

O `nori-stock` publica o evento de atualização de estoque no tópico
**`"inventory-updated"`** (`StockUpdatedProducerService`), mas o consumer
stub no `nori-sales` (`StockListenerService`, hoje comentado) está escutando
**`"stock-updated"`**. Os nomes precisam ser iguais nos dois lados antes de
ativar o consumer.

## Limitação conhecida: `GET /orders` no nori-sales

O endpoint atual de pedidos extrai o usuário do `SecurityContextHolder` e
retorna só os pedidos do usuário logado — não existe ainda um endpoint
"admin: listar todos os pedidos". A tela `sales-admin/orders` está pronta
no front, mas vai mostrar a mesma lista do buyer até esse endpoint existir.

## Estrutura

```
src/
  api/        # clients axios + funções de chamada por domínio
  components/ # UI (Button, Card, Modal...) + layout (AppShell, navConfig) + auth (ProtectedRoute)
  hooks/      # React Query hooks (useSales.ts, useStock.ts)
  pages/
    auth/     # Login
    buyer/    # Catálogo, Carrinho, Pedidos, Detalhe do pedido (Pix)
    sales/    # Dashboard, Produtos, Categorias, Pedidos (admin da loja)
    stock/    # Dashboard, Produtos, Categorias, Setores, Movimentações
  store/      # Zustand: authStore (JWT dos 2 serviços), cartStore
  types/      # Tipos espelhando os DTOs reais dos backends
```

## Usuários de teste

- **nori-sales**: usuário criado via `/auth/register`, ou direto no banco
  (lembre que o seed V7 tinha placeholders de hash — gere um BCrypt real).
- **nori-stock**: `nori_admin` / `admin1234` ou `operator_demo` / `demo1234`
  (seed `V6__insert_seed_data.sql`). **Não** use o usuário `system` — ele é
  bloqueado para login real.
