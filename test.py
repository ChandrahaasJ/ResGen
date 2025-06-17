def inject_prompt_template(context: str, latest_response: str, prompt_file_path: str) -> str:
    """
    Injects context and latest response into a prompt template file.
    
    Args:
        context (str): The context to be injected into {context}
        latest_response (str): The latest response to be injected into {latest_response}
        prompt_file_path (str): Path to the prompt template file
        
    Returns:
        str: The prompt template with injected values
    """
    try:
        # Read the prompt template file
        with open(prompt_file_path, 'r', encoding='utf-8') as file:
            prompt_template = file.read()
        
        # Replace the placeholders with actual values
        filled_prompt = prompt_template.replace('{context}', context)
        filled_prompt = filled_prompt.replace('{latest_response}', latest_response)
        
        return filled_prompt
        
    except FileNotFoundError:
        raise FileNotFoundError(f"Prompt template file not found at: {prompt_file_path}")
    except Exception as e:
        raise Exception(f"Error processing prompt template: {str(e)}")

# Example usage
if __name__ == "__main__":
    # Example inputs
    sample_context = '{"name": "John", "phone": "1234567890"}'
    sample_response = "My email is john@example.com"
    prompt_path = "classes/HR/prompts/loop_promt.md"
    
    # Test the function
    result = inject_prompt_template(sample_context, sample_response, prompt_path)
    print(result) 