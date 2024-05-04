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
                    "seed_artists": {
                        "type": "string",
                        "description": "A comma-separated list of EXACTLY three seed artist names. If an artist name has a comma in it, remove the comma. While selecting these artists, prioritize their relevance to the specific user's prompt over their general music listening history. Ensure that the artists chosen as seeds are likely to produce recommendations that align with the theme or mood described in the prompt, even if they are not among the user's most frequently listened to artists.",
                    },
                    "seed_genres": {
                        "type": "string",
                        "description": "A comma separated list of EXACTLY two genres. You MUST return two different genres.",
                        "enum": ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]
                    },
                    "seed_tracks": {
                        "type": "string",
                        "description": "Return an empty string here.",
                        # "description": "One song track title. You MUST return exactly one title."
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

def query_openai(prompt, top_artists=None, top_tracks=None, top_genres=None):
    """External access to querying the OpenAI API with a given prompt, primed with user's top tracks, artists, and genres."""
    
    # Initialize the messages list with a system message containing user preferences
    messages = [{
        "role": "system",
        "content": "You are a smart music recommendation system that generates a JSON for use with Spotify's recommendation API."
                    "Your task is to first extract the mood and vibe of the prompt, then output seed values for song recommendations that will supplement the mood.\n"
                   "You must include all required properties in the JSON.\n"
                   "Some general information about the user's music taste is given below:\n"
                   f"User's top tracks: {', '.join(top_tracks) if top_tracks else 'No top tracks provided'}.\n"
                   f"User's top artists: {', '.join(top_artists) if top_artists else 'No top artists provided'}.\n"
                   f"User's top genres: {', '.join(top_genres) if top_genres else 'No top genres provided'}.\n"
                   "The user's prompt is given below:\n"
                   f"Prompt: {prompt}\n"
                   "Give much more precedence to the prompt than their general music taste"
    }]
    # Make the chat completion request with the updated messages list
    chat_response = chat_completion_request(
        messages, tools=tools, tool_choice={"type": "function", "function": {"name": "get_recommendation_seeds"}}
    )
    
    # Extract the assistant message from the response
    assistant_message = chat_response.choices[0].message
    messages.append(assistant_message)
    
    return extract_function_call(assistant_message)
