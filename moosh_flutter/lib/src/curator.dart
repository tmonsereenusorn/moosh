import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Curator extends StatefulWidget {
  const Curator({super.key});

  @override
  State<Curator> createState() => _CuratorState();
}

class _CuratorState extends State<Curator> {
  final _controller = TextEditingController();
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  String? _userName;

  @override
  void initState() {
    super.initState();
    _fetchSpotifyUserProfile();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _fetchSpotifyUserProfile() async {
    final accessToken = await _secureStorage.read(key: 'spotify_access_token');
    if (accessToken != null) {
      print('Access Token: $accessToken');

      final response = await http.get(
        Uri.parse('https://api.spotify.com/v1/me'),
        headers: {
          'Authorization': 'Bearer $accessToken',
        },
      );

      print('Response Status Code: ${response.statusCode}');
      print('Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> profile = json.decode(response.body);
        setState(() {
          _userName = profile['display_name'];
        });
      } else {
        print('Failed to fetch user profile');
        // Additional error handling can be done here
      }
    } else {
      print('No access token found');
    }
  }

  void submit() {
    final text = _controller.text;
    print(text);
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          if (_userName != null)
            Padding(
              padding: const EdgeInsets.only(top: 50, right: 16),
              child: Row(
                children: [
                  Spacer(),
                  Text(
                    'Hello, $_userName',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.normal),
                  ),
                ],
              ),
            ),
          const Spacer(),
          SvgPicture.asset(
            'assets/moosh_logo.svg',
            height: 50,
          ),
          const Spacer(),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 40),
            child: TextField(
              controller: _controller,
              decoration: InputDecoration(
                border: const OutlineInputBorder(),
                hintText: 'Make me a playlist...',
                suffixIcon: IconButton(
                  onPressed: submit,
                  icon: const Icon(Icons.arrow_upward),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
