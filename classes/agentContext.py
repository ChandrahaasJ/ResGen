
class ContextManager:
    def __init__(self):
        self.context = {}

    def add_memory(self, iteration_key, data, subkey=None):
        """
        Add memory to a specific iteration.
        If subkey is provided, add/update that subkey in the iteration.
        If not, set the entire iteration to data.
        """
        if iteration_key not in self.context:
            self.context[iteration_key] = {}
        if subkey:
            self.context[iteration_key][subkey] = data
        else:
            self.context[iteration_key] = data

    def get_memory(self, iteration_key=None):
        """
        Retrieve memory for a specific iteration, or all if not specified.
        """
        if iteration_key:
            return self.context.get(iteration_key, None)
        return self.context
        

#Create an instance
cm = ContextManager()

# Add a new iteration with full data
cm.add_memory("iteration 1", {
    "agent1": "Tell me about yourself",
    "reply": "This is Pravalika...",
    "agent2": {"name": "Pravalika"},
    "heuristic 1": {"name": "Pravalika", "missed": ["phone_number"]}
})

# Add a subkey to an existing iteration
cm.add_memory("iteration 1", "Thank you for the information.", subkey="agent3")

# Add a completely new iteration
cm.add_memory("iteration 2", {
    "agent": "Please provide your phone number.",
    "user": "my email is ...",
    "agent2": {"name": "Pravalika"},
    "heuristic 2": {"name": "Pravalika", "missed": []}
})

# Retrieve a specific iteration
print("Iteration 1:", cm.get_memory("iteration 1"))
print("\n\n")
print("============================================================")
print("\n\n")
cm.add_memory("iteration 3",{"agent": "Please provide your phone number.",
    "user": "my email is ...",
    "agent2": {"name": "Pravalika"},
    "heuristic 2": {"name": "Pravalika", "missed": []}})

# Retrieve all context
print("All context:", cm.get_memory())