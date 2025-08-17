-- Create Report table
CREATE TABLE IF NOT EXISTS Report (
	id SERIAL PRIMARY KEY,
	template TEXT,
	user_mail VARCHAR(60),
	active BOOLEAN,
	create_at DATE DEFAULT CURRENT_DATE,
    update_at DATE DEFAULT CURRENT_DATE
);

-- Indexes for Report table
CREATE INDEX IF NOT EXISTS idx_report_user_mail ON Report(user_mail);
CREATE INDEX IF NOT EXISTS idx_report_active ON Report(active);
