fn add(x: int, y: int) => int {
  return x + y;
}

fn geet(name:string) => void {
  emit name;
}

fn boot() => void {
  int sum = add(5, 6);
  emit sum;
  geet('bluebird');
}
