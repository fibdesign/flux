router '/' =>  {
    GET '/' => homeView,
}
fn homeView(req:fluxReq) => string {
    return `Hello World! I hope you build something amazing here...`;
}
