void main() {
  var a = [10, 23, 7, 54, 11, 999, 111, 6, 19, 182];
  int n = a.length;
  int max = a[0];
  int min = a[0];
  int odd = 0;

  // найти минимальное и максимальное числа

  for (int i = 0; i < n; i = i + 1) {
    if (a[i] > max) {
      max = a[i];
    }
    if (a[i] < min) {
      min = a[i];
    }
    // a[i] % 2 == 0

    if (a[i] % 2 == 0) {
      odd = odd + 1;
    }
  }
  int even = n - odd;

  print(
      'Максимальное число: $max, минимальное число: $min, всего: $n четное $odd нечетное $even');
}
