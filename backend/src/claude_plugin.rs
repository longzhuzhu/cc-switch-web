use std::fs;
use std::path::PathBuf;

use crate::config::atomic_write;
use crate::error::AppError;

const CLAUDE_CONFIG_FILE: &str = "config.json";

fn claude_config_path() -> PathBuf {
    crate::config::get_claude_config_dir().join(CLAUDE_CONFIG_FILE)
}

fn ensure_claude_dir_exists() -> Result<PathBuf, AppError> {
    let dir = crate::config::get_claude_config_dir();
    if !dir.exists() {
        fs::create_dir_all(&dir).map_err(|e| AppError::io(&dir, e))?;
    }
    Ok(dir)
}

fn read_claude_config_text(path: &PathBuf) -> Result<Option<String>, AppError> {
    if !path.exists() {
        return Ok(None);
    }

    let content = fs::read_to_string(path).map_err(|e| AppError::io(path, e))?;
    Ok(Some(content))
}

fn write_claude_config_value(path: &PathBuf, value: &serde_json::Value) -> Result<(), AppError> {
    let serialized =
        serde_json::to_string_pretty(value).map_err(|e| AppError::JsonSerialize { source: e })?;
    atomic_write(path, format!("{serialized}\n").as_bytes())
}

pub fn write_claude_config() -> Result<bool, AppError> {
    let path = claude_config_path();
    ensure_claude_dir_exists()?;

    let mut root = match read_claude_config_text(&path)? {
        Some(existing) => match serde_json::from_str::<serde_json::Value>(&existing) {
            Ok(serde_json::Value::Object(map)) => serde_json::Value::Object(map),
            _ => serde_json::json!({}),
        },
        None => serde_json::json!({}),
    };

    let obj = root
        .as_object_mut()
        .ok_or_else(|| AppError::Config("Claude 插件配置根必须是对象".into()))?;

    if obj.get("primaryApiKey").and_then(|value| value.as_str()) == Some("any") {
        return Ok(false);
    }

    obj.insert(
        "primaryApiKey".to_string(),
        serde_json::Value::String("any".to_string()),
    );
    write_claude_config_value(&path, &root)?;
    Ok(true)
}

pub fn clear_claude_config() -> Result<bool, AppError> {
    let path = claude_config_path();
    if !path.exists() {
        return Ok(false);
    }

    let content = match read_claude_config_text(&path)? {
        Some(content) => content,
        None => return Ok(false),
    };

    let mut root = match serde_json::from_str::<serde_json::Value>(&content) {
        Ok(value) => value,
        Err(_) => return Ok(false),
    };

    let obj = match root.as_object_mut() {
        Some(obj) => obj,
        None => return Ok(false),
    };

    if obj.remove("primaryApiKey").is_none() {
        return Ok(false);
    }

    write_claude_config_value(&path, &root)?;
    Ok(true)
}
