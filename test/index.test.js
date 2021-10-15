import { expect } from 'chai'
import { interactWith, loadDialogue, clearDialogue } from '../src/index'

const MAYOR_LEONARD = 'mayorLeonard'
const TOOK_MAYOR_QUEST_STATE = 'tookMayorQuest'
const COMPLETED_MAYOR_QUEST_STATE = 'completedMayorQuest'
const MAYOR_LIKES_YOU_STATE = 'mayorLikes'

const initialLeonardState = () => ({
  [TOOK_MAYOR_QUEST_STATE]: false,
  [COMPLETED_MAYOR_QUEST_STATE]: false,
  [MAYOR_LIKES_YOU_STATE]: true
})

let LeonardState = initialLeonardState()

const takeQuest = () => LeonardState[TOOK_MAYOR_QUEST_STATE] = true
const dislikePlayer = () => LeonardState[MAYOR_LIKES_YOU_STATE] = false
const isQuestUnfinished = () => LeonardState[TOOK_MAYOR_QUEST_STATE] === true && LeonardState[COMPLETED_MAYOR_QUEST_STATE] === false

const LeonardDialogues = [{
  id: 1,
  message: 'Would you like to take my quest?',
  choices: [2, 3]
}, {
  id: 2,
  message: 'Sure, I\'ll take it.',
  post: takeQuest,
  next: 4
}, {
  id: 3,
  message: 'Nah, not worth my time.',
  post: dislikePlayer,
  next: 5
}, {
  id: 4,
  pre: isQuestUnfinished,
  preId: 7,
  message: 'Fantastic news! I\'ll send word for them to expect you.',
  choices: [6]
}, {
  id: 5,
  message: 'Suit yourself.',
  choices: [6]
}, {
  id: 6,
  message: 'Goodbye.'
}, {
  id: 7,
  message: 'Uh, shouldn\'t you be out helping those villagers?'
}]

describe('Dialogue', function() {

  beforeEach(() => {
    clearDialogue(MAYOR_LEONARD)
    LeonardState = initialLeonardState()
    loadDialogue(MAYOR_LEONARD, LeonardDialogues)
  })

  it('should get initial dialogue', () => {
    const result = interactWith(MAYOR_LEONARD)
    expect(result.dialogue).to.exist
  })

  it('should starts with the first item in the dialogues array', () => {
    const result = interactWith(MAYOR_LEONARD)
    expect(result.dialogue.id).to.eql(1)
  })

  it('should hydrate dialogue with choices with actual dialogues', () => {
    const result = interactWith(MAYOR_LEONARD)
    expect(result.dialogue.choices).to.eql([2,3])
    expect(result.dialogue.prompts.length).to.eql(2)
  })

  it('should send in choice id to move the npc to the choice\'s next dialogue', () => {
    const initial = interactWith(MAYOR_LEONARD)
    const choiceId = initial.dialogue.choices[0]
    const choiceNextId = initial.dialogue.prompts[0].next

    const interacted = interactWith(MAYOR_LEONARD, choiceId)

    expect(interacted.dialogue.id).to.eql(choiceNextId)
  })

  it('should see post callback run when dialogue choice action includes it', () => {
    const initial = interactWith(MAYOR_LEONARD)
    const choiceId = initial.dialogue.choices[0]
    expect(LeonardState[TOOK_MAYOR_QUEST_STATE]).to.eql(false)

    interactWith(MAYOR_LEONARD, choiceId)
    expect(LeonardState[TOOK_MAYOR_QUEST_STATE]).to.eql(true)
  })
})