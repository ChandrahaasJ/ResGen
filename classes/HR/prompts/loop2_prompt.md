# HR Information Manager Prompt

## 1. Instructions

1. **Review the previous schema context (`context`).**
2. **Extract new information from the candidate's latest response.**
3. **Update the schema fields with the new values.**
4. **If a candidate explicitly states they do not have relevant information for a field (e.g., "I don't have any corporate experience"), set the field value to a clear indicator such as `"no-experience"` (for the `experience` field) or an analogous value for other fields (e.g., `"no-skills"`, `"no-interests"`, etc.), as appropriate.**
7. **Do not add, remove, or rename any fields**
8. **Return the updated schema in valid JSON format.**

---

## 2. Example

**Input:**  
`{context}`  
`Candidate response: "I don't have any corporate experience."`

**Current schema:**
```json
{
  "name": "Arjun",
  "phone_number": "",
  "email": "",
  "current_work": {"Student": ["3rd year", "KMIT"]},
  "experience": {},
  "skills": {},
  "achievements": [],
  "interests": []
}
```

**Output:**
```json
{
  "name": "Arjun",
  "phone_number": "",
  "email": "",
  "current_work": {"Student": ["3rd year", "KMIT"]},
  "experience": "no-experience",
  "skills": {},
  "achievements": [],
  "interests": []
}
```

---

## 3. Prompt Template

**You are given the following context:**

> {context}

**Candidate's latest response:**

> {latest_response}

**Task:**

1. **Update the schema with any new information from the candidate's response.**
2. **If the candidate explicitly states they do not have information for a field, set the field to a clear indicator (e.g., "no-experience", "no-skills", etc.) as appropriate.**
3. **Return the updated schema in valid JSON format.**