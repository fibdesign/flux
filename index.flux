fn add(x: int, y: int) => int {
  return x + y;
}

fn geet(name:string) => string {
  return name;
}


fn boot() => void {
  int sum = add(5, 6);
  emit sum;
  geet('bluebird');
}
