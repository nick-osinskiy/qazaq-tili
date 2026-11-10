import ts from 'typescript'
import { readFile } from 'node:fs/promises'

function property(node, name) {
  if (!node || !ts.isObjectLiteralExpression(node)) {
    throw new Error('Speech catalog expects literal object entries; found a dynamic value.')
  }
  return node.properties.find(entry =>
    ts.isPropertyAssignment(entry) &&
    (ts.isIdentifier(entry.name) || ts.isStringLiteral(entry.name)) &&
    entry.name.text === name
  )?.initializer
}

function stringValue(node, label) {
  if (!node || !(ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))) {
    throw new Error('Expected a literal text value for ' + label)
  }
  return node.text
}

function arrayValue(node, label) {
  if (!node || !ts.isArrayLiteralExpression(node)) {
    throw new Error('Expected a literal array for ' + label)
  }
  return node.elements
}

function getObjects(source, variableName) {
  let result
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === variableName) {
        result = arrayValue(declaration.initializer, variableName)
      }
    }
  }
  if (!result) throw new Error('Missing literal catalog section: ' + variableName)
  return result
}

export function extractSpeechEntries(code) {
  const source = ts.createSourceFile('content.ts', code, ts.ScriptTarget.Latest, true)
  const entries = []
  const keys = new Set()
  function add(key, text) {
    if (keys.has(key)) throw new Error('Duplicate narration key: ' + key)
    if (!text.trim()) throw new Error('Empty narration text: ' + key)
    if (text.length > 1200) throw new Error('Narration exceeds 1200 characters: ' + key)
    keys.add(key)
    entries.push({ key, text })
  }
  for (const item of getObjects(source, 'words')) {
    const id = stringValue(property(item, 'id'), 'word.id')
    add('word:' + id + ':main', stringValue(property(item, 'word'), 'word.word'))
    arrayValue(property(item, 'examples'), 'word.examples').forEach((example, index) => {
      add('word:' + id + ':example:' + index, stringValue(property(example, 'kk'), 'word.example.kk'))
    })
  }
  for (const item of getObjects(source, 'phrases')) {
    const id = stringValue(property(item, 'id'), 'phrase.id')
    add('phrase:' + id + ':main', stringValue(property(item, 'phrase'), 'phrase.phrase'))
  }
  for (const item of getObjects(source, 'readings')) {
    const id = stringValue(property(item, 'id'), 'reading.id')
    arrayValue(property(item, 'paragraphs'), 'reading.paragraphs').forEach((paragraph, index) => {
      add('reading:' + id + ':paragraph:' + index, stringValue(property(paragraph, 'kk'), 'reading.paragraph.kk'))
    })
  }
  for (const item of getObjects(source, 'grammar')) {
    const id = stringValue(property(item, 'id'), 'grammar.id')
    arrayValue(property(item, 'examples'), 'grammar.examples').forEach((example, index) => {
      add('grammar:' + id + ':example:' + index, stringValue(property(example, 'kk'), 'grammar.example.kk'))
    })
  }
  return entries
}

export async function readSpeechEntries(path = 'src/data/content.ts') {
  return extractSpeechEntries(await readFile(path, 'utf8'))
}

export function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

export function makeSsml(text, voice) {
  if (!['kk-KZ-AigulNeural', 'kk-KZ-DauletNeural'].includes(voice)) throw new Error('Unsupported Kazakh voice')
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="kk-KZ"><voice name="${voice}">${escapeXml(text)}</voice></speak>`
}
