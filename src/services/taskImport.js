function ensureString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} fehlt oder ist ungültig.`)
  }
}

function ensureArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} fehlt oder ist leer.`)
  }
}

export function parseImportedTask(rawJson) {
  let parsed

  try {
    parsed = JSON.parse(rawJson)
  } catch {
    throw new Error('Die Datei enthält kein gültiges JSON.')
  }

  ensureString(parsed?.title, 'Titel')
  ensureString(parsed?.theme, 'Thema')
  ensureString(parsed?.introduction?.overallScenario, 'Einführungsszenario')
  ensureString(parsed?.introduction?.marking, 'Bewertungshinweis')
  ensureArray(parsed?.modulesOverview, 'Modulübersicht')
  ensureArray(parsed?.modules, 'Module')

  parsed.modulesOverview.forEach((item, index) => {
    ensureString(item?.module, `Modulübersicht Eintrag ${index + 1}`)
    ensureString(item?.duration, `Dauer für Modul ${item.module}`)
    ensureString(item?.focus, `Schwerpunkt für Modul ${item.module}`)
    if (typeof item?.points !== 'number') {
      throw new Error(`Punkte für Modul ${item.module} sind ungültig.`)
    }
  })

  parsed.modules.forEach((module, index) => {
    ensureString(module?.module, `Modul-ID ${index + 1}`)
    ensureString(module?.title, `Titel für Modul ${module.module}`)
    ensureString(module?.overview, `Übersicht für Modul ${module.module}`)
    ensureString(module?.timebox, `Zeitfenster für Modul ${module.module}`)
    if (typeof module?.points !== 'number') {
      throw new Error(`Punkte für Modul ${module.module} sind ungültig.`)
    }
    ensureArray(module?.userStories, `User Stories für Modul ${module.module}`)
  })

  return parsed
}
