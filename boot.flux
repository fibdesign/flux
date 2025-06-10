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
    object user = { name: 'sadegh', id: 1};
    string name = user.name;
    return `User: {{user}}`;
}

router '/' =>  {
    GET '/' => homeView,
}

router '/users' => [auth] {
    POST '/' => getUser,
    GET '/#id' => getUser,
}

fn boot() => void {
    #-- boot --#
}
