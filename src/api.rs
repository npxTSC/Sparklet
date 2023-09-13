use actix_web::*;

pub fn api_routes(cfg: &mut web::ServiceConfig) {
    // Register the /hello route
    cfg.route("/dummy", web::get().to(dummy));
}

async fn dummy() -> impl Responder {
    HttpResponse::Ok().body("Amogus")
}
