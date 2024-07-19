// the start of something great...?
// aka something that will probably never be completely finished!
// but then again... all great things take time

use actix_files::Files;
use actix_web::*;
use http::StatusCode;
use sailfish::TemplateOnce;
use sqlx::migrate::MigrateDatabase;
use sqlx::sqlite::Sqlite;
use sqlx::Pool;
use web::Data;

mod api;
mod templates;
use templates::*;

const DB_URL: &str = "sqlite://sparklet.db";

pub struct Sparklet {
    db: Pool<Sqlite>,
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    // create database file if not exists
    if !Sqlite::database_exists(DB_URL).await.unwrap() {
        Sqlite::create_database(DB_URL).await.unwrap();
    }

    let pool = Pool::connect(DB_URL).await.unwrap();

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(Sparklet { db: pool.clone() }))
            .service(web::scope("/api").configure(api::router))
            .service(index)
            .service(Files::new("/", "./dist"))
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
