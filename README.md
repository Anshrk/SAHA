# 🧠 Legal Intake Assistant (LLM-powered)

This is an AI-powered legal intake assistant built using **ReactJS, Streamlit**, **LlamaIndex**, **LangChain**, and **Ollama** (with the LLaMA3 model). It helps users describe their legal problems, identifies the relevant area of law, and suggests the type of lawyer they should consult. Optionally, it can display a list of matching lawyers from a CSV file.

---

## 🚀 Features

- Conversational interface to collect user input.
- Guided questions (max 5) to identify the user's legal issue.
- Smart recommendation of lawyer type.
- Integration with a document-based **RAG system** using `llama_index`.
- Displays a list of suitable lawyers from a local CSV database.
- Gracefully ends the conversation with a final recommendation.
- Option to restart a new consultation.

---

## 🧱 Tech Stack

- **Frontend:** Streamlit, React JS
- **LLM Backend:** LangChain + Ollama (LLaMA3)
- **Embeddings:** HuggingFace (`all-mpnet-base-v2`)
- **Indexing/RAG:** LlamaIndex
- **Data:** CSV with lawyer details
- **Language:** Python 3.10+

---
