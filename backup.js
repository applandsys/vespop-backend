require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { URL } = require('url');

// Parse DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);

const DB_USER = dbUrl.username;
const DB_PASSWORD = dbUrl.password;
const DB_HOST = dbUrl.hostname;
const DB_PORT = dbUrl.port || '5432';
const DB_NAME = dbUrl.pathname.replace('/', '');

// Ensure backups folder exists
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

// File name
const fileName = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.dump`;
const filePath = path.join(backupDir, fileName);

// pg_dump command
const command = `pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -F c -b -v -f "${filePath}" ${DB_NAME}`;

// Pass password securely
const env = { ...process.env, PGPASSWORD: DB_PASSWORD };

exec(command, { env }, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Backup failed:\n', stderr);
        return;
    }
    console.log('✅ Backup created at:', filePath);
});
