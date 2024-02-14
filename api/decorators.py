import time

def retry(max_retries, backoff):
    def decorator(func):
        def wrapper(*args, **kwargs):
            retries = 0
            if retries < max_retries:
                try:
                    result = func(*args, **kwargs)
                    return result
                except Exception as e:
                    retries += 1
                    time.sleep(backoff)
            else:
                return "Max retries exceeded.", 500
        return wrapper
    return decorator
    