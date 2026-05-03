//! 密钥登录认证数据访问对象

use crate::database::{lock_conn, Database};
use crate::error::AppError;
use rusqlite::params;

impl Database {
    /// 查询是否已设置密钥
    pub fn has_access_key(&self) -> Result<bool, AppError> {
        let conn = lock_conn!(self.conn);
        let count: i64 = conn
            .query_row(
                "SELECT COUNT(*) FROM access_key WHERE id = 1",
                [],
                |row| row.get(0),
            )
            .map_err(|e| AppError::Database(e.to_string()))?;
        Ok(count > 0)
    }

    /// 首次设置密钥（仅在未设置时可用）
    pub fn setup_access_key(&self, key_hash: &str) -> Result<(), AppError> {
        if key_hash.is_empty() {
            return Err(AppError::InvalidInput("密钥哈希不能为空".to_string()));
        }
        let conn = lock_conn!(self.conn);
        let count: i64 = conn
            .query_row(
                "SELECT COUNT(*) FROM access_key WHERE id = 1",
                [],
                |row| row.get(0),
            )
            .map_err(|e| AppError::Database(e.to_string()))?;
        if count > 0 {
            return Err(AppError::InvalidInput("密钥已设置，无法重复设置".to_string()));
        }
        let now = chrono::Utc::now().timestamp();
        conn.execute(
            "INSERT INTO access_key (id, key_hash, created_at) VALUES (1, ?1, ?2)",
            params![key_hash, now],
        )
        .map_err(|e| AppError::Database(e.to_string()))?;
        Ok(())
    }

    /// 验证密钥（比对哈希）。调用前应先通过 has_access_key() 确认密钥已设置。
    pub fn verify_access_key(&self, key_hash: &str) -> Result<bool, AppError> {
        if key_hash.is_empty() {
            return Ok(false);
        }
        let conn = lock_conn!(self.conn);
        let stored: Option<String> = match conn.query_row(
            "SELECT key_hash FROM access_key WHERE id = 1",
            [],
            |row| row.get(0),
        ) {
            Ok(hash) => Some(hash),
            Err(rusqlite::Error::QueryReturnedNoRows) => None,
            Err(e) => return Err(AppError::Database(e.to_string())),
        };
        Ok(stored.as_deref() == Some(key_hash))
    }

    /// 修改密钥（需先验证旧密钥）
    pub fn change_access_key(&self, key_hash: &str) -> Result<(), AppError> {
        if key_hash.is_empty() {
            return Err(AppError::InvalidInput("密钥哈希不能为空".to_string()));
        }
        let conn = lock_conn!(self.conn);
        let now = chrono::Utc::now().timestamp();
        conn.execute(
            "UPDATE access_key SET key_hash = ?1, updated_at = ?2 WHERE id = 1",
            params![key_hash, now],
        )
        .map_err(|e| AppError::Database(e.to_string()))?;
        Ok(())
    }
}
