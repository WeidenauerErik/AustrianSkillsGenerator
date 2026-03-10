// openai.js – handles task generation via OpenAI Responses API

const PROMPT_TEMPLATE = `You are generating a professional competition task for the AustrianSkills Web Development competition.

The user will only provide a THEME for the project and optionally the number of MODULES.

Your job is to generate a detailed and realistic competition assignment consisting of several modules that together build a coherent web development project.

The output MUST be valid JSON and follow the exact structure defined below.
Do NOT include explanations, markdown, or additional text.

INPUT
Theme: {{USER_PROMPT}}
ModuleCount: {{MODEL_COUNT}}

If ModuleCount is not provided, default to 5 modules.

GENERAL REQUIREMENTS
* The scenario must be realistic and similar to professional web development assignments.
* The entire project must revolve around the given theme.
* Each module must test a different competency of modern web development.
* Modules should be independent but still part of the same ecosystem.
* Each module should be solvable in about 3-4 hours.
* Use modern technologies such as HTML, CSS, JavaScript, REST APIs, databases, and responsive design.
* Use clear and professional English.

USER STORIES
Each module must contain 8-12 user stories.
User stories MUST follow the format: "As a [role], I want [function], so that [benefit]."

OUTPUT STRUCTURE (JSON)
{
  "title": "string",
  "theme": "string",
  "introduction": {
    "overallScenario": "string",
    "marking": "string"
  },
  "modulesOverview": [
    { "module": "A", "duration": "string", "points": number, "focus": "string" }
  ],
  "modules": [
    {
      "module": "A",
      "title": "string",
      "overview": "string",
      "timebox": "string",
      "points": number,
      "userStories": ["string"]
    }
  ]
}

IMPORTANT RULES
* Modules labeled alphabetically from A.
* modulesOverview and modules must match.
* Timebox usually 3.5h.
* Points sum to ~100 total.
* Scenario must clearly relate to the theme.`

export async function generateTask(apiKey, userPrompt, moduleCount) {
  const prompt = PROMPT_TEMPLATE
    .replaceAll('{{USER_PROMPT}}', userPrompt)
    .replaceAll('{{MODEL_COUNT}}', moduleCount ?? 5)

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      input: prompt
    })
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `HTTP ${response.status}`)
  }

  const data = await response.json()
  const raw = data?.output?.[0]?.content?.[0]?.text ?? ''
  const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Ungültige Antwort vom Modell. Bitte erneut versuchen.')
  }
}
