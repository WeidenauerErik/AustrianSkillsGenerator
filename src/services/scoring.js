/**
 * scoring.js
 * Calls OpenAI to generate a CIS-compatible marking scheme JSON from a task.
 */

const SCORING_PROMPT = `You are generating a professional CIS (Competition Information System) marking scheme for an AustrianSkills Web Development competition.

Based on the provided competition task JSON, generate a detailed marking scheme in CIS Import format.

WSSS Sections (fixed, always use these exactly):
1 - Work organization and self-management (5 marks total)
2 - Communication and interpersonal skills (5 marks total)
3 - Design Implementation (25 marks total)
4 - Front-End Development (25 marks total)
5 - Back-End Development (40 marks total)

RULES:
- Each module in the task becomes one criterion (A, B, C, ...)
- Each criterion must have 3-5 sub-criteria
- Each sub-criterion must have 2-5 aspects
- Use aspect type "M" (Measurement) for objectively testable features (pass/fail)
- Use aspect type "J" (Judgement) for subjective quality aspects
- J aspects MUST have exactly 4 score levels: 0, 1, 2, 3 (from poor to excellent)
- M aspects have a clear requirement description and an extra description for test method
- Map each aspect to the most fitting WSSS section (1-5)
- Points per criterion must EXACTLY match the module's points from the input
- Reference user stories as [US#N] in aspect descriptions where relevant
- Use clear, professional English
- The sum of all criterion marks must equal the total competition points

OUTPUT: Valid JSON only. No markdown, no explanation.

INPUT TASK:
{{TASK_JSON}}

OUTPUT STRUCTURE:
{
  "competitionTitle": "string (e.g. 17 Web Development)",
  "year": "string (e.g. 2025)",
  "wsssSections": [
    { "id": 1, "name": "Work organization and self-management", "marks": 5 },
    { "id": 2, "name": "Communication and interpersonal skills", "marks": 5 },
    { "id": 3, "name": "Design Implementation", "marks": 25 },
    { "id": 4, "name": "Front-End Development", "marks": 25 },
    { "id": 5, "name": "Back-End Development", "marks": 40 }
  ],
  "criteria": [
    {
      "id": "A",
      "title": "string",
      "totalMark": 20,
      "subCriteria": [
        {
          "id": "A1",
          "name": "string",
          "dayOfMarking": "Any",
          "aspects": [
            {
              "type": "J",
              "description": "Aspect description [US#3]",
              "maxMark": 3,
              "wsssSection": 3,
              "scores": [
                { "score": 0, "description": "Not implemented or non-functional" },
                { "score": 1, "description": "Partially implemented with major issues" },
                { "score": 2, "description": "Mostly correct, minor issues" },
                { "score": 3, "description": "Fully correct, polished, professional" }
              ]
            },
            {
              "type": "M",
              "description": "Feature is present and functional [US#1]",
              "maxMark": 1,
              "wsssSection": 4,
              "extraDescription": "Feature loads and responds correctly",
              "requirement": "Verify feature is accessible and works as expected"
            }
          ]
        }
      ]
    }
  ]
}`

/**
 * Generate a marking scheme from task data.
 * @param {string} apiKey
 * @param {object} taskData - The generated task JSON
 * @returns {Promise<object>} Parsed marking scheme JSON
 */
export async function generateMarkingScheme(apiKey, taskData) {
  const prompt = SCORING_PROMPT.replace(
    '{{TASK_JSON}}',
    JSON.stringify(taskData, null, 2)
  )

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      max_output_tokens: 4000,
      input: prompt
    })
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `HTTP ${response.status}`)
  }

  const data = await response.json()
  const raw = data?.output?.[0]?.content?.[0]?.text ?? ''
  const cleaned = raw
    .replace(/^```(?:json)?\n?/m, '')
    .replace(/\n?```$/m, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Ungültige Antwort vom Modell. Bitte erneut versuchen.')
  }
}
