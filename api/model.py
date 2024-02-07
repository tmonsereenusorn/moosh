"""
Migrated and edited from ai_model/model.py

Serves as the core OpenAI functionality of the API, allowing us to query OpenAI
from the Flask server.
"""
import json
from openai import OpenAI
from tenacity import retry, wait_random_exponential, stop_after_attempt
from termcolor import colored  

GPT_MODEL_NEW = "gpt-3.5-turbo-0125"
client = OpenAI()

@retry(wait=wait_random_exponential(multiplier=1, max=40), stop=stop_after_attempt(3))
def chat_completion_request(messages, tools=None, tool_choice=None, model=GPT_MODEL_NEW):
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            tools=tools,
            tool_choice=tool_choice,
        )
        return response
    except Exception as e:
        print("Unable to generate ChatCompletion response")
        print(f"Exception: {e}")
        return e

def pretty_print_conversation(messages):
    role_to_color = {
        "system": "red",
        "user": "green",
        "assistant": "blue",
        "function": "magenta",
    }
    
    for message in messages:
        if message["role"] == "system":
            print(colored(f"system: {message['content']}\n", role_to_color[message["role"]]))
        elif message["role"] == "user":
            print(colored(f"user: {message['content']}\n", role_to_color[message["role"]]))
        elif message["role"] == "assistant" and message.get("function_call"):
            print(colored(f"assistant: {message['function_call']}\n", role_to_color[message["role"]]))
        elif message["role"] == "assistant" and not message.get("function_call"):
            print(colored(f"assistant: {message['content']}\n", role_to_color[message["role"]]))
        elif message["role"] == "function":
            print(colored(f"function ({message['name']}): {message['content']}\n", role_to_color[message["role"]]))

def extract_function_call(assistant_message):
    # Check if there are any tool calls in the assistant message
    if assistant_message.tool_calls:
        # Iterate over all tool calls
        for tool_call in assistant_message.tool_calls:
            # Check if the tool call has a function with arguments
            if tool_call.function and tool_call.function.arguments:
                try:
                    # The arguments are expected to be a JSON string, parse them
                    arguments_json = json.loads(tool_call.function.arguments)
                    # Print the parsed JSON in a nicely formatted way
                    return json.dumps(arguments_json, indent=4)
                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON: {e}")
    else:
        print("No function calls found in the assistant message.")

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_recommendation_seeds",
            "description": "Understand sentiment of the given prompt and return seed values to use with Spotify's recommendation API, which will generate a playlist matching that prompt",
            "parameters": {
                "type": "object",
                "properties": {
                    "market": {
                        "type": "string",
                        "description": "An ISO 3166-1 alpha-2 country code, e.g. US, ES etc. Only return this value if explicitly requested for.",
                    },
                    "seed_artists": {
                        "type": "string",
                        "description": "A comma separated list of exactly two seed artist names (i.e. Playboi Carti, Rihanna). You MUST return two seed artists. SUPER IMPORTANT.",
                    },
                    "seed_genres": {
                        "type": "string",
                        "description": "A comma separated list of EXACTLY two genres (i.e. acoustic, black-metal). You MUST return two seed genres. SUPER IMPORTANT.",
                    },
                    "seed_tracks": {
                        "type": "string",
                        "description": "One seed track title, such as Bohemian Rhapsody. You must return one seed track.",
                    },
                    "target_acousticness": {
                        "type": "number",
                        "description": "A number between 0 and 1, describing a target value for the acousticness of tracks in the playlist. A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.",
                    },
                    "target_danceability": {
                        "type": "number",
                        "description": "A number between 0 and 1, describing a target value for the danceability of tracks in the playlist. Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.",
                    },
                    "target_duration_ms": {
                        "type": "integer",
                        "description": "An integer describing the target duration (in ms) of tracks in the playlist.",
                    },
                    "target_energy": {
                        "type": "number",
                        "description": "A number between 0 and 1, describing a target value for the energy of tracks in the playlist. Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
                    },
                    "target_instrumentalness": {
                        "type": "number",
                        "description": "A number between 0 and 1, describing a target value for the instrumentalness of tracks in the playlist.",
                    },
                    "target_key": {
                        "type": "integer",
                        "description": "An integer between 0 and 11 describing the target key of tracks in the playlist. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on.",
                    },
                    "target_liveness": {
                        "type": "number",
                        "description": "A number between 0 and 1, describing a target value for the liveness of tracks in the playlist. Refers to the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.",
                    },
                    "target_loudness": {
                        "type": "number",
                        "description": "A number describing a target value for the loudness of tracks in the playlist. The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.",
                    },
                    "target_mode": {
                        "type": "integer",
                        "description": "An integer describing a target value for the mode of tracks in the playlist. Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.",
                    },
                    "target_popularity": {
                        "type": "integer",
                        "description": "An integer describing a target value for the popularity of tracks in the playlist. The popularity of the track. The value will be between 0 and 100, with 100 being the most popular.",
                    },
                    "target_speechiness": {
                        "type": "number",
                        "description": "A number between 0 and 1 describing a target value for the speechiness of tracks in the playlist. Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.",
                    },
                    "target_tempo": {
                        "type": "number",
                        "description": "A number describing a target value for the tempo (in BPM) of tracks in the playlist.",
                    },
                    "target_time_signature": {
                        "type": "integer",
                        "description": "An integer between 3 and 7 describing a target value for the time signature of tracks in the playlist. The time signature of 3 indicates 3/4, while 7 indicates 7/4.",
                    },
                    "target_valence": {
                        "type": "number",
                        "description": "A number between 0 and 1 describing a target value for the valence of tracks in the playlist. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
                    }
                },
                "required": ["seed_artists", "seed_genres", "seed_tracks", "target_acousticness", "target_danceability", "target_energy", "target_instrumentalness", "target_valence"]
            },
        }
    }
]

def query_openai(prompt):
  """External access to querying the OpenAI API with a given prompt."""
  messages = []
  messages.append({"role": "system", "content": "You are a smart music recommendation system that generates a JSON for use with spotify's recommendation API. You must include all required properties in the JSON, especially seed_artists."})
  messages.append({"role": "user", "content": prompt})
  chat_response = chat_completion_request(
      messages, tools=tools, tool_choice={"type": "function", "function": {"name": "get_recommendation_seeds"}}
  )
  assistant_message = chat_response.choices[0].message
  messages.append(assistant_message)
  return extract_function_call(assistant_message)