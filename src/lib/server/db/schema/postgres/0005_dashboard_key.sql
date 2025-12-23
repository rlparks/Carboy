CREATE TABLE IF NOT EXISTS dashboard_key (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    name TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);
