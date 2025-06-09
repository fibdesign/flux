fn geet(name: string) => void {
    emit name;
}
fn getUsers() => string {return 'this is users list example';}
fn getPosts() => string {return 'this is post list example';}


fn auth() => bool { return true; }
router '/users' => [auth] {
    GET '/' => getUsers,
    POST '/create' => getUsers
}

router '/posts' => {
    GET '/' => getPosts,
    POST '/create' => getPosts
}


fn boot() => void {
  geet('bluebird');
}