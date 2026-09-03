// Smoke test — xác nhận app khởi động được và hiển thị text.
import 'package:flutter_test/flutter_test.dart';
import 'package:nekopath_app/main.dart';

void main() {
  testWidgets('NEKOPATH app launches', (WidgetTester tester) async {
    await tester.pumpWidget(const NekopathApp());
    expect(find.textContaining('NEKOPATH'), findsOneWidget);
  });
}
