// the start of something great...?
// aka something that will probably never be completely finished!
// but then again... all great things take time

use actix_files::Files;
use actix_web::*;
use http::StatusCode;
use rusqlite::Connection;
use sailfish::TemplateOnce;
use web::Data;

mod api;
mod templates;
use templates::*;

const DB_URL: &str = "./sparklet.db";

pub struct Sparklet {
    db: Connection,
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(Sparklet {
                db: Connection::open(DB_URL).unwrap(),
            }))
            .service(web::scope("/api").configure(api::router))
            .service(index)
            .service(Files::new("/", "./dist"))
            .default_service(web::route().guard(guard::Not(guard::Get())).to(custom404))
    })
    .bind(("127.0.0.1", 5001))?
    .run()
    .await
}

#[get("/")]
async fn index(_req: HttpRequest) -> impl Responder {
    let ctx = HomeTemplate {
        account_uuid: "".to_owned(),
    };

    HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(ctx.render_once().unwrap())
}

async fn custom404() -> impl Responder {
    let ctx = Error404Template {
        account_uuid: "".to_owned(),
    };

    HttpResponse::build(StatusCode::NOT_FOUND)
        .content_type("text/html; charset=utf-8")
        .body(ctx.render_once().unwrap())
}

async fn make_tables(conn: Connection) {
    // query!(
    //     r#"
    //     CREATE TABLE IF NOT EXISTS accounts (
    //         id INTEGER PRIMARY KEY,
    //         uuid TEXT NOT NULL,
    //         email TEXT NOT NULL,
    //         password TEXT NOT NULL,
    //         created_at TEXT NOT NULL,
    //         rank INTEGER NOT NULL
    //     )
    //     "#,
    // )
    // .execute(pool)
    // .await
    // .unwrap();
}
