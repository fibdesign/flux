fn homeView() => string {
    string text = 'Hellow World!';
    return text;
}

fn aboutView() => string {
    string text = 'my name is Flux! and I am a custom API language!';
    return text;
}

router '/' => {
    GET '/' => homeView,
    GET '/about' => aboutView,
}
