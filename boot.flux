fn geet(name: string) => void {
    emit name;
}

fn auth(req:fluxReq) => bool {
    return true;
}
fn getUser(req:fluxReq) => string {
    return `this is request: {{req.params.id}}`;
}

fn homeView(req:fluxReq) => string {
    object user = { id: 1, name: 'sadegh', sth: 'sth'};
    return `User: {{user}}`;
}

router '/' =>  {
    GET '/' => homeView,
}

router '/users' => [auth] {
    GET '/#id' => getUser,
}

fn boot() => void {
    #-- boot --#
}
