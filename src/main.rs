// the start of something great...?
// aka something that will probably never be completely finished!
// but then again... all great things take time

use actix_files::{Files, NamedFile};
use actix_web::*;
use const_format::concatcp;
use std::path::PathBuf;

mod api;
use api::api_routes;

const FRONTEND_DIR: &str = "./vue-app";
const SERVE_DIR: &str = concatcp!(FRONTEND_DIR, "/dist");
const ASSETS_DIR: &str = concatcp!(SERVE_DIR, "/assets");

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(index)
            .configure(|cfg| {
                cfg.service(web::scope("/api").configure(api_routes));
            })
            // .configure( api::configure_routes)
            // .service(web::resource("/api").route(web::post().to(api_router)))
            .service(Files::new("/assets", ASSETS_DIR))
    })
    .bind(("127.0.0.1", 5001))?
    .run()
    .await
}

#[get("/")]
async fn index(_req: HttpRequest) -> impl Responder {
    let path = concatcp!(SERVE_DIR, "/index.html");
    let path = PathBuf::from(path);
    NamedFile::open(path)
}
