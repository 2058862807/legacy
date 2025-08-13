const api = 'http://localhost:7861'

const out = document.getElementById('out')
document.getElementById('run').onclick = async () => {
  const provider = document.getElementById('provider').value
  const model = document.getElementById('model').value
  const prompt = document.getElementById('prompt').value
  const r = await fetch(api + '/llm/complete', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({provider, model, prompt})
  })
  const j = await r.json()
  out.textContent = j.output || JSON.stringify(j, null, 2)
  speak(j.output || 'Done')
}

document.getElementById('push').onclick = async () => {
  const repo_path = document.getElementById('repo').value
  const message = document.getElementById('msg').value || 'update'
  const r = await fetch(api + '/git/push', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({repo_path, message})
  })
  const j = await r.json()
  document.getElementById('gitout').textContent = JSON.stringify(j, null, 2)
}

document.getElementById('deploy').onclick = async () => {
  const project_dir = document.getElementById('proj').value
  const r = await fetch(api + '/vercel/deploy', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({project_dir, prod: true})
  })
  const j = await r.json()
  document.getElementById('vercelout').textContent = JSON.stringify(j, null, 2)
}

document.getElementById('send').onclick = async () => {
  const thread_query = document.getElementById('search').value || 'UNSEEN'
  const reply_text = document.getElementById('reply').value
  const r = await fetch(api + '/email/reply', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({thread_query, reply_text, dry_run: false})
  })
  const j = await r.json()
  document.getElementById('mailout').textContent = JSON.stringify(j, null, 2)
}

function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices()
    const female = voices.find(v => /female|zira|sara|arnaud|samantha|victoria|zira/i.test(v.name)) || voices[0]
    if (female) u.voice = female
    window.speechSynthesis.speak(u)
  } catch(e) {
    console.log(e)
  }
}

document.getElementById('listen').onclick = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser')
    return
  }
  const rec = new webkitSpeechRecognition()
  rec.lang = 'en-US'
  rec.interimResults = false
  rec.maxAlternatives = 1
  rec.onresult = (e) => {
    const t = e.results[0][0].transcript
    document.getElementById('prompt').value = t
    speak('Heard ' + t)
  }
  rec.start()
}

document.getElementById('speak').onclick = () => {
  const t = document.getElementById('prompt').value || 'Ready'
  speak(t)
}
