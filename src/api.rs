use actix_files::NamedFile;
use actix_web::*;
// use serde::Deserialize;
// use serde_json::Value;
// use std::fs::File;
// use std::io::BufReader;
// use libdx::Result;
use crate::CAPE_JSON;
use std::path::PathBuf;

pub fn api_routes(cfg: &mut web::ServiceConfig) {
    // Register the /hello route
    cfg.route("/tea-capes", web::get().to(tea_capes));
}

async fn tea_capes() -> impl Responder {
    let path = PathBuf::from(CAPE_JSON);
    NamedFile::open(path)
}

/* USE THIS LATER WHEN CAPES ARE DYNAMIC
async fn tea_capes() -> impl Responder {
    // Map of usernames -> cape urls
    let tea_capes = read_capes_json(CAPE_JSON);

    HttpResponse::Ok().body("Amogus")
}

fn read_capes_json<P: AsRef<Path>>(path: P) -> Result<Value> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    let capes = serde_json::from_reader(reader)?;
    Ok(capes)
}
*/
