# BlackPearl engineering rules

- This is a white-hat cybersecurity app.
- Keep active testing local-only: localhost, loopback, or deliberately local lab targets.
- Do not add credential theft, malware, persistence, privilege escalation, evasion, destructive exploitation, or unauthorized remote scanning.
- Preserve Android Back navigation.
- Prefer platform Android APIs and avoid unnecessary dependencies.
- Keep modules separated as the project grows; avoid turning MainActivity into an unmaintainable monolith.
- Before changing build tooling, inspect the current AndroidIDE-compatible toolchain.
- Every change must compile before the next phase.
