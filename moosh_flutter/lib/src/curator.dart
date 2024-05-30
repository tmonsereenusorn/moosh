import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Curator extends StatefulWidget {
  const Curator({super.key});

  @override
  State<Curator> createState() => _Curator();
}

class _Curator extends State<Curator> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
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
          const Spacer(),
          Center(
            child: Column(
              children: [
                SvgPicture.asset(
                  'assets/moosh_logo.svg',
                  height: 50,
                ),
              ]
            )
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
                )
              ),
            ),
          ),
        ],
      )
    );
  }
}