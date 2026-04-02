use std::env;
use std::fs;
use std::path::{Path, PathBuf};

fn dir_has_entries(path: &Path) -> bool {
    fs::read_dir(path)
        .ok()
        .and_then(|mut entries| entries.next())
        .is_some()
}

fn normalize_for_include_dir(path: &Path) -> String {
    path.to_string_lossy().replace('\\', "/")
}

fn main() {
    let manifest_dir =
        PathBuf::from(env::var("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR missing"));
    let repo_root = manifest_dir
        .parent()
        .expect("backend crate should have repo root parent");
    let dist_dir = repo_root.join("dist");

    println!("cargo:rerun-if-changed={}", dist_dir.display());

    let out_dir = PathBuf::from(env::var("OUT_DIR").expect("OUT_DIR missing"));
    let empty_dir = out_dir.join("empty-frontend-dist");
    fs::create_dir_all(&empty_dir).expect("failed to create empty embedded dist directory");

    let (embed_dir, has_embedded_dist) = if dist_dir.is_dir() && dir_has_entries(&dist_dir) {
        (dist_dir, true)
    } else {
        (empty_dir, false)
    };

    println!(
        "cargo:rustc-env=CC_SWITCH_WEB_EMBED_DIST_DIR={}",
        normalize_for_include_dir(&embed_dir)
    );
    println!(
        "cargo:rustc-env=CC_SWITCH_WEB_HAS_EMBEDDED_DIST={}",
        if has_embedded_dist { "1" } else { "0" }
    );
}
