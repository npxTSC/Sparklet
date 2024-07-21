use super::*;

use actix_files::NamedFile;
use std::path::PathBuf;

pub fn router(cfg: &mut web::ServiceConfig) {
    cfg.route("/tea-capes", web::get().to(tea_capes));
    cfg.route("/account", web::get().to(account));
}

async fn tea_capes() -> impl Responder {
    let path = PathBuf::from("./tea-capes.json");
    NamedFile::open(path)
}

async fn account(state: Data<Sparklet>, req: HttpRequest) -> impl Responder {
    let conn = state.db;

    let uuid = req.headers().get("Account-UUID").unwrap().to_str().unwrap();

    let db = req.app_data::<Sparklet>().unwrap().db.clone();
    let row = conn
        .prepare("SELECT * FROM accounts WHERE uuid = ?")
        .unwrap()
        .query_map([], |row| {
            Ok(Account {
                id: row.get(0)?,
                name: row.get(1)?,
                data: row.get(2)?,
            })
        })
        .unwrap();

    // send the row as a json response
    HttpResponse::Ok().json(row)
}
