import time

def retry(max_retries=5, backoff=1):
    def decorator(func):
        def wrapper(*args, **kwargs):
            retries = 0
            most_recent_exception = ""
            while retries < max_retries:
                try:
                    result = func(*args, **kwargs)
                    return result
                except Exception as e:
                    retries += 1
                    time.sleep(backoff * retries)
                    print("trying again")
                    most_recent_exception = e
            return repr(most_recent_exception), 500
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator
    