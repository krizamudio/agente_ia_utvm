# agent.py

import anthropic
import os
from dotenv import load_dotenv
from prompts import SYSTEM_PROMPT, build_user_prompt

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def generar_planeacion(materia: str, tema: str, espacio: str, perfil: str) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1500,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": build_user_prompt(materia, tema, espacio, perfil)
            }
        ]
    )
    return message.content[0].text