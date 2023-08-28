# Build the Rust backend
FROM rust:latest AS backend-builder

WORKDIR /app/backend
COPY backend .
RUN cargo build --release

# Final image
FROM debian:bookworm-slim

RUN apt-get update -y && apt-get install -y ca-certificates fuse3 sqlite3 libssl-dev curl
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs

COPY litefs.yml litefs.yml

# Copy built backend
COPY --from=backend-builder /app/backend/target/release/backend /app/backend/backend
COPY --from=backend-builder /app/backend/migrations /app/backend/migrations

# Get refinery
COPY --from=ghcr.io/rust-db/refinery:latest /usr/local/bin/refinery /usr/local/bin/refinery

# Get litefs
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs

# Expose backend and frontend ports
EXPOSE 8000

RUN echo "[main]\ndb_type = \"Sqlite\"\n db_path= \"/litefs/main.db\"\ntrust_cert = false" > app/backend/refinery.toml

ARG JWT_SECRET
ARG SQLITE_PATH

# Run litefs
ENTRYPOINT litefs mount