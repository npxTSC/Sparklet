// the start of something great...?
// aka something that will probably never be completely finished!
// but then again... all great things take time

use actix_files::{Files, NamedFile};
use actix_web::*;
use const_format::concatcp;
use std::path::PathBuf;

const FRONTEND_DIR: &str = "./vue-app";
const SERVE_DIR: &str = concatcp!(FRONTEND_DIR, "/dist");

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().service(index).service(echo).service(
            Files::new("/static", SERVE_DIR)
                .show_files_listing()
                .use_last_modified(true),
        )
    })
    .bind(("127.0.0.1", 5001))?
    .run()
    .await
}

#[get("/")]
async fn index(req: HttpRequest) -> Result<NamedFile> {
    let path: PathBuf = req.match_info().query("filename").parse().unwrap();
    Ok(NamedFile::open(path)?)
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}
