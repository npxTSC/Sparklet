use super::*;

#[derive(TemplateOnce)]
#[template(path = "hello.html")]
pub struct HelloTemplate {
    // data to be passed to the template
    pub messages: Vec<String>,
}

#[derive(TemplateOnce)]
#[template(path = "topbar.html")]
pub struct TopBarTemplate {
    // data to be passed to the template
    pub messages: Vec<String>,
}
