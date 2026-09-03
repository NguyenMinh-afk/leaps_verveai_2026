// FR-06 → FR-11, TS-07.
// Đặc tính BẮT BUỘC:
//   - Tất định (cùng input → cùng output).
//   - Idempotent cho cùng state ban đầu + cùng chuỗi (correct, incorrect).
//   - pKnown nằm trong [0, 1].
//   - pKnown đúng tăng khi `correct`, đúng giảm khi `incorrect` (đơn điệu).

import 'package:flutter_test/flutter_test.dart';
import 'package:nekopath_app/engine/mastery/bkt.dart';

void main() {
  group('Bkt — TS-07 tất định + idempotent', () {
    const bkt = Bkt();
    final s0 = bkt.initial('stu-1', 'skill-A');

    test('state ban đầu có pKnown == pL0', () {
      expect(s0.pKnown, BktParams.defaults.pL0);
    });

    test('update là idempotent — chạy 10 lần ra cùng pKnown', () {
      final s1 = bkt.update(s0, true);
      // chạy 10 lần từ s1, kết quả phải bằng nhau
      var s = s1;
      for (var i = 0; i < 10; i++) {
        s = bkt.update(s, true);
      }
      expect(s.pKnown, closeTo(s1.pKnown, 1e-12));
    });

    test('update tất định — gọi từ cùng state luôn ra cùng pKnown', () {
      final a = bkt.update(s0, true);
      final b = bkt.update(s0, true);
      expect(a, b);
    });

    test('pKnown nằm trong [0, 1] cho cả correct/incorrect', () {
      var s = s0;
      for (var i = 0; i < 100; i++) {
        s = bkt.update(s, i.isEven);
        expect(s.pKnown, inInclusiveRange(0, 1));
      }
    });

    test('pKnown tăng khi đúng liên tiếp, đạt mastery sau nhiều lượt', () {
      var s = s0;
      for (var i = 0; i < 50; i++) {
        s = bkt.update(s, true);
      }
      expect(s.pKnown, greaterThan(s0.pKnown));
      expect(bkt.isMastered(s), isTrue);
    });

    test('pKnown giảm khi sai liên tiếp', () {
      var s = bkt.update(s0, true);
      final pAfterOneCorrect = s.pKnown;
      for (var i = 0; i < 20; i++) {
        s = bkt.update(s, false);
      }
      expect(s.pKnown, lessThan(pAfterOneCorrect));
    });
  });

  group('Bkt — BktParams validation', () {
    test('defaults hợp lệ', () {
      expect(BktParams.defaults.isValid, isTrue);
    });

    test('params không hợp lệ khi nằm ngoài [0, 1]', () {
      const bad = BktParams(pL0: -0.1, pT: 0.2, pG: 0.2, pS: 0.1);
      expect(bad.isValid, isFalse);
    });
  });

  group('Bkt — logLikelihood dùng cho self_consistency_check', () {
    test('chuỗi rỗng trả về log(pL0) * 0 = 0', () {
      final ll = const Bkt().logLikelihood(const []);
      expect(ll, 0.0);
    });

    test('chuỗi toàn đúng có log-likelihood lớn hơn chuỗi toàn sai', () {
      const bkt = Bkt();
      final allCorrect = List.generate(10, (_) => (state: bkt.initial('x', 'y'), correct: true));
      final allWrong = List.generate(10, (_) => (state: bkt.initial('x', 'y'), correct: false));
      expect(bkt.logLikelihood(allCorrect), greaterThan(bkt.logLikelihood(allWrong)));
    });
  });
}