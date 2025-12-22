CREATE TABLE IF NOT EXISTS organization (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    role TEXT,
    archived BOOLEAN NOT NULL,
    password_hash TEXT,
    password_enabled BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ,
    CONSTRAINT email_check CHECK (email <> '')
);

CREATE TABLE IF NOT EXISTS account_organization (
    account_id TEXT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ,
    PRIMARY KEY (account_id, organization_id)
);

CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    oidc_id_token TEXT,
    impersonated_by TEXT REFERENCES account(id) ON DELETE CASCADE,
    selected_organization_id TEXT REFERENCES organization(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS department (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    position INTEGER NOT NULL, -- position in lists
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ,
    UNIQUE (name, organization_id),
    UNIQUE (position, organization_id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS vehicle (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    department_id TEXT NOT NULL REFERENCES department(id) ON DELETE RESTRICT,
    mileage INTEGER, -- if the vehicle does not support mileage (permit) NULL
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS destination (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    short_name TEXT,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS trip (
    id TEXT PRIMARY KEY,
    vehicle_id TEXT NOT NULL REFERENCES vehicle(id) ON DELETE RESTRICT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    start_mileage INTEGER,
    end_mileage INTEGER,
    started_by TEXT NOT NULL REFERENCES account(id) ON DELETE RESTRICT,
    ended_by TEXT REFERENCES account(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS trip_destination (
    trip_id TEXT NOT NULL REFERENCES trip(id) ON DELETE CASCADE,
    destination_id TEXT NOT NULL REFERENCES destination(id) ON DELETE RESTRICT,
    position INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ,
    PRIMARY KEY (trip_id, destination_id),
    UNIQUE(position, trip_id) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS configuration (
    key TEXT PRIMARY KEY,
    value TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_trip_vehicle_id ON trip(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trip_started_by ON trip(started_by);
CREATE INDEX IF NOT EXISTS idx_trip_ended_by ON trip(ended_by);
CREATE INDEX IF NOT EXISTS idx_trip_start_time ON trip(start_time DESC);
