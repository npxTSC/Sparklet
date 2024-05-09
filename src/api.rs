use actix_files::NamedFile;
use actix_web::*;
use std::path::PathBuf;

pub fn router(cfg: &mut web::ServiceConfig) {
    // Register the /hello route
    cfg.route("/tea-capes", web::get().to(tea_capes));
}

async fn tea_capes() -> impl Responder {
    let path = PathBuf::from("./tea-capes.json");
    NamedFile::open(path)
}
