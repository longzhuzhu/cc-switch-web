use crate::command_state::State;

use crate::services::omo::{OmoLocalFileData, SLIM, STANDARD};
use crate::services::OmoService;
use crate::store::AppState;

pub(crate) async fn read_omo_local_file_internal() -> Result<OmoLocalFileData, String> {
    OmoService::read_local_file(&STANDARD).map_err(|e| e.to_string())
}

pub async fn read_omo_local_file() -> Result<OmoLocalFileData, String> {
    read_omo_local_file_internal().await
}

pub(crate) async fn get_current_omo_provider_id_internal(state: &AppState) -> Result<String, String> {
    let provider = state
        .db
        .get_current_omo_provider("opencode", "omo")
        .map_err(|e| e.to_string())?;
    Ok(provider.map(|p| p.id).unwrap_or_default())
}

pub async fn get_current_omo_provider_id(state: State<'_, AppState>) -> Result<String, String> {
    get_current_omo_provider_id_internal(state.inner()).await
}

pub(crate) async fn disable_current_omo_internal(state: &AppState) -> Result<(), String> {
    let providers = state.db.get_all_providers("opencode").map_err(|e| e.to_string())?;
    for (id, p) in &providers {
        if p.category.as_deref() == Some("omo") {
            state
                .db
                .clear_omo_provider_current("opencode", id, "omo")
                .map_err(|e| e.to_string())?;
        }
    }
    OmoService::delete_config_file(&STANDARD).map_err(|e| e.to_string())?;
    Ok(())
}

pub async fn disable_current_omo(state: State<'_, AppState>) -> Result<(), String> {
    disable_current_omo_internal(state.inner()).await
}

// ── OMO Slim commands ───────────────────────────────────────

pub(crate) async fn read_omo_slim_local_file_internal() -> Result<OmoLocalFileData, String> {
    OmoService::read_local_file(&SLIM).map_err(|e| e.to_string())
}

pub async fn read_omo_slim_local_file() -> Result<OmoLocalFileData, String> {
    read_omo_slim_local_file_internal().await
}

pub(crate) async fn get_current_omo_slim_provider_id_internal(
    state: &AppState,
) -> Result<String, String> {
    let provider = state
        .db
        .get_current_omo_provider("opencode", "omo-slim")
        .map_err(|e| e.to_string())?;
    Ok(provider.map(|p| p.id).unwrap_or_default())
}

pub async fn get_current_omo_slim_provider_id(
    state: State<'_, AppState>,
) -> Result<String, String> {
    get_current_omo_slim_provider_id_internal(state.inner()).await
}

pub(crate) async fn disable_current_omo_slim_internal(state: &AppState) -> Result<(), String> {
    let providers = state.db.get_all_providers("opencode").map_err(|e| e.to_string())?;
    for (id, p) in &providers {
        if p.category.as_deref() == Some("omo-slim") {
            state
                .db
                .clear_omo_provider_current("opencode", id, "omo-slim")
                .map_err(|e| e.to_string())?;
        }
    }
    OmoService::delete_config_file(&SLIM).map_err(|e| e.to_string())?;
    Ok(())
}

pub async fn disable_current_omo_slim(state: State<'_, AppState>) -> Result<(), String> {
    disable_current_omo_slim_internal(state.inner()).await
}
