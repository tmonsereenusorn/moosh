// lib/main.dart
import 'package:flutter/material.dart';
import 'src/landing.dart';
import 'src/curator.dart';
import 'src/login_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Moosh',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.pink.shade200),
        useMaterial3: true,
      ),
      routes: {
        '/': (context) => const LandingPage(title: 'Landing Page'),
        '/curator': (context) => const Curator(),
        '/login': (context) => const LoginPage()
      },
    );
  }
}
