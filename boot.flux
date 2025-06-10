fn geet(name: string) => void {
    emit name;
}

fn auth(req:string) => bool {
    return true;
}
fn getUser(req:string) => string {
    return `this User: {{req}}`;
}

fn homeView(req:string) => string {
    return `User`;
}

router '/' =>  {
    GET '/' => homeView,
}

router '/users' => [auth] {
    GET '/' => getUser,
    POST '/hi' => getUser,
}

fn boot() => void {
  geet('bluebird');
}