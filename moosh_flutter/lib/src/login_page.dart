import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:uni_links/uni_links.dart';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  final String _spotifyClientId = '942512cbcf3e4d6683ee071021d6182d';
  final String _spotifyRedirectUri = 'moosh://callback';
  final String _spotifyScopes = 'user-read-private user-read-email playlist-modify-private playlist-modify-public user-top-read';

  late final WebViewController _webViewController;

  void _login() async {
    final email = _emailController.text;
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      _showErrorDialog('Please enter both email and password.');
      return;
    }

    try {
      UserCredential userCredential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      _authenticateWithSpotify(); // Start Spotify authentication
    } on FirebaseAuthException catch (e) {
      _showErrorDialog(e.message ?? 'Unknown error occurred.');
    }
  }

  Future<void> _authenticateWithSpotify() async {
    final Uri authUrl = Uri.parse(
      'https://accounts.spotify.com/authorize?client_id=$_spotifyClientId&response_type=code&redirect_uri=$_spotifyRedirectUri&scope=$_spotifyScopes',
    );

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => WebView(
          initialUrl: authUrl.toString(),
          javascriptMode: JavascriptMode.unrestricted,
          onWebViewCreated: (controller) {
            _webViewController = controller;
          },
          navigationDelegate: (NavigationRequest request) {
            if (request.url.startsWith(_spotifyRedirectUri)) {
              final Uri uri = Uri.parse(request.url);
              _handleSpotifyRedirect(uri);
              Navigator.pop(context); // Close the web view
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      ),
    );
  }

  void _handleSpotifyRedirect(Uri uri) async {
    final String? code = uri.queryParameters['code'];
    if (code != null) {
      await _fetchSpotifyAccessToken(code);
      Navigator.pushNamed(context, '/curator'); // Navigate to curator page on success
    } else {
      _showErrorDialog('Spotify authentication failed.');
    }
  }

  Future<void> _fetchSpotifyAccessToken(String code) async {
    final response = await http.post(
      Uri.parse('https://accounts.spotify.com/api/token'),
      headers: {
        HttpHeaders.authorizationHeader:
            'Basic ${base64Encode(utf8.encode('$_spotifyClientId:71957175bb2446ca94b40d267f28f29b'))}',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': _spotifyRedirectUri,
      },
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> body = json.decode(response.body);
      final String accessToken = body['access_token'];
      final String refreshToken = body['refresh_token'];
      print("AccessToken");
      print(accessToken);

      // Save the access token and refresh token securely
      await _secureStorage.write(key: 'spotify_access_token', value: accessToken);
      await _secureStorage.write(key: 'spotify_refresh_token', value: refreshToken);
    } else {
      _showErrorDialog('Failed to fetch Spotify access token.');
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Error'),
          content: Text(message),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  @override
  void initState() {
    super.initState();
    // Listen for the redirect
    _handleIncomingLinks();
  }

  void _handleIncomingLinks() {
    linkStream.listen((String? link) {
      if (link != null) {
        final uri = Uri.parse(link);
        _handleSpotifyRedirect(uri);
      }
    }, onError: (err) {
      // Handle the error
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const Text(
              'Login',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20), // Spacing between text and fields
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20), // Spacing between fields
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(),
              ),
              obscureText: true,
            ),
            const SizedBox(height: 20), // Spacing between fields and button
            ElevatedButton(
              onPressed: _login,
              child: const Text('Continue'),
            ),
            const SizedBox(height: 20), // Spacing between button and text
            GestureDetector(
              onTap: () {
                // TODO: Implement sign-up navigation
              },
              child: const Text(
                'Don\'t have an account? Sign up',
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
