import 'package:flutter/material.dart';

// Entry point của NEKOPATH.
// Mặc định chạy ở chế độ học sinh; chuyển vai trò qua auth/profile_gate.dart.
void main() {
  runApp(const NekopathApp());
}

class NekopathApp extends StatelessWidget {
  const NekopathApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'NEKOPATH',
      home: Scaffold(
        body: Center(
          child: Text('NEKOPATH — sẵn sàng code UI'),
        ),
      ),
    );
  }
}
