use actix_files::NamedFile;
use actix_web::*;
use std::path::PathBuf;

pub fn router(cfg: &mut web::ServiceConfig) {
    cfg.route("/tea-capes", web::get().to(tea_capes));
    cfg.route("/account", web::get().to(account));
}

async fn tea_capes() -> impl Responder {
    let path = PathBuf::from("./tea-capes.json");
    NamedFile::open(path)
}

async fn account() -> impl Responder {
    HttpResponse::Ok().body("Hello, world!")
}
