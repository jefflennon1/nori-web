# Nori Web

Frontend application for the **Nori** ecosystem, a sales and inventory management platform built to demonstrate a full-stack architecture based on microservices.

The application provides dedicated interfaces for buyers, sales administrators, and stock operators, independently consuming the `nori-sales` and `nori-stock` APIs.

## Overview

Nori Web centralizes the user experience across the platform's two main domains:

* **Sales:** product catalog, shopping cart, orders, Pix payments, and sales administration.
* **Inventory:** products, categories, storage sectors, stock movements, and inventory monitoring.

Navigation, permissions, and available features are adapted according to the authenticated user's role:

| Service      | Roles               |
| ------------ | ------------------- |
| `nori-sales` | `BUYER`, `ADMIN`    |
| `nori-stock` | `OPERATOR`, `ADMIN` |

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS v4
* React Router v7
* TanStack React Query
* Axios
* Zustand
* Lucide React
* jwt-decode

## Architecture

The frontend communicates with two independent services:

```text
                         ┌─────────────────┐
                         │    Nori Web     │
                         │ React + Vite    │
                         └────────┬────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   │                             │
                   ▼                             ▼
          ┌─────────────────┐           ┌─────────────────┐
          │   nori-sales    │           │   nori-stock    │
          │ Sales API       │           │ Stock API       │
          └─────────────────┘           └─────────────────┘
```

Each service has:

* independent authentication;
* its own JWT;
* a dedicated Axios client;
* separate authentication state;
* role-specific access rules.

This separation allows users to maintain active sessions in both application contexts at the same time.

## Features

### Buyer Area

* user authentication and registration;
* product catalog;
* product pagination;
* shopping cart;
* order creation;
* order status tracking;
* Pix payment generation and display;
* purchase history.

### Sales Administration

* sales dashboard;
* product management;
* category management;
* order monitoring;
* operational store information.

### Inventory Management

* inventory dashboard;
* product management;
* category management;
* storage sector management;
* stock inbound and outbound operations;
* stock adjustments;
* stock movement history.

## State Management

The application separates server state from local client state.

### TanStack React Query

Used for:

* API consumption and caching;
* loading and error handling;
* pagination;
* query invalidation;
* synchronization after mutations;
* remote data updates.

### Zustand

Used for:

* authentication sessions;
* JWT storage;
* authenticated role identification;
* shopping cart state;
* local persistence.

## Authentication

The login page allows users to select the application context:

* **Sales / Store:** authentication through `nori-sales`;
* **Inventory:** authentication through `nori-stock`.
