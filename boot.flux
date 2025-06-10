fn geet(name: string) => void {
    emit name;
}

fn auth(req:fluxReq) => bool {
    return true;
}
fn getUser(req:fluxReq) => string {
    return `this User: {{req}}`;
}

fn homeView(req:fluxReq) => string {
    return `User`;
}

router '/' =>  {
    GET '/' => homeView,
}

router '/users' => [auth] {
    GET '/#id' => getUser,
}

fn boot() => void {

}
