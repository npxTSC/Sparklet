// the start of something great...?
// aka something that will probably never be completely finished!
// but then again... all great things take time

// use libdx::*;
use actix_web::{get, post, App, HttpResponse, HttpServer, Responder};

const FRONTEND_DIR: &str = "./vue-app";

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(hello).service(echo))
        .bind(("127.0.0.1", 5001))?
        .run()
        .await
}

#[get("/")]
async fn hello() -> impl Responder {
    println!("Test");
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}
