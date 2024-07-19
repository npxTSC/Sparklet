#![allow(unused)]

use super::*;

#[derive(TemplateOnce)]
#[template(path = "home.html")]
pub struct HomeTemplate {
    // data to be passed to the template
    pub account_uuid: String,
}

#[derive(TemplateOnce)]
#[template(path = "parts/topbar.html")]
pub struct TopBarTemplate {
    // data to be passed to the template
    pub account_uuid: String,
}

#[derive(TemplateOnce)]
#[template(path = "404.html")]
pub struct Error404Template {
    pub account_uuid: String,
}
