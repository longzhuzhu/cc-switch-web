//! MCP (Model Context Protocol) 服务器管理模块
//!
//! 本模块负责 MCP 服务器配置的验证、同步和导入导出。
//!
//! ## 模块结构
//!
//! - `validation` - 服务器配置验证
//! - `claude` - Claude MCP 同步和导入
//! - `codex` - Codex MCP 同步和导入（含 TOML 转换）
//! - `gemini` - Gemini MCP 同步和导入
//! - `opencode` - OpenCode MCP 同步和导入（含 local/remote 格式转换）

mod claude;
mod codex;
mod gemini;
mod opencode;
mod validation;

// 仅 crate 内部服务层会调用这些同步/导入函数
pub(crate) use claude::{
    import_from_claude, remove_server_from_claude, sync_single_server_to_claude,
};
pub(crate) use codex::{
    import_from_codex, remove_server_from_codex, sync_single_server_to_codex,
};
pub(crate) use gemini::{
    import_from_gemini, remove_server_from_gemini, sync_single_server_to_gemini,
};
pub(crate) use opencode::{
    import_from_opencode, remove_server_from_opencode, sync_single_server_to_opencode,
};
