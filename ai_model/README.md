## Dependency setup

The `ai_model` directory contains a specific Python virtual environment for all code related to fine-tuning the GPT model. To set up this environment:

1. Navigate to the `ai_model` folder.
2. Create a virtual environment: `python -m venv gpt_env`.
3. Activate the environment:
   - Windows: `gpt_env\Scripts\activate`
   - macOS/Linux: `source gpt_env/bin/activate`
4. Install the required dependencies: `pip install -r requirements.txt`.

Note: The `requirements.txt` in the `ai_model` folder lists dependencies specific to the AI model.