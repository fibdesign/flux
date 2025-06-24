fn homeView(req: fluxReq) => object {
    return req;
}
fn auth(req: fluxReq) => bool {
    return true;
}
fn aboutView(req: fluxReq) => string {
    return 'my name is Flux! and I am a custom API language!';
}

router '/' => [auth] {
    GET '/' => homeView,
    GET '/about' => aboutView
}