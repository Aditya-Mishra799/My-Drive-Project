CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    s3_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE file_shares (
    id SERIAL PRIMARY KEY,
    file_id INT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    shared_with_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(10) DEFAULT 'viewer', -- e.g., owner/viewer
    expires_at TIMESTAMP WITH TIME ZONE, -- optional for link expiry
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE shareable_links (
    id SERIAL PRIMARY KEY,
    file_id INT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE, -- random unique token in URL
    created_by INT NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE, -- optional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE file_activity_log (
    id SERIAL PRIMARY KEY,
    file_id INT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- e.g., upload, download, share
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);