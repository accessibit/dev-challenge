# AUD-142 — Permettere ai clienti di marcare finding come "accettati"

**Tipo:** feature · **Priorità:** alta · **Richiesto da:** Customer Success (Giulia) · **Owner:** tu

## Contesto

Acme Fitness (`fixtures/acme`) usa `a11y-audit` nella loro CI da due mesi. Ieri il loro
CTO ci ha scritto che il report è "pieno di rumore": una dozzina di finding che loro
considerano falsi positivi o cose che non possono sistemare (per esempio il widget chat
di un fornitore esterno, di cui non controllano il markup). Hanno detto che se non
risolviamo entro la settimana disattivano il check in CI.

Giulia ha promesso loro un modo per marcare i finding come "accettati", così che non
continuino a comparire e non facciano fallire la build.

Questa cosa la chiedono anche altri clienti, quindi vale la pena farla bene.

## Richiesta

Aggiungere il supporto a un file di configurazione `a11y.config.json`, letto dalla
working directory in cui viene lanciato il comando. Giulia ha abbozzato con il cliente
qualcosa del genere:

```json
{
  "suppressions": [
    { "rule": "iframe-title", "reason": "Widget chat del fornitore, ticket VEND-231 aperto" }
  ]
}
```

I finding "accettati" non devono far fallire la build.

## Criteri di accettazione

- Con un `a11y.config.json` adeguato, Acme deve poter arrivare a una CI verde.
- Senza file di configurazione il comportamento non cambia.
- Preparare un `a11y.config.json` di esempio per Acme in `fixtures/acme/` (Giulia lo
  manderà al cliente così com'è).
- Test.

## Note

Il PM (Luca) è in ferie fino a lunedì. Se qualcosa non è chiaro decidi tu e scrivilo
in `NOTES.md`: preferiamo una decisione ragionata e documentata a un blocco.
