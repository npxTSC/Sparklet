// the start of something great...?
// aka something that will probably never be completely finished!
// but then again... all great things take time

use actix_files::Files;
use actix_web::*;
use const_format::concatcp;
use sailfish::TemplateOnce;

mod api;
mod templates;
use templates::*;

pub const FRONTEND_DIR: &str = "./vue-app";
pub const SERVE_DIR: &str = concatcp!(FRONTEND_DIR, "/dist");
pub const ASSETS_DIR: &str = concatcp!(SERVE_DIR, "/assets");

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .configure(|cfg| {
                cfg.service(web::scope("/api").configure(api::router));
            })
            .service(index)
            .service(Files::new("/", SERVE_DIR))
            .service(Files::new("/assets", ASSETS_DIR))
    })
    .bind(("127.0.0.1", 5001))?
    .run()
    .await
}

#[get("/")]
async fn index(_req: HttpRequest) -> impl Responder {
    let ctx = HelloTemplate {
        messages: vec![String::from("foo"), String::from("bar")],
    };

    ctx.render_once().unwrap()
}
