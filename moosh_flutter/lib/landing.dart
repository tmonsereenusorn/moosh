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
              height: 100, // Adjust the height as needed
            ),
            const SizedBox(height: 20), // Add spacing between logo and button
            ElevatedButton(
              onPressed: () {
                // Implement login functionality here
              },
              child: const Text('Login'),
            ),
            const SizedBox(height: 20), // Add spacing between button and text
            GestureDetector(
              onTap: () {
                // Implement "try it without logging in" functionality here
              },
              child: const Text(
                'Try it without logging in',
                style: TextStyle(
                  color: Colors.blue, // Make the text blue
                  decoration: TextDecoration.underline, // Underline the text
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
