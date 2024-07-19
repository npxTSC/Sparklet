// the start of something great...?
// aka something that will probably never be completely finished!
// but then again... all great things take time

use actix_files::Files;
use actix_web::*;
use http::StatusCode;
use sailfish::TemplateOnce;

mod api;
mod templates;
use templates::*;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .configure(|cfg| {
                cfg.service(web::scope("/api").configure(api::router));
            })
            .service(index)
            .service(Files::new("/", "./dist"))
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

    HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(ctx.render_once().unwrap())
}
