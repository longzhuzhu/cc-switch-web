use crate::services::subscription::SubscriptionQuota;

pub(crate) async fn get_subscription_quota_internal(
    tool: String,
) -> Result<SubscriptionQuota, String> {
    crate::services::subscription::get_subscription_quota(&tool).await
}

pub(crate) async fn get_coding_plan_quota_internal(
    base_url: String,
    api_key: String,
) -> Result<SubscriptionQuota, String> {
    crate::services::coding_plan::get_coding_plan_quota(&base_url, &api_key).await
}

pub(crate) async fn get_balance_internal(
    base_url: String,
    api_key: String,
) -> Result<crate::provider::UsageResult, String> {
    crate::services::balance::get_balance(&base_url, &api_key).await
}
