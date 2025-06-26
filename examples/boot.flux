fn homeView() => fluxReq {
    return @fluxReq;
}

fn auth() => bool {
    @abort(403, 'your not welcome here', {name: 'bitch'});
    return true;
}

fn aboutView() => string {
    string text = 'my name is Flux! and I am a custom API language!';
    return text;
}

router '/' => {
    GET '/' => [auth] homeView,
    GET '/about' => aboutView,
    POST '/user' => aboutView,
    DELETE '/user' => aboutView,
    PUT '/user' => aboutView,
}