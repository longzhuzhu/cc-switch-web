use crate::database::Database;
use crate::proxy::providers::codex_oauth_auth::CodexOAuthManager;
use crate::proxy::providers::copilot_auth::CopilotAuthManager;
use crate::services::proxy::ProxyService;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

/// 全局应用状态
pub struct AppState {
    pub db: Arc<Database>,
    pub copilot_auth_state: Arc<RwLock<CopilotAuthManager>>,
    pub codex_oauth_state: Arc<RwLock<CodexOAuthManager>>,
    pub proxy_service: ProxyService,
    /// 会话令牌 → 过期时间戳（Unix 秒），惰性清理
    pub auth_tokens: Arc<RwLock<HashMap<String, i64>>>,
}

impl AppState {
    /// 创建新的应用状态
    pub fn new(db: Arc<Database>) -> Self {
        let copilot_auth_state = Arc::new(RwLock::new(CopilotAuthManager::new(
            crate::config::get_app_config_dir(),
        )));
        let codex_oauth_state = Arc::new(RwLock::new(CodexOAuthManager::new(
            crate::config::get_app_config_dir(),
        )));
        let proxy_service = ProxyService::new_with_auth(
            db.clone(),
            copilot_auth_state.clone(),
            codex_oauth_state.clone(),
        );
        let auth_tokens = Arc::new(RwLock::new(HashMap::new()));

        Self {
            db,
            copilot_auth_state,
            codex_oauth_state,
            proxy_service,
            auth_tokens,
        }
    }
}
