use super::*;

#[derive(TemplateOnce)] // automatically implement `TemplateOnce` trait
#[template(path = "hello.html")] // specify the path to template
pub struct HelloTemplate {
    // data to be passed to the template
    pub messages: Vec<String>,
}
