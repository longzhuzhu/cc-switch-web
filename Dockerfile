FROM node:20-bookworm AS frontend-builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build:web


FROM rust:1.85-bookworm AS service-builder

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libwebkit2gtk-4.1-dev \
    libsoup-3.0-dev \
    && rm -rf /var/lib/apt/lists/*

COPY . .
COPY --from=frontend-builder /app/dist ./dist

RUN cargo build --release --manifest-path src-tauri/Cargo.toml --bin cc-switch-web


FROM debian:bookworm-slim

WORKDIR /app

ENV HOME=/data \
    CC_SWITCH_WEB_HOST=0.0.0.0 \
    CC_SWITCH_WEB_PORT=8788 \
    CC_SWITCH_WEB_DIST_DIR=/app/dist

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libgtk-3-0 \
    libayatana-appindicator3-1 \
    librsvg2-2 \
    libwebkit2gtk-4.1-0 \
    libsoup-3.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=service-builder /app/target/release/cc-switch-web /usr/local/bin/cc-switch-web
COPY --from=frontend-builder /app/dist ./dist

VOLUME ["/data"]

EXPOSE 8788

CMD ["cc-switch-web"]

