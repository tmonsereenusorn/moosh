from openai import OpenAI
client = OpenAI()

# Upload jsonl files used for finetuning
upload_response = client.files.create(
  file=open("mydata.jsonl", "rb"),
  purpose="fine-tune"
)
file_id = upload_response.id
print("(STORE THIS VALUE IN model_info.txt) Training File ID: " + file_id)

# Create fine-tuning job on the uploaded file
fine_tune_response = client.fine_tuning.jobs.create(
    training_file=file_id,
    model="gpt-3.5-turbo"
)
job_id = fine_tune_response["id"]
print("(STORE THIS VALUE IN model_info.txt) Fine-tune Job ID: " + job_id)

# Get fine-tuned model name to use
job_details = client.fine_tuning.jobs.retrieve(job_id)
fine_tuned_model_name = job_details["fine_tuned_model"]
print("(STORE THIS VALUE IN model_info.txt) Fine-tune Model Name: " + fine_tuned_model_name)

response = client.Completion.create(
  model=fine_tuned_model_name,
  prompt="Some prompt",
  max_tokens=50
)