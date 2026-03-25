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

MODULE DESIGN GUIDELINES
Modules should cover areas such as:
- Frontend design
- Interactive JavaScript features
- Backend API development
- Data visualization / integration
- Security, testing, or improvements

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

/**
 * Generate a task using the OpenAI Responses API.
 * @param {string} apiKey
 * @param {string} userPrompt
 * @param {number} modelCount
 * @returns {Promise<object>} Parsed JSON task
 */
export async function generateTask(apiKey, userPrompt, modelCount) {
  const prompt = PROMPT_TEMPLATE
    .replaceAll('{{USER_PROMPT}}', userPrompt)
    .replaceAll('{{MODEL_COUNT}}', modelCount ?? 5)

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
    const msg = body?.error?.message ?? `HTTP ${response.status}`
    throw new Error(msg)
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

const USER_STORY_EDIT_PROMPT = `You are revising user stories for a module in an AustrianSkills Web Development competition task.

Return valid JSON only. No markdown, no explanation.

INPUT
Task title: {{TASK_TITLE}}
Task theme: {{TASK_THEME}}
Module: {{MODULE_ID}} - {{MODULE_TITLE}}
Module overview: {{MODULE_OVERVIEW}}
Current user stories:
{{CURRENT_STORIES}}

Edit instruction:
{{EDIT_PROMPT}}

RULES
- Return 8-12 user stories.
- Keep the stories aligned with the module overview and task theme.
- Use clear professional English.
- Every item must follow this format exactly:
  "As a [role], I want [function], so that [benefit]."
- Keep the scope realistic for a competition module.

OUTPUT STRUCTURE
{
  "userStories": ["string"]
}`

export async function rewriteUserStories(apiKey, taskData, moduleData, editPrompt) {
  const prompt = USER_STORY_EDIT_PROMPT
    .replaceAll('{{TASK_TITLE}}', taskData.title)
    .replaceAll('{{TASK_THEME}}', taskData.theme)
    .replaceAll('{{MODULE_ID}}', moduleData.module)
    .replaceAll('{{MODULE_TITLE}}', moduleData.title)
    .replaceAll('{{MODULE_OVERVIEW}}', moduleData.overview)
    .replaceAll(
      '{{CURRENT_STORIES}}',
      moduleData.userStories.map((story, index) => `${index + 1}. ${story}`).join('\n')
    )
    .replaceAll('{{EDIT_PROMPT}}', editPrompt.trim())

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
    const msg = body?.error?.message ?? `HTTP ${response.status}`
    throw new Error(msg)
  }

  const data = await response.json()
  const raw = data?.output?.[0]?.content?.[0]?.text ?? ''
  const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error('Ungültige Antwort vom Modell. Bitte erneut versuchen.')
  }

  const stories = Array.isArray(parsed?.userStories)
    ? parsed.userStories.map((story) => String(story).trim()).filter(Boolean)
    : []

  if (stories.length === 0) {
    throw new Error('Das Modell hat keine gültigen User Stories zurückgegeben.')
  }

  return stories
}
