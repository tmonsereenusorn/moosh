// lib/my_home_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key, required this.title});

  final String title;

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            SvgPicture.asset(
              'assets/moosh_logo.svg',
              height: 100,
            ),
            const SizedBox(height: 20), // Spacing between logo + button
            ElevatedButton(
              onPressed: () {
                // TODO: Login functionality
              },
              child: const Text('Login'),
            ),
            const SizedBox(height: 20), // Spacing between button + text
            GestureDetector(
              onTap: () {
                // TODO: Try it mode functionality
              },
              child: const Text(
                'Try it without logging in',
                style: TextStyle(
                  color: Colors.blue,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
